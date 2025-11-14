#!/bin/bash
# Kill any process running on the backend port

# Read PORT from .env file or use default
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

PORT=${PORT:-3000}

echo "Checking for processes on port $PORT..."

# Find process using the port
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ ! -z "$PID" ]; then
    echo "Found process (PID: $PID) on port $PORT"
    echo "Killing process..."
    kill -9 $PID 2>/dev/null
    echo "Process killed successfully"
    sleep 1
else
    echo "Port $PORT is free"
fi
