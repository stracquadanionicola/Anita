# 🚀 Deployment su Render.com - Album Anita e Nicola

## ✨ Sistema Ottimizzato per Cloud

Il sito è stato ottimizzato per il deployment su Render.com con un sistema intelligente di gestione foto:

### 📸 Sistema Foto Ibrido

1. **Foto Demo Prioritarie** - 15 foto belle da Picsum.photos per caricamento veloce
2. **Foto Originali** - 83 foto personali (182MB) con sistema fallback 
3. **PhotoOptimizer** - Compressione automatica e lazy loading

### 🔧 Caratteristiche Tecniche

- **Build Script**: `build.js` ottimizzato per Render.com
- **Server**: Node.js wrapper per Python HTTP server 
- **Fallback System**: Carica foto demo se quelle originali sono troppo grandi
- **File Ignore**: `.renderignore` esclude foto grandi dal deploy

## 🌟 Deploy su Render.com

### 1. Preparazione Repository

```bash
# Il repository è già pronto con:
git status # Tutto committato
```

### 2. Connessione a Render.com

1. Vai su [render.com](https://render.com)
2. Collega il tuo account GitHub
3. Seleziona "New Web Service"
4. Connetti questo repository

### 3. Configurazione Render.com

```yaml
# Configurazione automatica da render.yaml:
services:
  - type: web
    name: anita-nicola-album
    env: node
    buildCommand: npm install && node build.js
    startCommand: node server.js
    plan: free
```

### 4. Variabili Ambiente (Opzionali)

- `NODE_ENV=production` (attiva automaticamente le foto demo)
- `PORT` (gestito automaticamente da Render.com)

## 📱 Funzionalità Cloud

### Sistema Foto Intelligente

Il sito rileva automaticamente l'ambiente:

- **Sviluppo Locale**: Usa foto originali (182MB)
- **Render.com**: Attiva foto demo automaticamente
- **Fallback**: Se foto non disponibili, carica da Picsum.photos

### Performance

- ⚡ Caricamento ultra-veloce con foto demo
- 🎨 Album ultra-realistico con texture pelle e oro
- 📱 Visualizzazione fullscreen foto (no popup)
- 🔄 Randomizzazione foto Fisher-Yates
- 💨 Transizioni 0.08s ultra-fluide

## 🎯 Test di Funzionamento

```bash
# Test locale
node build.js    # ✅ Build check
node server.js   # 🌐 Server test
```

## 🔗 URL di Deploy

Dopo il deployment, il sito sarà disponibile su:
`https://[nome-app].onrender.com`

## 🐛 Troubleshooting

- **Foto non caricate**: Il sistema fallback caricherà foto demo
- **Build fallito**: Controlla `build.js` per file mancanti
- **Server timeout**: Render.com impiega ~1-2 minuti per il primo avvio

## 💡 Note Tecniche

- **Foto originali**: 83 foto (182MB) - troppo grandi per Render free
- **Foto demo**: 15 foto ottimizzate da Picsum.photos
- **Album realistico**: Texture pelle avorio + decorazioni oro
- **Visualizzazione**: Click foto → fullscreen (no popup descrizioni)

---

**🎉 Il sito è pronto per il deployment cloud!**
