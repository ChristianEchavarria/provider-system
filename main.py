from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
import sys
import os
import json
import time
import traceback

# =============================
# PATH CONFIGURATION
# =============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Add vision-processor to path
VISION_PATH = os.path.abspath(os.path.join(BASE_DIR, '../vision-processor'))
if VISION_PATH not in sys.path:
    sys.path.append(VISION_PATH)

# =============================
# OPTIONAL IMPORTS
# =============================

try:
    from processor import ImageProcessor
    print("✅ ImageProcessor loaded")
except ImportError:
    print("⚠️ Warning: Could not import ImageProcessor")

try:
    from provider_logic import (
        load_data,
        generate_dashboard_stats,
        analyze_compliance,
        simulate_activity_log
    )
    print("✅ provider_logic loaded")
except ImportError:
    print("⚠️ Warning: Could not import provider_logic")


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
    print("✅ Static files mounted")
else:
    print("⚠️ Static directory not found:", STATIC_DIR)


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
            "providers_matrix": providers[:50]
        }

    except Exception as e:

        print("❌ dashboard error:", str(e))
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =============================
# IMAGE PROCESSING ENDPOINT
# =============================
@app.post("/api/process-images")
async def process_images(files: List[UploadFile] = File(...)):

    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files received")

        file_data = []

        # Convertimos UploadFile → (filename, bytes)
        for file in files:
            content = await file.read()
            file_data.append((file.filename, content))

        # 🔥 Ejecutamos tu lógica REAL Virtualsoft
        zip_bytes, stats = await ImageProcessor.process_batch(file_data)

        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={
                "Content-Disposition": "attachment; filename=virtualsoft_processed.zip",
                "X-Stats": str(stats)
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# =============================
# RENDER COMPATIBLE STARTUP
# =============================

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 8000))

    print(f"🚀 Starting server on port {port}")

    uvicorn.run(

        "main:app",

        host="0.0.0.0",

        port=port,

        reload=False

    )
