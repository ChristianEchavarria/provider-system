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
    """Build dashboard data from MicroStrategy cached records."""
    data = get_cached_data()
    columns = data.get("columns", [])
    rows = data.get("rows", [])

    if not rows or not columns:
        return None

    # Map column indices
    ci = {col: i for i, col in enumerate(columns)}

    # Required columns
    required = ["Nombre Proveedor", "Nombre Subproveedor", "Estado Proveedor", "Estado Subproveedor"]
    if not all(r in ci for r in required):
        print(f"[DASHBOARD] Missing required columns. Have: {columns}")
        return None

    # Aggregate by Provider + SubProvider
    providers_map = {}  # key: (provider, subprovider) -> aggregated data

    for row in rows:
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
        key = (prov, sub)

        if key not in providers_map:
            providers_map[key] = {
                "Proveedor": prov,
                "Sub-proveedor": sub,
                "Vertical": str(val("Tipo casino")).strip() or str(val("Categoria")).strip() or "-",
                "Estado Proveedor": str(val("Estado Proveedor")).strip(),
                "Estado Subproveedor": str(val("Estado Subproveedor")).strip(),
                "Categorias": set(),
                "total_games": 0,
                "active_games": 0,
                "inactive_games": 0,
                "total_spins": 0,
                "total_apuesta": 0,
                "total_ggr": 0,
                "total_premios": 0,
                "jugadores_unicos": 0,
                "rtp_sum": 0,
                "rtp_count": 0,
            }

        entry = providers_map[key]
        entry["total_games"] += 1
        game_status = str(val("Estado juego")).strip().upper()
        if game_status == "A":
            entry["active_games"] += 1
        else:
            entry["inactive_games"] += 1

        cat = str(val("Categoria")).strip()
        if cat:
            entry["Categorias"].add(cat)

        entry["total_spins"] += num("Spins")
        entry["total_apuesta"] += num("Apuesta")
        entry["total_ggr"] += num("GGR")
        entry["total_premios"] += num("Premios")
        entry["jugadores_unicos"] += num("Jugadores unicos")

        rtp = num("RTP")
        if rtp > 0:
            entry["rtp_sum"] += rtp
            entry["rtp_count"] += 1

    # Build provider matrix
    providers_matrix = []
    active_providers = 0
    active_subproviders = 0
    unique_providers = set()
    unique_categories = set()

    for key, entry in providers_map.items():
        prov_status = entry["Estado Proveedor"].upper()
        sub_status = entry["Estado Subproveedor"].upper()
        is_active = (prov_status == "A")

        categories = ", ".join(sorted(entry["Categorias"])) if entry["Categorias"] else "-"
        unique_categories.update(entry["Categorias"])
        unique_providers.add(entry["Proveedor"])

        avg_rtp = (entry["rtp_sum"] / entry["rtp_count"] * 100) if entry["rtp_count"] > 0 else 0
        margin = (entry["total_ggr"] / entry["total_apuesta"] * 100) if entry["total_apuesta"] > 0 else 0

        providers_matrix.append({
            "Proveedor": entry["Proveedor"],
            "Sub-proveedor": entry["Sub-proveedor"],
            "Vertical": entry["Vertical"],
            "Estado Proveedor": "Activo" if prov_status == "A" else "Inactivo",
            "Estado Subproveedor": "Activo" if sub_status == "A" else "Inactivo",
            "Categorias": categories,
            "Juegos Activos": entry["active_games"],
            "Juegos Inactivos": entry["inactive_games"],
            "Total Juegos": entry["total_games"],
            "Jugadores Únicos": int(entry["jugadores_unicos"]),
            "Spins": int(entry["total_spins"]),
            "Apuesta": round(entry["total_apuesta"], 2),
            "GGR": round(entry["total_ggr"], 2),
            "Premios": round(entry["total_premios"], 2),
            "RTP %": round(avg_rtp, 2),
            "Margen %": round(margin, 2),
            "is_active": is_active,
        })

        if prov_status == "A":
            active_providers += 1
        if sub_status == "A":
            active_subproviders += 1

    # Sort by GGR descending
    providers_matrix.sort(key=lambda x: x["GGR"], reverse=True)

    # Build stats per category
    stats_per_category = {}
    for entry in providers_matrix:
        for cat in entry["Categorias"].split(", "):
            cat = cat.strip()
            if cat and cat != "-":
                if cat not in stats_per_category:
                    stats_per_category[cat] = 0
                if entry["is_active"]:
                    stats_per_category[cat] += 1

    # Build activity log from status changes (detect inactive providers/games)
    activity_log = []
    for entry in providers_matrix[:15]:
        if entry["Juegos Inactivos"] > 0 and entry["Juegos Activos"] > 0:
            activity_log.append({
                "time": data.get("timestamp", "")[:8] if data.get("timestamp") else "--:--:--",
                "provider": entry["Proveedor"],
                "sub_provider": entry["Sub-proveedor"],
                "change": f"{entry['Juegos Activos']}A / {entry['Juegos Inactivos']}I",
                "type": "mixed"
            })
        elif entry["Estado Proveedor"] == "Inactivo":
            activity_log.append({
                "time": data.get("timestamp", "")[:8] if data.get("timestamp") else "--:--:--",
                "provider": entry["Proveedor"],
                "sub_provider": entry["Sub-proveedor"],
                "change": "Inactive",
                "type": "inactive"
            })

    # KPIs
    total_ggr = sum(e["GGR"] for e in providers_matrix)
    total_spins = sum(e["Spins"] for e in providers_matrix)
    total_apuesta = sum(e["Apuesta"] for e in providers_matrix)
    compliance_rate = round(active_providers / len(providers_matrix) * 100, 1) if providers_matrix else 0

    return {
        "success": True,
        "source": "microstrategy",
        "metrics": {
            "total_operations": len(unique_providers),
            "total_providers": len(providers_matrix),
            "active_providers_global": active_providers,
            "active_subproviders": active_subproviders,
            "compliance_rate": compliance_rate,
            "total_ggr": round(total_ggr, 2),
            "total_spins": total_spins,
            "total_apuesta": round(total_apuesta, 2),
            "total_games": sum(e["Total Juegos"] for e in providers_matrix),
        },
        "stats_per_operation": stats_per_category,
        "alerts": [],
        "activity_log": activity_log,
        "providers_matrix": providers_matrix,
        "timestamp": time.time(),
        "last_sync": data.get("timestamp"),
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
