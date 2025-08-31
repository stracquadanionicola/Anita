#!/bin/bash

# 🚀 Auto-Push Script per Album Anita e Nicola
# Esegue automaticamente git add, commit e push

echo "🔄 Auto-Push: Controllo modifiche..."

# Controlla se ci sono modifiche
if [[ -n $(git status -s) ]]; then
    echo "📝 Modifiche rilevate, avvio commit..."
    
    # Aggiungi tutti i file
    git add .
    
    # Crea un commit con timestamp
    TIMESTAMP=$(date "+%d/%m/%Y %H:%M:%S")
    git commit -m "🔄 Auto-update: $TIMESTAMP - Modifiche album Anita e Nicola"
    
    # Push su GitHub
    echo "🚀 Push su GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Push completato con successo!"
        echo "🌐 Il sito su Render.com si aggiornerà automaticamente"
        echo "📱 URL: https://anita-album.onrender.com"
    else
        echo "❌ Errore durante il push"
        exit 1
    fi
else
    echo "✅ Nessuna modifica da pushare"
fi
