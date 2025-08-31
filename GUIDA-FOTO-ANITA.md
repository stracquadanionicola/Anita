# 📸 Guida per Caricare le Foto di Anita

## 🎯 Obiettivo
Caricare automaticamente tutte le foto di Anita nel photobook, organizzandole per categoria e aggiungendo metadati romantici.

## 📁 Struttura Creata

Ho organizzato le cartelle così:
```
/Users/nicola/sito/assets/images/anita/
├── ricordi/           # Foto di momenti quotidiani e ricordi speciali
├── viaggi/            # Foto di viaggi e vacanze insieme
├── momenti-speciali/  # Compleanni, anniversari, celebrazioni
└── insieme/           # Foto di coppia, selfie, momenti intimi
```

## 🚀 Metodi per Caricare le Foto

### Metodo 1: Script Automatico (Raccomandato)
```bash
# Dalla cartella del sito, esegui:
./copy-anita-photos.sh
```
Questo script:
- ✅ Trova automaticamente tutte le foto nella cartella `/Downloads/FOTO ANITA`
- 🏷️ Le categorizza in base al nome del file
- 📂 Le copia nelle cartelle appropriate
- 📊 Ti mostra un resoconto finale

### Metodo 2: Copia Manuale
Se preferisci scegliere manualmente:

1. **Apri Finder** e vai a `/Users/nicola/Downloads/FOTO ANITA`
2. **Seleziona le foto** per categoria:
   - Ricordi → copia in `sito/assets/images/anita/ricordi/`
   - Viaggi → copia in `sito/assets/images/anita/viaggi/`
   - Momenti speciali → copia in `sito/assets/images/anita/momenti-speciali/`
   - Foto insieme → copia in `sito/assets/images/anita/insieme/`

### Metodo 3: Drag & Drop nel Sito
- Apri il sito nel browser
- Trascina le foto direttamente nell'area upload
- Il sistema le categorizza automaticamente

## 🎨 Cosa Succede Automaticamente

Quando carichi le foto, il sistema:

1. **Analizza ogni foto** per nome e contenuto
2. **Genera metadati romantici**:
   - Titoli dolci e personali
   - Date estratte dal nome file
   - Descrizioni romantiche
   - Tag appropriati per categoria
3. **Le organizza** nella galleria del photobook
4. **Le salva** nel browser per visualizzazione immediata

## 💜 Esempi di Categorizzazione Automatica

**Ricordi:**
- Titoli: "Un momento prezioso", "Ricordo indimenticabile"
- Tags: memoria, dolcezza, nostalgia
- Descrizione: "Ogni volta che guardo questa foto, il mio cuore si riempie di gioia"

**Viaggi:**
- Titoli: "Avventura insieme", "Scoprendo il mondo"
- Tags: avventura, scoperta, libertà
- Descrizione: "Esplorando il mondo mano nella mano"

**Momenti Speciali:**
- Titoli: "Giorno speciale", "Celebrazione dell'amore"
- Tags: celebrazione, gioia, festa
- Descrizione: "Un giorno che non dimenticherò mai"

**Insieme:**
- Titoli: "Noi due", "Amore puro"
- Tags: amore, coppia, felicità
- Descrizione: "Noi due contro il mondo"

## 🔧 Controllo Manuale

Dopo il caricamento, puoi:
- ✏️ **Modificare** titoli e descrizioni
- 🏷️ **Cambiare** categoria
- 📅 **Aggiustare** le date
- 💬 **Aggiungere** note personali

## 🎭 Frasi Romantiche Spagnole Integrate

Il sistema include automaticamente frasi come:
- "Eres el amor de mi vida" (Sei l'amore della mia vita)
- "Contigo hasta el infinito" (Con te fino all'infinito)
- "Mi corazón es tuyo" (Il mio cuore è tuo)

## 🚀 Pronto per Iniziare?

1. **Verifica** che le foto siano in `/Users/nicola/Downloads/FOTO ANITA`
2. **Esegui** lo script: `./copy-anita-photos.sh`
3. **Apri** il sito nel browser
4. **Ammira** il risultato! 💜

Le foto appariranno automaticamente nella galleria con tutti i metadati romantici già configurati!
