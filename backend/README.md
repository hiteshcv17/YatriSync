# YatriSync – Python FastAPI + PostgreSQL Backend

This directory contains the production-ready Python FastAPI REST API backend for **YatriSync**, designed as specified in **PRD Section 7 & 8**.

---

## 1. Quick Local Setup

### Prerequisites
- Python 3.10+ installed
- (Optional) PostgreSQL installed, or it will automatically use SQLite (`yatrisync.db`) for instant zero-config testing.

### Setup Steps
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment
python -m venv venv

# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```

Once running:
- **Interactive Swagger API Docs**: Visit `http://localhost:8000/docs`
- **ReDoc Documentation**: Visit `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/health`

---

## 2. Deploying to Render (with Managed PostgreSQL)

As recommended in PRD Section 7:

1. **Create a PostgreSQL Database on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click **New** > **PostgreSQL**
   - Name: `yatrisync-db`
   - Region: Singapore / Asia (closest to India)
   - Copy the **Internal Database URL** or **External Database URL**

2. **Deploy the FastAPI Web Service**:
   - Click **New** > **Web Service**
   - Connect your GitHub repository
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add Environment Variable:
     - `DATABASE_URL` = `<your-render-postgresql-url>`

3. **Connect Frontend**:
   - In your frontend `.env` or deployment settings:
     ```env
     VITE_API_BASE_URL=https://your-yatrisync-backend.onrender.com
     ```

---

## 3. Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health & database status check |
| `GET` | `/api/trains` | Arriving Mysuru Junction train timetable |
| `GET` | `/api/routes` | Mysuru bus routes and approved stops |
| `GET` | `/api/pools` | Active corridor pooling groups |
| `POST` | `/api/pools/join` | Join corridor pool with 20-seat threshold tracking & escrow |
| `POST` | `/api/operator/allocate` | Assign vehicle, confirm departure, capture fare |
| `POST` | `/api/conductor/verify-qr` | Scan QR ticket and prevent duplicate boarding |
| `GET` | `/api/wallet` | Escrow wallet balance and ledger |
| `POST` | `/api/wallet/topup` | Simulated instant wallet credit |
