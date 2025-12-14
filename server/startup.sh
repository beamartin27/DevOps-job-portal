#!/bin/bash
# Startup script for Azure App Service
# This ensures dependencies are installed before starting the server

echo "Starting backend application..."

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Installing dependencies..."
  npm install --production
fi

# Start the server
echo "Starting Node.js server..."
node server/index.js
