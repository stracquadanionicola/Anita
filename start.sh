#!/bin/bash

echo "Starting server for Anita and Nicola album..."

PORT=${PORT:-10000}

echo "Server starting on port: $PORT"

exec python3 -m http.server $PORT --bind 0.0.0.0
