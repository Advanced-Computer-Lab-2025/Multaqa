# Kill any process running on the backend port
$port = $env:PORT
if (-not $port) {
    # Default port if PORT env var not set
    $port = 3000
}

Write-Host "Checking for processes on port $port..." -ForegroundColor Yellow

# Find process using the port
$processInfo = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1

if ($processInfo) {
    $processId = $processInfo.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host "Found process '$($process.ProcessName)' (PID: $processId) on port $port" -ForegroundColor Red
        Write-Host "Killing process..." -ForegroundColor Yellow
        Stop-Process -Id $processId -Force
        Write-Host "Process killed successfully" -ForegroundColor Green
        Start-Sleep -Seconds 1
    }
} else {
    Write-Host "Port $port is free" -ForegroundColor Green
}

