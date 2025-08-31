/**
 * Script per pre-caricare TUTTE le foto di Anita nel photobook
 * Questo file gestisce il caricamento automatico della collezione completa
 * Aggiornato automaticamente - Attualmente: 83 foto
 */

// Configurazione delle foto di Anita
const anitaPhotos = {
    ricordi: [
        // Le foto verranno aggiunte qui automaticamente
        // {
        //     filename: 'nome-foto.jpg',
        //     title: 'Titolo del ricordo',
        //     date: '2024-01-01',
        //     description: 'Descrizione del momento',
        //     tags: ['amore', 'felicità']
        // }
    ],
    viaggi: [
        // Foto di viaggi insieme
    ],
    'momenti-speciali': [
        // Compleanni, anniversari, celebrazioni
    ],
    insieme: [
        // Foto di coppia
    ]
};

// Funzione per analizzare e categorizzare automaticamente le foto
function analyzePhoto(filename, imagePath) {
    const keywords = {
        ricordi: ['ricordo', 'memoria', 'passato', 'nostalgia'],
        viaggi: ['viaggio', 'vacanza', 'mare', 'montagna', 'città', 'travel'],
        'momenti-speciali': ['compleanno', 'anniversario', 'festa', 'celebrazione'],
        insieme: ['coppia', 'amore', 'noi', 'insieme', 'selfie']
    };
    
    const lowerFilename = filename.toLowerCase();
    
    // Analisi del nome file per categorizzazione automatica
    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => lowerFilename.includes(word))) {
            return category;
        }
    }
    
    // Categoria di default
    return 'ricordi';
}

// Funzione per generare metadati automatici
function generatePhotoMetadata(filename, category) {
    const datePattern = /(\d{4})[_-]?(\d{2})[_-]?(\d{2})/;
    const dateMatch = filename.match(datePattern);
    
    let date = new Date().toISOString().split('T')[0]; // Data di oggi come fallback
    if (dateMatch) {
        const [, year, month, day] = dateMatch;
        date = `${year}-${month}-${day}`;
    }
    
    // Genera titoli basati sulla categoria
    const titles = {
        ricordi: [
            'Un momento prezioso',
            'Ricordo indimenticabile',
            'Dolce memoria',
            'Momento da tesoro'
        ],
        viaggi: [
            'Avventura insieme',
            'Scoprendo il mondo',
            'Viaggio del cuore',
            'Destinazione amore'
        ],
        'momenti-speciali': [
            'Giorno speciale',
            'Celebrazione dell\'amore',
            'Momento magico',
            'Festa del cuore'
        ],
        insieme: [
            'Noi due',
            'Amore puro',
            'Insieme per sempre',
            'Il nostro amore'
        ]
    };
    
    const categoryTitles = titles[category] || titles.ricordi;
    const randomTitle = categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
    
    return {
        title: randomTitle,
        date: date,
        category: category,
        tags: getTagsByCategory(category),
        description: generateDescription(category)
    };
}

// Genera tags per categoria
function getTagsByCategory(category) {
    const tagsByCategory = {
        ricordi: ['memoria', 'dolcezza', 'nostalgia'],
        viaggi: ['avventura', 'scoperta', 'libertà'],
        'momenti-speciali': ['celebrazione', 'gioia', 'festa'],
        insieme: ['amore', 'coppia', 'felicità']
    };
    
    return tagsByCategory[category] || ['amore'];
}

// Genera descrizioni romantiche
function generateDescription(category) {
    const descriptions = {
        ricordi: [
            'Ogni volta che guardo questa foto, il mio cuore si riempie di gioia.',
            'Un ricordo che porterò sempre con me.',
            'In questo momento ero completamente felice.',
            'Una memoria che scalda il cuore.'
        ],
        viaggi: [
            'Esplorando il mondo mano nella mano.',
            'Ogni viaggio con te è un\'avventura magica.',
            'Questi sono i momenti che rendono la vita speciale.',
            'Viaggiare insieme è la mia felicità.'
        ],
        'momenti-speciali': [
            'Un giorno che non dimenticherò mai.',
            'Celebrando la vita e l\'amore.',
            'Momenti come questi sono pura magia.',
            'La gioia di condividere questi istanti con te.'
        ],
        insieme: [
            'Noi due contro il mondo.',
            'L\'amore si vede nei nostri occhi.',
            'Insieme siamo invincibili.',
            'Il nostro amore cresce ogni giorno.'
        ]
    };
    
    const categoryDesc = descriptions[category] || descriptions.ricordi;
    return categoryDesc[Math.floor(Math.random() * categoryDesc.length)];
}

// Funzione per pre-caricare le foto nel localStorage
function preloadPhotosToPhotobook() {
    console.log('🎨 Iniziando il caricamento delle foto di Anita...');
    
    // Questa funzione verrà chiamata dopo aver copiato le foto nelle cartelle
    // e aver aggiornato l'array anitaPhotos
    
    const existingPhotos = JSON.parse(localStorage.getItem('photobook_photos') || '[]');
    let newPhotosCount = 0;
    
    Object.entries(anitaPhotos).forEach(([category, photos]) => {
        photos.forEach(photo => {
            const fullPath = `assets/images/anita/${category}/${photo.filename}`;
            
            // Controlla se la foto non è già presente
            const exists = existingPhotos.find(p => p.src === fullPath);
            if (!exists) {
                const photoData = {
                    id: Date.now() + Math.random(),
                    src: fullPath,
                    title: photo.title,
                    date: photo.date,
                    category: category,
                    description: photo.description,
                    tags: photo.tags || [],
                    addedDate: new Date().toISOString()
                };
                
                existingPhotos.push(photoData);
                newPhotosCount++;
            }
        });
    });
    
    // Salva nel localStorage
    localStorage.setItem('photobook_photos', JSON.stringify(existingPhotos));
    
    console.log(`💜 Caricate ${newPhotosCount} nuove foto di Anita!`);
    
    // Ricarica la galleria se siamo nella pagina
    if (typeof refreshPhotoGallery === 'function') {
        refreshPhotoGallery();
    }
    
    return newPhotosCount;
}

// Funzione per aggiungere una singola foto
function addAnitaPhoto(category, filename, customMetadata = {}) {
    const metadata = generatePhotoMetadata(filename, category);
    const photoData = {
        filename: filename,
        ...metadata,
        ...customMetadata
    };
    
    if (!anitaPhotos[category]) {
        anitaPhotos[category] = [];
    }
    
    anitaPhotos[category].push(photoData);
    console.log(`📸 Aggiunta foto: ${filename} in categoria: ${category}`);
    
    return photoData;
}

// Esporta le funzioni per uso globale
window.anitaPhotoManager = {
    addPhoto: addAnitaPhoto,
    preloadAll: preloadPhotosToPhotobook,
    analyzePhoto: analyzePhoto,
    generateMetadata: generatePhotoMetadata
};

console.log('💜 Sistema di gestione foto Anita inizializzato!');
