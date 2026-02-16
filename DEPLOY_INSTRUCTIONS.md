# Deployment Instructions for Provider Intelligence Center

This guide explains how to deploy the backend to **Google Cloud Run** and the frontend to **Firebase Hosting**.

## Prerequisites

1.  Google Cloud SDK (`gcloud`) installed and authenticated.
2.  Firebase CLI (`firebase`) installed and authenticated.
3.  A Firebase project created (or use an existing one).

## 1. Deploy Backend to Cloud Run

The backend (Python/FastAPI) needs to be containerized and running on Cloud Run.

### Step 1.1: Build and Push Docker Image

Run these commands from the **root** of your customized repository (`port_platform`):

```bash
# Set your project ID
export PROJECT_ID=your-project-id

# Enable required services
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com

# Build the image using Cloud Build (recommended for ease)
# This uses the Dockerfile in provider_system but context from root
gcloud builds submit --tag gcr.io/$PROJECT_ID/provider-system -f provider_system/Dockerfile .
```

### Step 1.2: Deploy to Cloud Run

```bash
# Deploy the image
gcloud run deploy provider-api \
  --image gcr.io/$PROJECT_ID/provider-system \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```
*Note: We use `provider-api` as the service name, matching `firebase.json`.*

## 2. Connect Firebase Hosting

Now configure Firebase Hosting to serve your static files and rewrite API calls to Cloud Run.

### Step 2.1: Initialize Firebase (if not done)

Navigate to `provider_system` folder:
```bash
cd provider_system
firebase init hosting
```
*Select "Use an existing project", accept defaults. If asked to overwrite `firebase.json` or `index.html`, say NO.*

### Step 2.2: Verify Configuration

Check `provider_system/firebase.json`. It should have a rewrite rule for `/api/**` pointing to `provider-api`.

### Step 2.3: Deploy Hosting

```bash
firebase deploy --only hosting
```

## 3. Verify Deployment

1.  Open your Firebase Hosting URL.
2.  The interface should load (served by Firebase).
3.  Network requests to `/api/dashboard-data` should work (proxied to Cloud Run).

## Local Testing with Docker

To test the backend locally with the same environment as Cloud Run:

```bash
# Build locally
docker build -t provider-system -f provider_system/Dockerfile .

# Run container
docker run -p 8080:8080 -e PORT=8080 provider-system
```
Access at `http://localhost:8080`.
