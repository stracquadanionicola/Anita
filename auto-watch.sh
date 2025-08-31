#!/bin/bash

# 🤖 Auto-Watcher per Album Anita e Nicola
# Monitora automaticamente le modifiche e fa push istantaneo

echo "🔍 Avvio monitoraggio automatico della directory..."
echo "📁 Directory: $(pwd)"
echo "🚀 Ogni modifica sarà automaticamente pushata su GitHub"
echo "⏹️  Premi Ctrl+C per fermare"
echo ""

# Funzione per fare il push
do_push() {
    echo ""
    echo "🔄 $(date '+%H:%M:%S') - Modifica rilevata!"
    
    # Aspetta un momento per evitare push multipli
    sleep 2
    
    # Controlla se ci sono realmente modifiche
    if [[ -n $(git status -s) ]]; then
        echo "📝 Commit in corso..."
        
        git add .
        TIMESTAMP=$(date "+%d/%m/%Y %H:%M:%S")
        git commit -m "🤖 Auto-commit: $TIMESTAMP"
        
        echo "🚀 Push su GitHub..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo "✅ Push completato!"
            echo "🌐 Render.com si aggiornerà automaticamente"
        else
            echo "❌ Errore durante il push"
        fi
    else
        echo "ℹ️  Nessuna modifica Git rilevata"
    fi
    echo "🔍 Ripresa monitoraggio..."
}

# Controlla se fswatch è installato
if ! command -v fswatch &> /dev/null; then
    echo "❌ fswatch non installato"
    echo "💡 Installalo con: brew install fswatch"
    echo "🔄 Uso fallback con watchman o polling..."
    
    # Fallback: monitoring manuale ogni 30 secondi
    while true; do
        if [[ -n $(git status -s) ]]; then
            do_push
        fi
        sleep 30
    done
else
    # Usa fswatch per monitoraggio real-time
    fswatch -o . | while read f; do
        do_push
    done
fi
