#!/bin/bash

# 🎯 Quick Push - Script veloce per push immediato
# Uso: ./quick-push.sh "messaggio opzionale"

MESSAGE=${1:-"🔄 Quick update $(date '+%H:%M:%S')"}

echo "🚀 Quick Push: $MESSAGE"

git add .
git commit -m "$MESSAGE"
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Push completato!"
    echo "🌐 Render.com si aggiornerà automaticamente"
    echo "📱 URL: https://anita-album.onrender.com"
else
    echo "❌ Errore durante il push"
fi
