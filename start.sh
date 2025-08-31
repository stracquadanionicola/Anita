#!/bin/bash

# Script di avvio per Render.com
echo "🚀 Avviando server per album Anita e Nicola..."

# Imposta la porta (Render usa PORT, default 10000 per test locale)
PORT=${PORT:-10000}

echo "📡 Server in avvio sulla porta: $PORT"
echo "🌐 URL locale: http://0.0.0.0:$PORT"

# Avvia il server Python con la porta corretta
exec python3 -m http.server $PORT --bind 0.0.0.0
