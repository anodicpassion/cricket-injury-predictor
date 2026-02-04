#!/bin/bash

# Start Flask backend in background
echo "Starting Flask backend..."
source .venv/bin/activate && python app.py &
FLASK_PID=$!

# Wait a moment for Flask to start
sleep 3

# Start React frontend
echo "Starting React frontend..."
npm run dev &
REACT_PID=$!

# Function to cleanup processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $FLASK_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

echo "Both servers are running!"
echo "Flask backend: http://localhost:5000"
echo "React frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait