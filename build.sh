#!/bin/bash

# Build script per Render.com
echo "🚀 Iniziando build per Render..."

# Verifica che Python sia disponibile
if command -v python3 &> /dev/null; then
    echo "✅ Python3 trovato: $(python3 --version)"
else
    echo "❌ Python3 non trovato"
    exit 1
fi

# Verifica struttura del progetto
if [ -f "index.html" ]; then
    echo "✅ index.html trovato"
else
    echo "❌ index.html mancante"
    exit 1
fi

# Conta le foto
FOTO_COUNT=$(find assets/images/anita/ricordi/ -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.heic" 2>/dev/null | wc -l)
echo "📸 Foto trovate: $FOTO_COUNT"

# Verifica file JavaScript
if [ -f "assets/js/wedding-album.js" ]; then
    echo "✅ wedding-album.js trovato"
else
    echo "❌ wedding-album.js mancante"
    exit 1
fi

if [ -f "assets/js/anita-photos-clean.js" ]; then
    echo "✅ anita-photos-clean.js trovato"
else
    echo "❌ anita-photos-clean.js mancante"
    exit 1
fi

echo "🎉 Build completato con successo!"
echo "📦 Il sito è pronto per il deployment"
