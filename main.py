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

@app.get("/api/dashboard-data")
async def get_dashboard_data():

    try:
        headers, providers = load_data("data.txt")

        if not providers:
            return {
                "error": "No data found"
            }

        stats = generate_dashboard_stats(providers, headers)
        alerts = analyze_compliance(providers, headers)
        activity_log = simulate_activity_log(providers)

        return {
            "success": True,
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

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

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
