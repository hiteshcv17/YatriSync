# YatriSync 🚆🚌
### Smart Train-to-Bus Connectivity & Passenger Mobility Platform

YatriSync is a full-stack transportation coordination platform designed to simplify the last-mile and onward journey of passengers arriving at **Mysuru Junction, Karnataka, India**.

It connects railway arrivals with coordinated bus transportation through route-based passenger pooling, seat-threshold tracking, QR-based ticket verification, vehicle allocation, and a simulated digital wallet.

The goal is to make onward travel more organized, predictable, and convenient by coordinating passengers travelling along similar corridors.

---

## 📌 Project Overview

Passengers arriving at railway stations often face difficulties finding convenient onward transportation, particularly when multiple passengers are travelling towards similar destinations.

YatriSync addresses this problem through a coordinated transport workflow:

1. Passengers select their arriving train and destination.
2. The platform identifies suitable bus routes and pickup corridors.
3. Passengers join a shared transport pool.
4. The system tracks seat availability against a configurable pooling threshold.
5. An operator allocates a bus and confirms departure details.
6. Passengers receive booking information and a QR ticket code.
7. Conductors verify tickets during boarding and detect duplicate scans.

**Primary location:** Mysuru Junction (MYS), Mysuru, Karnataka, India.

---

## ✨ Key Features

### 1. Train Arrival Information
- Displays train information for Mysuru Junction.
- Shows train numbers, names, arrival times, platforms, and sample delay information.
- Connects arriving train selections with onward transport options.

### 2. Smart Passenger Pooling
- Groups passengers travelling towards similar destinations.
- Organizes bookings by predefined transport corridors.
- Tracks booked seats against a configurable target threshold.
- Supports pool statuses such as collecting, threshold reached, and bus assigned.

### 3. Bus Route Coordination
- Displays predefined Mysuru bus routes and destinations.
- Provides approved pickup stops and landmark information.
- Organizes transport around destination corridors.
- Supports operator-managed vehicle allocation.

### 4. QR-Based Digital Ticketing
- Generates a unique ticket code for a booking.
- Supports QR ticket verification through the conductor API.
- Validates booking status before boarding.
- Detects duplicate boarding scans.

### 5. Operator & Fleet Management
- Displays bus allocation information.
- Associates buses with passenger pools.
- Records assigned departure times and pickup gates.
- Updates booking confirmation when a bus is allocated.

### 6. Digital Wallet & Fare Management
- Maintains a wallet balance and transaction history in the prototype.
- Supports simulated wallet top-ups.
- Reserves fares when passengers join a pool.
- Captures reserved fares after vehicle allocation.

### 7. Late-Night Journey Prioritization
- Identifies configured late-night train arrivals.
- Flags selected journeys for additional safety prioritization.
- Includes priority-related information in pool records.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Animations | Motion |
| Icons | Lucide React |
| Node.js Server | Express.js |
| Python API | FastAPI |
| Data Validation | Pydantic |
| ORM | SQLAlchemy |
| Database | SQLite / PostgreSQL |
| QR Functionality | QR Code libraries |
| Package Management | npm / Bun |

---

## 🏗️ System Architecture

YatriSync currently contains a frontend application and two server-side implementations.

```text
                    YATRISYNC
                        |
          +-------------+-------------+
          |                           |
     React Frontend              Application
     TypeScript + Vite              Layer
          |                           |
          |                    Express + Vite
          |                    (Node.js Server)
          |
          +---------------------------+
          |
     FastAPI Backend
          |
     SQLAlchemy ORM
          |
     +----+---------+
     |              |
   SQLite        PostgreSQL
```

### Backend Components

**Express + Vite Server**
- Implemented in `server.ts`.
- Runs the main Node.js application.
- Integrates Vite middleware during development.
- Serves the built frontend in production.
- Includes prototype REST endpoints and in-memory application data.

**FastAPI Backend**
- Located in the `backend/` directory.
- Provides Python REST API endpoints.
- Uses SQLAlchemy for database operations.
- Supports SQLite as the default local database.
- Supports PostgreSQL through the `DATABASE_URL` environment variable.

The two implementations are separate server configurations. The intended API server should be selected and configured for the frontend environment.

---

## 📂 Project Structure

```text
YatriSync/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── README.md
│
├── public/
│   └── assets/
│       └── aistudio/
│
├── src/
│   └── Frontend source code
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
│
├── package.json
├── package-lock.json
├── bun.lock
│
├── server.ts
├── server.js
├── start-yatrisync.ps1
├── tsconfig.json
└── vite.config.ts
```

**Note:** Dependency folders such as `node_modules/` and Python virtual environments are intentionally excluded from version control.

---

## ⚙️ Installation & Setup

### Prerequisites

Install the following software:

- Node.js and npm
- Python 3.10 or later
- Git
- PostgreSQL (optional, when using PostgreSQL instead of SQLite)

### 1. Clone the Repository

```bash
git clone https://github.com/hiteshcv17/YatriSync.git

cd YatriSync
```

### 2. Install Frontend Dependencies

```bash
npm install
```

This installs the dependencies defined in `package.json` and `package-lock.json`.

`node_modules/` is generated locally and is not stored in GitHub.

### 3. Configure Environment Variables

Create a local environment file from the example:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

Configure the required values in `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:8000
```

Use your own credentials and deployment URLs. Never commit real API keys or database credentials.

### 4. Start the Node.js Application

```bash
npm run dev
```

The Express server starts the Vite application in development mode.

Default application address:

```text
http://localhost:3000
```

### 5. Start the Python FastAPI Backend

Open a separate terminal:

```powershell
cd backend

python -m venv venv

.\venv\Scripts\Activate.ps1

pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

The Python API will be available at:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

ReDoc documentation:

```text
http://localhost:8000/redoc
```

Health check:

```text
http://localhost:8000/health
```

For PostgreSQL, configure `DATABASE_URL` before starting FastAPI. Otherwise, the backend defaults to a local SQLite database.

---

## 🔌 API Reference

The Python FastAPI backend provides the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Backend health check |
| GET | `/api/trains` | Retrieve train information |
| GET | `/api/routes` | Retrieve bus routes |
| GET | `/api/pools` | Retrieve passenger pools |
| POST | `/api/pools/join` | Join a passenger pool |
| POST | `/api/operator/allocate` | Allocate a bus to a pool |
| POST | `/api/conductor/verify-qr` | Verify QR ticket and boarding status |
| GET | `/api/wallet` | Retrieve wallet information |
| POST | `/api/wallet/topup` | Simulate wallet top-up |

The Express application also provides prototype endpoints, including:

- `GET /api/buses`
- `GET /api/bookings`

Refer to the server implementation and FastAPI Swagger documentation for request and response schemas.

---

## 💳 Passenger Booking Workflow

```text
Passenger selects train
          |
          v
Select destination and route
          |
          v
Join passenger pool
          |
          v
Reserve simulated fare
          |
          v
Track pooling threshold
          |
          v
Operator allocates bus
          |
          v
Booking confirmation
          |
          v
QR ticket verification
          |
          v
Passenger boards bus
```

---

## 🗄️ Database & Data Management

The Python backend uses SQLAlchemy models for application data.

The database configuration supports:

- **SQLite:** Default local development database.
- **PostgreSQL:** Configurable database for hosted environments.

Database configuration is controlled through:

```env
DATABASE_URL=your_database_connection_string
```

When this variable is not configured, the backend uses:

```text
sqlite:///./yatrisync.db
```

The local SQLite database is generated at runtime and is excluded from Git.

---

## 🚀 Production Build

Build the Node.js application:

```bash
npm run build
```

Start the production application:

```bash
npm start
```

The production Express server serves the generated frontend from the `dist/` directory.

### Python Backend Deployment

The FastAPI backend can be deployed as a separate web service.

Suggested Render configuration:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

Configure `DATABASE_URL` in the hosting provider's environment settings when using PostgreSQL.

Set the frontend's `VITE_API_BASE_URL` to the deployed FastAPI service URL when the frontend is configured to use that API.

---

## 🔐 Security & Development Notes

- Keep `.env.local` and other environment files out of version control.
- Do not commit API keys, passwords, or database credentials.
- Use environment variables for deployment configuration.
- Configure restrictive CORS origins before production deployment.
- Add proper authentication and authorization before exposing operator, conductor, or wallet operations publicly.
- Replace simulated wallet transactions with a secure payment gateway before real-world financial use.
- Validate transport schedules and route information against authoritative data sources before operational use.

---

## ⚠️ Current Project Status

YatriSync is an evolving full-stack prototype.

The repository includes sample train and bus information, prototype booking workflows, simulated wallet operations, and separate Express and FastAPI implementations.

The currently included sample data should not be treated as live railway schedules, confirmed bus availability, real-time vehicle tracking, or actual payment processing.

Production deployment requires further integration, testing, security hardening, and validation of transport and payment data.

---

## 🎯 Project Objectives

- Improve train-to-bus connectivity.
- Simplify onward journey planning.
- Coordinate passengers travelling along common routes.
- Improve visibility into shared transport capacity.
- Support structured bus allocation and boarding verification.
- Explore technology-driven solutions for urban mobility.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the affected functionality.
5. Submit a pull request with a clear description.

---

## 📄 License

No license has currently been specified for this repository. Contact the repository owner before reusing or redistributing the project.

---

## 👨‍💻 Project Repository

**GitHub:** https://github.com/hiteshcv17/YatriSync

**Project:** YatriSync – Smart Train-to-Bus Connectivity & Passenger Mobility Platform

Built to explore smarter, more coordinated urban transportation.
