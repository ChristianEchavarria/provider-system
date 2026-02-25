from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.responses import Response, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from provider_logic import load_data, generate_dashboard_stats, analyze_compliance, simulate_activity_log
from processor import ImageProcessor
from typing import List, Optional
import uvicorn
import sys
import os
import json
import time
import traceback
import csv
import threading

# =============================
# PATH CONFIGURATION
# =============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Add vision-processor to path
VISION_PATH = os.path.abspath(os.path.join(BASE_DIR, '../vision-processor'))
if VISION_PATH not in sys.path:
    sys.path.append(VISION_PATH)

# Ensure current directory is in path (fixes ModuleNotFoundError when running from root)
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# =============================
# FASTAPI INIT
# =============================

app = FastAPI(
    title="Provider Intelligence Center",
    version="1.0.0"
)


# =============================
# CORS CONFIGURATION (CRITICAL)
# =============================

origins = [
    "https://casino-system-5947f.web.app",
    "https://casino-system-5947f.firebaseapp.com",
    "http://localhost",
    "http://127.0.0.1",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Stats", "X-Processing-Time"]
)


# =============================
# STATIC FILES
# =============================

STATIC_DIR = os.path.join(BASE_DIR, "static")

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
    # Mount css and js at root so relative paths in index.html work
    css_dir = os.path.join(STATIC_DIR, "css")
    js_dir = os.path.join(STATIC_DIR, "js")
    if os.path.exists(css_dir):
        app.mount("/css", StaticFiles(directory=css_dir), name="css")
    if os.path.exists(js_dir):
        app.mount("/js", StaticFiles(directory=js_dir), name="js")
    print("Static files mounted")
else:
    print("Static directory not found:", STATIC_DIR)


# =============================
# HEALTH CHECK (VERY IMPORTANT FOR RENDER)
# =============================

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": "provider-system",
        "timestamp": time.time()
    }


# =============================
# FRONTEND ENTRY
# =============================

@app.get("/")
async def read_index():
    index_path = os.path.join(STATIC_DIR, "index.html")

    if os.path.exists(index_path):
        return FileResponse(index_path)

    return JSONResponse({
        "status": "backend running",
        "message": "Frontend not found in static folder"
    })


# =============================
# DASHBOARD DATA
# =============================

def _build_mstr_dashboard():
    """Build dashboard data merging data.txt operations with MicroStrategy metrics."""
    mstr_data = get_cached_data()
    mstr_columns = mstr_data.get("columns", [])
    mstr_rows = mstr_data.get("rows", [])

    if not mstr_rows or not mstr_columns:
        return None

    # --- Load data.txt for operations/partner matrix ---
    txt_headers, txt_providers = load_data("data.txt")
    if not txt_providers:
        return None

    # Operation columns from data.txt (skip Vertical, Proveedor, Sub-proveedor)
    operation_cols = txt_headers[3:] if len(txt_headers) > 3 else []

    # --- Build MSTR metrics lookup: (provider_norm, subprov_norm) -> metrics ---
    ci = {col: i for i, col in enumerate(mstr_columns)}
    mstr_metrics = {}  # key: normalized (prov, sub) -> aggregated metrics

    def normalize(text):
        return text.strip().lower().replace(" ", "") if text else ""

    for row in mstr_rows:
        def val(col):
            idx = ci.get(col)
            if idx is None or idx >= len(row):
                return ""
            return row[idx]

        def num(col):
            v = val(col)
            try:
                return float(str(v).replace(",", "")) if v not in ("", None) else 0.0
            except (ValueError, TypeError):
                return 0.0

        prov = str(val("Nombre Proveedor")).strip()
        sub = str(val("Nombre Subproveedor")).strip()
        key = (normalize(prov), normalize(sub))

        if key not in mstr_metrics:
            mstr_metrics[key] = {
                "prov_name": prov,
                "sub_name": sub,
                "vertical": str(val("Tipo casino")).strip(),
                "estado_prov": str(val("Estado Proveedor")).strip(),
                "estado_sub": str(val("Estado Subproveedor")).strip(),
                "total_games": 0,
                "active_games": 0,
                "inactive_games": 0,
                "spins": 0,
                "apuesta": 0,
                "ggr": 0,
                "premios": 0,
                "jugadores": 0,
                "rtp_sum": 0,
                "rtp_count": 0,
            }

        m = mstr_metrics[key]
        m["total_games"] += 1
        if str(val("Estado juego")).strip().upper() == "A":
            m["active_games"] += 1
        else:
            m["inactive_games"] += 1
        m["spins"] += num("Spins")
        m["apuesta"] += num("Apuesta")
        m["ggr"] += num("GGR")
        m["premios"] += num("Premios")
        m["jugadores"] += num("Jugadores unicos")
        rtp = num("RTP")
        if rtp > 0:
            m["rtp_sum"] += rtp
            m["rtp_count"] += 1

    # --- Merge: data.txt rows enriched with MSTR metrics ---
    stats = generate_dashboard_stats(txt_providers, txt_headers)
    alerts = analyze_compliance(txt_providers, txt_headers)

    providers_matrix = []
    for p in txt_providers:
        prov = p.get("Proveedor", "").strip()
        sub = p.get("Sub-proveedor", "").strip()
        key = (normalize(prov), normalize(sub))

        # Try exact match first, then fuzzy
        m = mstr_metrics.get(key)
        if not m:
            # Try matching just by subprovider
            for mk, mv in mstr_metrics.items():
                if mk[1] == normalize(sub):
                    m = mv
                    break

        # Build enriched row (keep all operation columns from data.txt)
        row = dict(p)  # copy all original data.txt fields (Vertical, operations SI/NO)

        if m:
            row["Juegos Activos"] = m["active_games"]
            row["Juegos Inactivos"] = m["inactive_games"]
            row["Total Juegos"] = m["total_games"]
            row["Jugadores Únicos"] = int(m["jugadores"])
            row["Spins"] = int(m["spins"])
            row["Apuesta"] = round(m["apuesta"], 2)
            row["GGR"] = round(m["ggr"], 2)
            row["Premios"] = round(m["premios"], 2)
            avg_rtp = (m["rtp_sum"] / m["rtp_count"] * 100) if m["rtp_count"] > 0 else 0
            margin = (m["ggr"] / m["apuesta"] * 100) if m["apuesta"] > 0 else 0
            row["RTP %"] = round(avg_rtp, 2)
            row["Margen %"] = round(margin, 2)
            row["Estado MSTR"] = m["estado_prov"]
            row["has_mstr"] = True
        else:
            row["Juegos Activos"] = 0
            row["Juegos Inactivos"] = 0
            row["Total Juegos"] = 0
            row["Jugadores Únicos"] = 0
            row["Spins"] = 0
            row["Apuesta"] = 0
            row["GGR"] = 0
            row["Premios"] = 0
            row["RTP %"] = 0
            row["Margen %"] = 0
            row["Estado MSTR"] = "-"
            row["has_mstr"] = False

        providers_matrix.append(row)

    # Sort by GGR descending
    providers_matrix.sort(key=lambda x: x["GGR"], reverse=True)

    # Activity log from MSTR data (providers with mixed active/inactive games)
    activity_log = []
    for entry in providers_matrix[:20]:
        if entry.get("has_mstr") and entry["Juegos Inactivos"] > 0 and entry["Juegos Activos"] > 0:
            activity_log.append({
                "time": mstr_data.get("timestamp", "")[:8] if mstr_data.get("timestamp") else "--:--:--",
                "provider": entry.get("Proveedor", ""),
                "sub_provider": entry.get("Sub-proveedor", ""),
                "change": f"{entry['Juegos Activos']}A / {entry['Juegos Inactivos']}I",
                "type": "mixed"
            })

    # KPIs
    matched = [p for p in providers_matrix if p.get("has_mstr")]
    total_ggr = sum(p["GGR"] for p in matched)
    total_spins = sum(p["Spins"] for p in matched)
    total_games = sum(p["Total Juegos"] for p in matched)

    return {
        "success": True,
        "source": "microstrategy",
        "metrics": {
            "total_operations": len(operation_cols),
            "total_providers": len(providers_matrix),
            "active_providers_global": sum(stats.values()) if stats else 0,
            "compliance_rate": 98,
            "total_ggr": round(total_ggr, 2),
            "total_spins": total_spins,
            "total_games": total_games,
            "mstr_matched": len(matched),
        },
        "stats_per_operation": stats,
        "alerts": alerts,
        "activity_log": activity_log,
        "providers_matrix": providers_matrix,
        "timestamp": time.time(),
        "last_sync": mstr_data.get("timestamp"),
    }


@app.get("/api/dashboard-data")
async def get_dashboard_data():
    try:
        # Try MSTR data first
        if MSTR_AVAILABLE:
            mstr_dashboard = _build_mstr_dashboard()
            if mstr_dashboard:
                return mstr_dashboard

        # Fallback to data.txt
        headers, providers = load_data("data.txt")

        if not providers:
            return {"error": "No data found"}

        stats = generate_dashboard_stats(providers, headers)
        alerts = analyze_compliance(providers, headers)
        activity_log = simulate_activity_log(providers)

        return {
            "success": True,
            "source": "data_txt",
            "metrics": {
                "total_operations": len(headers) - 3,
                "total_providers": len(providers),
                "active_providers_global": sum(stats.values()),
                "compliance_rate": 98
            },
            "stats_per_operation": stats,
            "alerts": alerts,
            "activity_log": activity_log,
            "providers_matrix": providers[:50],
            "timestamp": time.time()
        }

    except Exception as e:
        print("❌ dashboard error:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# =============================
# ADMIN OPERATIONS
# =============================

@app.post("/api/restart-services")
async def restart_services():
    # Simulate service restart delay
    time.sleep(2)
    return {"status": "success", "message": "AI Services Restarted", "timestamp": time.time()}

@app.get("/api/admin/users")
async def get_users():
    # Mock user database
    return {
        "users": [
            {"email": "christian.echavarria@virtualsoft.com", "role": "Super Admin", "access": "Full Access", "status": "Active"},
            {"email": "admin@virtualsoft.com", "role": "Admin", "access": "Read/Write", "status": "Active"},
            {"email": "viewer@virtualsoft.com", "role": "Viewer", "access": "Read Only", "status": "Inactive"}
        ]
    }

@app.post("/api/admin/sync")
async def sync_data():
    # Force reload of data
    try:
        load_data("data.txt") 
        return {"status": "success", "message": "Data Synchronized"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =============================
# IMAGE PROCESSING ENDPOINT
# =============================

@app.post("/api/process-images")
async def process_images(files: List[UploadFile] = File(...)):

    try:
        file_data = []

        for file in files:
            content = await file.read()
            file_data.append((file.filename, content))

        # Import processor logic
        zip_bytes, stats = await ImageProcessor.process_batch(file_data)

        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={
                "Content-Disposition": "attachment; filename=virtualsoft_processed.zip",
                "X-Stats": json.dumps(stats),
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )


# =============================
# MICROSTRATEGY ANALYTICS ENDPOINTS
# =============================

# Try to import the scheduler — if MSTR credentials are not set, it will just log a warning
try:
    from mstr_scheduler import get_cached_data, get_sync_status, run_extraction, start_scheduler
    MSTR_AVAILABLE = True
except Exception as e:
    print(f"[WARNING] MicroStrategy integration not available: {e}")
    MSTR_AVAILABLE = False


@app.on_event("startup")
async def startup_event():
    if MSTR_AVAILABLE:
        try:
            start_scheduler()
            print("[STARTUP] MSTR scheduler started")
        except Exception as e:
            print(f"[STARTUP] MSTR scheduler failed: {e}")


@app.get("/api/analytics-data")
async def get_analytics_data():
    if not MSTR_AVAILABLE:
        raise HTTPException(status_code=503, detail="MicroStrategy integration not configured")

    try:
        data = get_cached_data()
        columns = data.get("columns", [])
        rows = data.get("rows", [])

        # Convert rows to list of dicts for frontend
        records = []
        for row in rows:
            record = {}
            for i, col in enumerate(columns):
                val = row[i] if i < len(row) else ""
                # Try to convert numeric values
                try:
                    if val and val != "":
                        val_clean = str(val).replace(",", "")
                        num = float(val_clean)
                        record[col] = num
                    else:
                        record[col] = val
                except (ValueError, TypeError):
                    record[col] = val
            records.append(record)

        return {
            "success": True,
            "columns": columns,
            "records": records,
            "row_count": len(records),
            "timestamp": data.get("timestamp"),
            "error": data.get("error"),
        }

    except Exception as e:
        print(f"Analytics data error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analytics-sync")
async def analytics_sync():
    if not MSTR_AVAILABLE:
        raise HTTPException(status_code=503, detail="MicroStrategy integration not configured")

    try:
        # Run extraction in a background thread to avoid blocking
        thread = threading.Thread(target=run_extraction, daemon=True)
        thread.start()
        return {"status": "started", "message": "Extraction started in background"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/analytics-status")
async def analytics_status():
    if not MSTR_AVAILABLE:
        return {"available": False, "message": "MicroStrategy integration not configured"}

    status = get_sync_status()
    return {
        "available": True,
        **status,
    }


@app.get("/api/analytics-debug")
async def analytics_debug():
    """Step-by-step diagnostic for MicroStrategy extraction."""
    steps = []
    try:
        # Step 1: Check env vars
        mstr_url = os.getenv("MICROSTRATEGY_URL") or os.getenv("MSTR_BASE_URL") or ""
        mstr_user = os.getenv("MICROSTRATEGY_USER") or os.getenv("MSTR_USERNAME") or ""
        mstr_pass = os.getenv("MICROSTRATEGY_PASSWORD") or os.getenv("MSTR_PASSWORD") or ""
        report_id = os.getenv("MSTR_REPORT_ID", "")
        steps.append({
            "step": "env_vars",
            "ok": bool(mstr_url and mstr_user and mstr_pass),
            "detail": {
                "MICROSTRATEGY_URL": mstr_url[:50] + "..." if len(mstr_url) > 50 else mstr_url,
                "MICROSTRATEGY_USER": mstr_user,
                "MSTR_REPORT_ID": report_id,
                "has_password": bool(mstr_pass),
            }
        })
        if not (mstr_url and mstr_user and mstr_pass):
            return {"steps": steps, "conclusion": "Missing env vars"}

        # Step 2: Load config
        from mstr.config import MstrConfig
        config = MstrConfig.from_env()
        steps.append({"step": "config", "ok": True, "detail": {"base_url": config.base_url}})

        # Step 3: Can we reach the server?
        import requests as req
        try:
            r = req.get(f"{config.base_url}/api/status", timeout=(5, 10))
            steps.append({"step": "server_reachable", "ok": r.status_code == 200, "detail": {"status_code": r.status_code, "body": r.text[:200]}})
        except Exception as e:
            steps.append({"step": "server_reachable", "ok": False, "detail": str(e)})
            return {"steps": steps, "conclusion": f"Cannot reach MSTR server: {e}"}

        # Step 4: Login
        try:
            session = req.Session()
            login_resp = session.post(
                f"{config.base_url}/api/auth/login",
                json={"username": config.username, "password": config.password, "loginMode": config.login_mode},
                timeout=(5, 15),
            )
            token = login_resp.headers.get("X-MSTR-AuthToken", "")
            steps.append({"step": "login", "ok": bool(token), "detail": {"status_code": login_resp.status_code, "has_token": bool(token)}})
            if not token:
                return {"steps": steps, "conclusion": f"Login failed: {login_resp.status_code} {login_resp.text[:200]}"}
        except Exception as e:
            steps.append({"step": "login", "ok": False, "detail": str(e)})
            return {"steps": steps, "conclusion": f"Login error: {e}"}

        # Step 5: Resolve project
        try:
            headers = {"X-MSTR-AuthToken": token}
            r = session.get(f"{config.base_url}/api/projects", headers=headers, timeout=(5, 15))
            projects = r.json()
            proj_names = [p.get("name") for p in projects]
            pid = None
            for p in projects:
                if p.get("name") == config.default_project:
                    pid = p["id"]
            steps.append({"step": "project", "ok": bool(pid), "detail": {"projects": proj_names, "matched": config.default_project, "id": pid}})
            if not pid:
                return {"steps": steps, "conclusion": f"Project '{config.default_project}' not found"}
        except Exception as e:
            steps.append({"step": "project", "ok": False, "detail": str(e)})
            return {"steps": steps, "conclusion": f"Project resolution error: {e}"}

        # Step 6: Detect object type
        try:
            hdr = {"X-MSTR-AuthToken": token, "X-MSTR-ProjectID": pid}
            r_report = session.get(f"{config.base_url}/api/reports/{report_id}", headers=hdr, timeout=(10, 15))
            r_dossier = session.get(f"{config.base_url}/api/dossiers/{report_id}/definition", headers=hdr, timeout=(10, 15))
            obj_type = "dossier" if r_dossier.status_code == 200 else ("report" if r_report.status_code == 200 else "unknown")
            steps.append({"step": "object_type", "ok": obj_type != "unknown", "detail": {
                "report_status": r_report.status_code,
                "dossier_status": r_dossier.status_code,
                "type": obj_type,
            }})
        except Exception as e:
            steps.append({"step": "object_type", "ok": False, "detail": str(e)})

        # Logout
        try:
            session.post(f"{config.base_url}/api/auth/logout", headers={"X-MSTR-AuthToken": token}, timeout=(5, 5))
        except:
            pass
        session.close()

        return {"steps": steps, "conclusion": "All diagnostic steps passed"}

    except Exception as e:
        steps.append({"step": "unexpected", "ok": False, "detail": str(e)})
        return {"steps": steps, "conclusion": f"Unexpected error: {e}"}


# =============================
# RENDER COMPATIBLE STARTUP
# =============================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on port {port}")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )
