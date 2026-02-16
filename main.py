from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn
import sys
import os
import json
import time

# Add vision-processor to path to import ImageProcessor
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../vision-processor')))
try:
    from processor import ImageProcessor
except ImportError:
    print("Warning: Could not import ImageProcessor. Vision functionality may be limited.")

# Import local provider logic
try:
    from provider_logic import load_data, generate_dashboard_stats, analyze_compliance, simulate_activity_log
except ImportError:
    print("Warning: Could not import provider_logic.")

app = FastAPI(title="Provider Intelligence Center")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Stats", "X-Processing-Time"]
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_index():
    return FileResponse("static/index.html")

@app.get("/api/dashboard-data")
async def get_dashboard_data():
    """
    Returns aggregated data for the dashboard.
    """
    headers, providers = load_data("data.txt")
    
    if not providers:
        return {"error": "No data found"}
        
    stats = generate_dashboard_stats(providers, headers)
    alerts = analyze_compliance(providers, headers)
    activity_log = simulate_activity_log(providers)
    
    return {
        "metrics": {
            "total_operations": len(headers) - 3,
            "total_providers": len(providers),
            "active_providers_global": sum(stats.values()), # active across all operations sum
            "compliance_rate": 98 # Simulated for now or calculate based on alerts
        },
        "stats_per_operation": stats,
        "alerts": alerts,
        "activity_log": activity_log,
        "providers_matrix": providers[:50] # Send first 50 for table preview to avoid huge payload
    }

@app.post("/api/process-images")
async def process_images(files: List[UploadFile] = File(...)):
    """
    Endpoint for bulk image processing (VisionProcessor).
    Reuses the logic from the original project.
    """
    start_time = time.time()
    
    if not files:
        raise HTTPException(status_code=400, detail="No files sent.")

    file_data = []
    
    # Read files
    for file in files:
        content = await file.read()
        file_data.append((file.filename, content))
    
    # Process
    try:
        zip_bytes, stats = await ImageProcessor.process_batch(file_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    end_time = time.time()
    processing_time = end_time - start_time
    
    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename=vision_processed_{int(time.time())}.zip",
            "X-Processing-Time": f"{processing_time:.2f}s",
            "X-Stats": json.dumps(stats),
            "Access-Control-Expose-Headers": "X-Stats, X-Processing-Time"
        }
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
