"""
MicroStrategy Scheduler -- extraccion automatica periodica de datos del dossier.

Ejecuta la extraccion cada N minutos y guarda el resultado en data/mstr_cache.csv.
Thread-safe para uso con FastAPI.
"""

from __future__ import annotations

import csv
import json
import os
import threading
import traceback
from datetime import datetime
from pathlib import Path

from mstr.config import MstrConfig
from mstr.auth import MstrSession
from mstr.client import (
    resolve_project_id,
    detect_object_type,
    create_report_instance,
    fetch_report_page,
    get_dossier_definition,
    create_dossier_instance,
    fetch_dossier_visualization,
    list_dossier_visualizations,
)
from mstr.parser import extract_columns, extract_rows, extract_dossier_grid

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CACHE_CSV = os.path.join(DATA_DIR, "mstr_cache.csv")
STATUS_FILE = os.path.join(DATA_DIR, "mstr_last_sync.json")

# Thread lock for safe access
_lock = threading.Lock()
_cached_data = {"columns": [], "rows": [], "timestamp": None, "error": None, "row_count": 0}


def get_cached_data():
    """Return a copy of the cached data (thread-safe)."""
    with _lock:
        return dict(_cached_data)


def _save_status(success: bool, row_count: int, error: str | None = None):
    os.makedirs(DATA_DIR, exist_ok=True)
    status = {
        "last_sync": datetime.now().isoformat(),
        "success": success,
        "row_count": row_count,
        "error": error,
    }
    with open(STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump(status, f, indent=2, ensure_ascii=False)


def get_sync_status():
    """Read the last sync status from disk."""
    if os.path.exists(STATUS_FILE):
        try:
            with open(STATUS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"last_sync": None, "success": False, "row_count": 0, "error": "Never synced"}


def _load_cache_from_disk():
    """Load CSV cache from disk into memory."""
    global _cached_data
    if not os.path.exists(CACHE_CSV):
        return

    try:
        with open(CACHE_CSV, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            columns = next(reader, [])
            rows = [row for row in reader]

        with _lock:
            _cached_data["columns"] = columns
            _cached_data["rows"] = rows
            _cached_data["row_count"] = len(rows)
            _cached_data["timestamp"] = datetime.now().isoformat()
            _cached_data["error"] = None

        print(f"[MSTR CACHE] Loaded {len(rows)} rows from disk cache")
    except Exception as e:
        print(f"[MSTR CACHE] Error loading disk cache: {e}")


def run_extraction(report_id: str | None = None):
    """Run the MicroStrategy extraction and update the cache."""
    global _cached_data

    from dotenv import load_dotenv
    load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

    report_id = report_id or os.getenv("MSTR_REPORT_ID", "")
    if not report_id:
        print("[MSTR SCHEDULER] No MSTR_REPORT_ID configured, skipping extraction")
        return

    print(f"[MSTR SCHEDULER] Starting extraction at {datetime.now().isoformat()}")

    try:
        config = MstrConfig.from_env(os.path.join(BASE_DIR, ".env"))

        with MstrSession(config) as ctx:
            project_id = resolve_project_id(ctx.session, config, ctx.token)
            print(f"[MSTR SCHEDULER] Project resolved -> Virtualsoft")

            obj_type = detect_object_type(ctx.session, config, ctx.token, project_id, report_id)
            print(f"[MSTR SCHEDULER] Object type: {obj_type}")

            all_columns = []
            all_rows = []

            if obj_type == "report":
                instance_id = create_report_instance(ctx.session, config, ctx.token, project_id, report_id)
                offset = 0
                limit = 50_000
                metric_names = []
                while True:
                    payload = fetch_report_page(ctx.session, config, ctx.token, project_id, report_id, instance_id, offset, limit)
                    if payload is None:
                        break
                    result = payload["result"]
                    if offset == 0:
                        all_columns, metric_names = extract_columns(result)
                    rows = extract_rows(result, metric_names, len(all_columns))
                    if not rows:
                        break
                    all_rows.extend(rows)
                    if len(rows) < limit:
                        break
                    offset += limit

            else:  # dossier
                definition = get_dossier_definition(ctx.session, config, ctx.token, project_id, report_id)
                viz_list = list_dossier_visualizations(definition)
                if not viz_list:
                    raise RuntimeError("Dossier sin visualizaciones")

                instance_id, mid = create_dossier_instance(ctx.session, config, ctx.token, project_id, report_id)

                for viz in viz_list:
                    try:
                        payload = fetch_dossier_visualization(
                            ctx.session, config, ctx.token, project_id, report_id,
                            instance_id, viz["chapter_key"], viz["visualization_key"],
                        )
                    except Exception as e:
                        print(f"[MSTR SCHEDULER] Skip viz '{viz['visualization_name']}': {e}")
                        continue

                    if payload is None:
                        continue

                    try:
                        viz_columns, viz_rows = extract_dossier_grid(payload)
                    except Exception as e:
                        print(f"[MSTR SCHEDULER] Parse error for '{viz['visualization_name']}': {e}")
                        continue

                    if not viz_rows:
                        continue

                    if not all_columns:
                        all_columns = viz_columns
                    all_rows.extend(viz_rows)
                    break  # Take first visualization with data (Detalle producto)

        if not all_rows:
            raise RuntimeError("No se extrajeron filas")

        # Save to CSV cache
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(CACHE_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(all_columns)
            writer.writerows(all_rows)

        # Update in-memory cache
        with _lock:
            _cached_data["columns"] = all_columns
            _cached_data["rows"] = all_rows
            _cached_data["row_count"] = len(all_rows)
            _cached_data["timestamp"] = datetime.now().isoformat()
            _cached_data["error"] = None

        _save_status(True, len(all_rows))
        print(f"[MSTR SCHEDULER] Extraction complete: {len(all_rows)} rows, {len(all_columns)} columns")

    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"[MSTR SCHEDULER] Extraction failed: {error_msg}")
        traceback.print_exc()

        with _lock:
            _cached_data["error"] = error_msg

        _save_status(False, _cached_data.get("row_count", 0), error_msg)


def start_scheduler():
    """Start the background extraction scheduler."""
    from dotenv import load_dotenv
    load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

    interval_minutes = int(os.getenv("MSTR_SYNC_INTERVAL_MINUTES", "60"))

    # Load existing cache from disk on startup
    _load_cache_from_disk()

    def _scheduler_loop():
        import time as _time
        while True:
            try:
                run_extraction()
            except Exception as e:
                print(f"[MSTR SCHEDULER] Unhandled error: {e}")
            _time.sleep(interval_minutes * 60)

    thread = threading.Thread(target=_scheduler_loop, daemon=True)
    thread.start()
    print(f"[MSTR SCHEDULER] Background scheduler started (every {interval_minutes} min)")
