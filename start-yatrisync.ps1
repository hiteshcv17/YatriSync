# YatriSync: start the Python backend and React frontend in separate terminals.
# Save this file in the YatriSync project root (same folder as package.json).

$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$BackendDir = Join-Path $ProjectRoot "backend"
$VenvPython = Join-Path $BackendDir "venv\Scripts\python.exe"
$Requirements = Join-Path $BackendDir "requirements.txt"
$PackageJson = Join-Path $ProjectRoot "package.json"

if (-not (Test-Path $PackageJson)) {
    Write-Host "ERROR: package.json was not found. Save this script in the YatriSync root folder." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}
if (-not (Test-Path $Requirements)) {
    Write-Host "ERROR: backend\requirements.txt was not found." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

# Create the Python environment and install backend dependencies on first run.
if (-not (Test-Path $VenvPython)) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
    Push-Location $BackendDir
    try {
        python -m venv venv
        if ($LASTEXITCODE -ne 0) { throw "Could not create the Python virtual environment." }

        & $VenvPython -m pip install --upgrade pip
        if ($LASTEXITCODE -ne 0) { throw "Could not upgrade pip." }

        & $VenvPython -m pip install -r $Requirements
        if ($LASTEXITCODE -ne 0) { throw "Could not install backend requirements." }
    }
    finally {
        Pop-Location
    }
}

# Ensure backend packages are present (pip skips packages already satisfied).
Write-Host "Checking backend dependencies..." -ForegroundColor Cyan
& $VenvPython -m pip install -r $Requirements
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend dependency installation failed." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

# Create/update the frontend API URL file.
'VITE_API_BASE_URL=http://localhost:8000' |
    Set-Content -Path (Join-Path $ProjectRoot ".env.local") -Encoding ascii

# Install frontend dependencies only when node_modules is missing.
if (-not (Test-Path (Join-Path $ProjectRoot "node_modules"))) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    Push-Location $ProjectRoot
    try {
        npm.cmd install --legacy-peer-deps
        if ($LASTEXITCODE -ne 0) { throw "Frontend dependency installation failed." }
    }
    finally {
        Pop-Location
    }
}

# Open the backend in its own PowerShell window.
$BackendCommand = "Set-Location '$BackendDir'; & '$VenvPython' -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"
Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", $BackendCommand
)

Start-Sleep -Seconds 2

# Open the frontend in another PowerShell window.
$FrontendCommand = "Set-Location '$ProjectRoot'; npm.cmd run dev"
Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", $FrontendCommand
)

Write-Host ""
Write-Host "YatriSync startup commands have been launched." -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000/docs"
Write-Host "Frontend:    http://localhost:3000"
Write-Host "Keep both terminal windows open while using the app."
