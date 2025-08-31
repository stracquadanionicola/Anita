#!/bin/bash

# Script helper per copiare e organizzare le foto di Anita
# Utilizzo: ./copy-anita-photos.sh

echo "🎨 Script di caricamento foto Anita"
echo "=================================="

# Percorsi
DOWNLOAD_DIR="/Users/nicola/Downloads/FOTO ANITA"
SITE_DIR="/Users/nicola/sito/assets/images/anita"

# Controlla se la cartella di download esiste
if [ ! -d "$DOWNLOAD_DIR" ]; then
    echo "❌ Cartella $DOWNLOAD_DIR non trovata!"
    echo "📂 Assicurati che le foto siano in: $DOWNLOAD_DIR"
    exit 1
fi

echo "📁 Cartella foto trovata: $DOWNLOAD_DIR"
echo "🎯 Destinazione: $SITE_DIR"
echo ""

# Conta le foto
total_photos=$(find "$DOWNLOAD_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) | wc -l)
echo "📸 Trovate $total_photos foto da processare"
echo ""

# Funzione per categorizzare automaticamente
categorize_photo() {
    local filename=$(basename "$1")
    local lower_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
    
    # Logica di categorizzazione basata sul nome
    if [[ $lower_filename == *"viaggio"* ]] || [[ $lower_filename == *"vacanza"* ]] || [[ $lower_filename == *"travel"* ]]; then
        echo "viaggi"
    elif [[ $lower_filename == *"compleanno"* ]] || [[ $lower_filename == *"festa"* ]] || [[ $lower_filename == *"anniversario"* ]]; then
        echo "momenti-speciali"
    elif [[ $lower_filename == *"insieme"* ]] || [[ $lower_filename == *"coppia"* ]] || [[ $lower_filename == *"selfie"* ]]; then
        echo "insieme"
    else
        echo "ricordi"
    fi
}

# Processa ogni foto
counter=0
while IFS= read -r -d '' photo; do
    counter=$((counter + 1))
    filename=$(basename "$photo")
    category=$(categorize_photo "$photo")
    
    echo "[$counter/$total_photos] 📸 $filename → $category"
    
    # Copia la foto nella categoria appropriata
    cp "$photo" "$SITE_DIR/$category/"
    
    # Aggiungi alla configurazione JavaScript
    echo "  ✅ Copiata in $category/"
    
done < <(find "$DOWNLOAD_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) -print0)

echo ""
echo "🎉 Completato! Tutte le foto sono state organizzate."
echo ""
echo "📋 Distribuzione per categoria:"
echo "   🏠 Ricordi: $(ls "$SITE_DIR/ricordi" | wc -l) foto"
echo "   ✈️  Viaggi: $(ls "$SITE_DIR/viaggi" | wc -l) foto"
echo "   🎉 Momenti speciali: $(ls "$SITE_DIR/momenti-speciali" | wc -l) foto"
echo "   💕 Insieme: $(ls "$SITE_DIR/insieme" | wc -l) foto"
echo ""
echo "🚀 Ora apri il sito e le foto appariranno automaticamente!"
