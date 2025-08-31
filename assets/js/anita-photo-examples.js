console.log('🎨 Simulazione caricamento foto Anita...');

// Esempio di foto simulate per testare il sistema
const examplePhotos = [
    {
        category: 'ricordi',
        filename: 'anita_sorriso_2024.jpg',
        title: 'Il tuo sorriso che illumina la giornata',
        date: '2024-03-15',
        description: 'Ogni volta che sorridi così, il mondo diventa più bello.',
        tags: ['sorriso', 'felicità', 'bellezza']
    },
    {
        category: 'insieme',
        filename: 'noi_selfie_primavera.jpg',
        title: 'Noi due in primavera',
        date: '2024-04-20',
        description: 'Con te ogni stagione è primavera nel mio cuore.',
        tags: ['coppia', 'primavera', 'amore']
    },
    {
        category: 'viaggi',
        filename: 'viaggio_mare_estate.jpg',
        title: 'La nostra fuga al mare',
        date: '2024-07-10',
        description: 'Esplorando coste infinite, mano nella mano.',
        tags: ['mare', 'estate', 'viaggio']
    },
    {
        category: 'momenti-speciali',
        filename: 'compleanno_anita_2024.jpg',
        title: 'Il tuo giorno speciale',
        date: '2024-05-12',
        description: 'Celebrando la persona più importante della mia vita.',
        tags: ['compleanno', 'celebrazione', 'gioia']
    }
];

// Funzione per caricare foto di esempio (per testing)
function loadExamplePhotos() {
    const existingPhotos = JSON.parse(localStorage.getItem('photobook_photos') || '[]');
    
    examplePhotos.forEach(photo => {
        const photoData = {
            id: Date.now() + Math.random(),
            src: `assets/images/anita/${photo.category}/${photo.filename}`,
            title: photo.title,
            date: photo.date,
            category: photo.category,
            description: photo.description,
            tags: photo.tags,
            addedDate: new Date().toISOString(),
            isExample: true // Segna come foto di esempio
        };
        
        // Controlla se non esiste già
        const exists = existingPhotos.find(p => p.src === photoData.src);
        if (!exists) {
            existingPhotos.push(photoData);
        }
    });
    
    localStorage.setItem('photobook_photos', JSON.stringify(existingPhotos));
    console.log('💜 Foto di esempio caricate!');
    
    // Ricarica la galleria
    if (typeof refreshPhotoGallery === 'function') {
        refreshPhotoGallery();
    }
}

// Funzione per rimuovere foto di esempio
function removeExamplePhotos() {
    const existingPhotos = JSON.parse(localStorage.getItem('photobook_photos') || '[]');
    const filtered = existingPhotos.filter(photo => !photo.isExample);
    localStorage.setItem('photobook_photos', JSON.stringify(filtered));
    console.log('🗑️ Foto di esempio rimosse');
    
    if (typeof refreshPhotoGallery === 'function') {
        refreshPhotoGallery();
    }
}

// Aggiungi pulsanti di controllo per il testing
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
    setTimeout(() => {
        const debugPanel = document.createElement('div');
        debugPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(138, 43, 226, 0.9);
            color: white;
            padding: 15px;
            border-radius: 15px;
            z-index: 9999;
            font-family: Inter, sans-serif;
            font-size: 14px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        debugPanel.innerHTML = `
            <h4 style="margin: 0 0 10px 0;">🎨 Debug Anita Photos</h4>
            <button onclick="loadExamplePhotos()" style="
                background: white;
                color: #8a2be2;
                border: none;
                padding: 8px 12px;
                border-radius: 8px;
                margin: 5px;
                cursor: pointer;
                font-weight: 600;
            ">Carica Esempi</button>
            <button onclick="removeExamplePhotos()" style="
                background: #ff6b6b;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 8px;
                margin: 5px;
                cursor: pointer;
                font-weight: 600;
            ">Rimuovi Esempi</button>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Rendi le funzioni globali per i pulsanti
        window.loadExamplePhotos = loadExamplePhotos;
        window.removeExamplePhotos = removeExamplePhotos;
        
    }, 2000);
}

console.log('🧪 Sistema di testing foto Anita caricato!');
