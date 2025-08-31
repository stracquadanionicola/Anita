// ====================================
// 📖 PHOTOBOOK FUNCTIONALITY
// ====================================

// Storage keys
const STORAGE_KEYS = {
    photos: 'photobook_photos',
    memories: 'photobook_memories',
    letters: 'photobook_letters',
    settings: 'photobook_settings'
};

// State management
let photobook = {
    photos: [],
    memories: [],
    letters: [],
    currentFilter: 'all',
    isLoading: false
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    initPhotobook();
    setupEventListeners();
    loadStoredData();
    hideLoadingScreen();
});

// Nascondere loading screen
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
}

// Inizializzazione del photobook
function initPhotobook() {
    // Inizializza AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    
    // Aggiorna il contatore delle foto
    updatePhotoCount();
    
    // Inizializza la navigazione mobile
    initMobileNavigation();
    
    console.log('📖 Photobook inizializzato!');
}

// Setup event listeners
function setupEventListeners() {
    // Upload area drag & drop
    const uploadArea = document.getElementById('upload-area');
    const photoInput = document.getElementById('photo-input');
    
    if (uploadArea && photoInput) {
        setupDragAndDrop(uploadArea, photoInput);
        photoInput.addEventListener('change', handleFileSelect);
    }
    
    // Filtri galleria
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => filterPhotos(btn.dataset.filter));
    });
    
    // Chiusura modali con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Click fuori dalle modali per chiuderle
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// Drag and Drop setup
function setupDragAndDrop(uploadArea, photoInput) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    uploadArea.addEventListener('drop', handleDrop, false);
    uploadArea.addEventListener('click', () => photoInput.click());
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        uploadArea.classList.add('dragover');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
}

// Gestione selezione file
function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

// Gestione file caricati
function handleFiles(files) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = [];
    
    Array.from(files).forEach(file => {
        if (!validTypes.includes(file.type)) {
            showNotification('❌ File non supportato: ' + file.name, 'error');
            return;
        }
        
        if (file.size > maxSize) {
            showNotification('❌ File troppo grande: ' + file.name + ' (max 10MB)', 'error');
            return;
        }
        
        validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
        showFilePreview(validFiles);
    }
}

// Mostra preview dei file
function showFilePreview(files) {
    const previewSection = document.getElementById('upload-preview');
    const previewContainer = document.getElementById('preview-container');
    
    if (!previewSection || !previewContainer) return;
    
    previewContainer.innerHTML = '';
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button class="preview-remove" onclick="removePreviewItem(this)" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            previewContainer.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
    
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
    
    // Salva i file temporaneamente
    window.tempFiles = files;
}

// Rimuovi item dal preview
function removePreviewItem(button) {
    const index = parseInt(button.dataset.index);
    const previewItem = button.parentElement;
    previewItem.remove();
    
    // Rimuovi dal array temporaneo
    if (window.tempFiles) {
        window.tempFiles = Array.from(window.tempFiles).filter((_, i) => i !== index);
        
        if (window.tempFiles.length === 0) {
            clearPreview();
        }
    }
}

// Pulisci preview
function clearPreview() {
    const previewSection = document.getElementById('upload-preview');
    if (previewSection) {
        previewSection.style.display = 'none';
    }
    window.tempFiles = null;
}

// Salva foto nell'album
async function savePhotos() {
    if (!window.tempFiles || window.tempFiles.length === 0) {
        showNotification('❌ Nessuna foto da salvare', 'error');
        return;
    }
    
    try {
        showNotification('💖 Salvando le foto...', 'info');
        
        for (const file of window.tempFiles) {
            const photoData = await processPhoto(file);
            photobook.photos.push(photoData);
        }
        
        saveToStorage(STORAGE_KEYS.photos, photobook.photos);
        updatePhotoCount();
        renderGallery();
        clearPreview();
        
        showNotification(`✨ ${window.tempFiles.length} foto salvate con successo!`, 'success');
        
        // Scorri alla galleria
        setTimeout(() => {
            scrollToSection('gallery');
        }, 1000);
        
    } catch (error) {
        console.error('Errore nel salvare le foto:', error);
        showNotification('❌ Errore nel salvare le foto', 'error');
    }
}

// Processa una singola foto
async function processPhoto(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoData = {
                id: generateId(),
                src: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                title: '',
                description: '',
                category: 'speciale',
                tags: []
            };
            
            // Apri modal per aggiungere dettagli
            openPhotoDetailsModal(photoData, resolve);
        };
        reader.readAsDataURL(file);
    });
}

// Modal per dettagli foto
function openPhotoDetailsModal(photoData, callback) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-camera"></i> Dettagli Foto</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 1rem;">
                    <img src="${photoData.src}" style="max-width: 100%; max-height: 200px; border-radius: 10px;">
                </div>
                <form id="photo-details-form">
                    <div class="form-group">
                        <label for="photo-title">Titolo della foto:</label>
                        <input type="text" id="photo-title" placeholder="Es: La nostra cena romantica" required>
                    </div>
                    <div class="form-group">
                        <label for="photo-description">Descrizione (opzionale):</label>
                        <textarea id="photo-description" rows="3" placeholder="Racconta questo momento..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="photo-category">Categoria:</label>
                        <select id="photo-category">
                            <option value="speciale">Momento Speciale</option>
                            <option value="selfie">Selfie</option>
                            <option value="viaggio">Viaggio</option>
                            <option value="casa">A Casa</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()">Salta</button>
                <button class="btn-primary" onclick="savePhotoDetails('${photoData.id}')">
                    <i class="fas fa-heart"></i>
                    Salva
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Salva callback per dopo
    window.currentPhotoCallback = callback;
    window.currentPhotoData = photoData;
}

// Salva dettagli foto
function savePhotoDetails(photoId) {
    const form = document.getElementById('photo-details-form');
    const modal = form.closest('.modal');
    
    if (window.currentPhotoData && window.currentPhotoCallback) {
        window.currentPhotoData.title = document.getElementById('photo-title').value || 'Ricordo senza titolo';
        window.currentPhotoData.description = document.getElementById('photo-description').value || '';
        window.currentPhotoData.category = document.getElementById('photo-category').value;
        
        window.currentPhotoCallback(window.currentPhotoData);
        
        // Pulisci
        window.currentPhotoData = null;
        window.currentPhotoCallback = null;
    }
    
    modal.remove();
}

// Renderizza galleria
function renderGallery() {
    const gallery = document.getElementById('photo-gallery');
    const emptyGallery = document.getElementById('empty-gallery');
    
    if (!gallery) return;
    
    // Filtra foto
    const filteredPhotos = photobook.photos.filter(photo => {
        return photobook.currentFilter === 'all' || photo.category === photobook.currentFilter;
    });
    
    if (filteredPhotos.length === 0) {
        if (emptyGallery) emptyGallery.style.display = 'block';
        return;
    }
    
    if (emptyGallery) emptyGallery.style.display = 'none';
    
    // Rimuovi foto esistenti (mantieni empty gallery)
    const existingPhotos = gallery.querySelectorAll('.photo-item');
    existingPhotos.forEach(item => item.remove());
    
    // Aggiungi nuove foto
    filteredPhotos.forEach(photo => {
        const photoElement = createPhotoElement(photo);
        gallery.appendChild(photoElement);
    });
    
    // Aggiorna AOS se disponibile
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Crea elemento foto
function createPhotoElement(photo) {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.setAttribute('data-aos', 'zoom-in');
    
    // Crea l'elemento immagine con lazy loading
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.title;
    img.loading = 'lazy';
    
    // Gestisci il caricamento dell'immagine
    img.addEventListener('load', () => {
        img.classList.add('loaded');
    });
    
    img.addEventListener('error', () => {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmNWY1ZjUiLz48cGF0aCBkPSJNMTUwIDEwMEMxNTAgMTA1LjUyMyAxNDUuNTIzIDExMCAxNDAgMTEwSDYwQzU0LjQ3NzIgMTEwIDUwIDEwNS41MjMgNTAgMTAwVjYwQzUwIDU0LjQ3NzIgNTQuNDc3MiA1MCA2MCA1MEgxNDBDMTQ1LjUyMyA1MCAxNTAgNTQuNDc3MiAxNTAgNjBWMTAwWiIgZmlsbD0iI2U1ZTVlNSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiPkltbWFnaW5lIG5vbiB0cm92YXRhPC90ZXh0Pjwvc3ZnPg==';
        img.alt = 'Immagine non trovata';
    });
    
    photoItem.innerHTML = `
        <div class="photo-info">
            <h3 class="photo-title">${photo.title}</h3>
            <span class="photo-category">${getCategoryName(photo.category)}</span>
        </div>
    `;
    
    // Inserisci l'immagine all'inizio
    photoItem.insertBefore(img, photoItem.firstChild);
    
    // Aggiungi evento click per aprire il visualizzatore interattivo
    photoItem.addEventListener('click', () => {
        openPhotoViewer(photo);
    });
    
    return photoItem;
}

// Apre il visualizzatore foto interattivo
function openPhotoViewer(selectedPhoto) {
    // Filtra le foto per la categoria corrente
    const filteredPhotos = photobook.photos.filter(photo => {
        return photobook.currentFilter === 'all' || photo.category === photobook.currentFilter;
    });
    
    // Trova l'indice della foto selezionata
    const startIndex = filteredPhotos.findIndex(photo => photo.id === selectedPhoto.id);
    
    // Apri il visualizzatore
    if (window.photoViewer) {
        window.photoViewer.openViewer(filteredPhotos, Math.max(0, startIndex));
    }
}

// Funzione per aggiornare la galleria (chiamata dal sistema di caricamento Anita)
window.refreshPhotoGallery = function() {
    loadStoredData();
    renderGallery();
};

// Apri modal foto (mantenuto per compatibilità)
function openPhotoModal(photo) {
    // Reindirizza al nuovo visualizzatore
    openPhotoViewer(photo);
}

// Chiudi modal foto
function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
    window.currentPhotoId = null;
}

// Filtra foto
function filterPhotos(filter) {
    photobook.currentFilter = filter;
    
    // Aggiorna UI filtri
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    renderGallery();
}

// Aggiorna contatore foto (rimosso su richiesta)
function updatePhotoCount() {
    // Funzione disabilitata: il contatore non viene più mostrato
    return;
}

// Modali per ricordi e lettere
function openMemoryModal() {
    const modal = document.getElementById('memory-modal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closeMemoryModal() {
    const modal = document.getElementById('memory-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.getElementById('memory-form').reset();
    }
}

function openLetterModal() {
    const modal = document.getElementById('letter-modal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closeLetterModal() {
    const modal = document.getElementById('letter-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.getElementById('letter-form').reset();
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
        modal.style.display = 'none';
    });
}

// Salva ricordo
function saveMemory() {
    const form = document.getElementById('memory-form');
    const formData = new FormData(form);
    
    const memory = {
        id: generateId(),
        date: document.getElementById('memory-date').value,
        title: document.getElementById('memory-title').value,
        description: document.getElementById('memory-description').value,
        photo: null,
        createdAt: new Date().toISOString()
    };
    
    const photoFile = document.getElementById('memory-photo').files[0];
    
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            memory.photo = e.target.result;
            finalizeSaveMemory(memory);
        };
        reader.readAsDataURL(photoFile);
    } else {
        finalizeSaveMemory(memory);
    }
}

function finalizeSaveMemory(memory) {
    photobook.memories.push(memory);
    saveToStorage(STORAGE_KEYS.memories, photobook.memories);
    renderMemories();
    closeMemoryModal();
    showNotification('✨ Ricordo salvato con successo!', 'success');
}

// Salva lettera
function saveLetter() {
    const letter = {
        id: generateId(),
        title: document.getElementById('letter-title').value,
        content: document.getElementById('letter-content').value,
        spanish: document.getElementById('letter-spanish').value,
        createdAt: new Date().toISOString()
    };
    
    photobook.letters.push(letter);
    saveToStorage(STORAGE_KEYS.letters, photobook.letters);
    renderLetters();
    closeLetterModal();
    showNotification('💕 Lettera d\'amore salvata!', 'success');
}

// Renderizza ricordi
function renderMemories() {
    const timeline = document.getElementById('memories-timeline');
    if (!timeline) return;
    
    // Rimuovi template
    const template = timeline.querySelector('.template');
    timeline.innerHTML = '';
    if (template) timeline.appendChild(template);
    
    photobook.memories
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(memory => {
            const memoryElement = createMemoryElement(memory);
            timeline.appendChild(memoryElement);
        });
}

function createMemoryElement(memory) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.setAttribute('data-aos', 'fade-up');
    
    item.innerHTML = `
        <div class="timeline-date">${formatDate(memory.date)}</div>
        <div class="timeline-content">
            ${memory.photo ? `
                <div class="timeline-photo">
                    <img src="${memory.photo}" alt="${memory.title}">
                </div>
            ` : ''}
            <div class="timeline-text">
                <h3>${memory.title}</h3>
                <p>${memory.description}</p>
            </div>
        </div>
    `;
    
    return item;
}

// Renderizza lettere
function renderLetters() {
    const grid = document.getElementById('lettere-grid');
    if (!grid) return;
    
    // Mantieni le lettere esistenti, aggiungi le nuove
    photobook.letters.forEach(letter => {
        const letterElement = createLetterElement(letter);
        grid.appendChild(letterElement);
    });
}

function createLetterElement(letter) {
    const item = document.createElement('div');
    item.className = 'lettera-card';
    item.setAttribute('data-aos', 'flip-left');
    
    item.innerHTML = `
        <div class="lettera-header">
            <i class="fas fa-heart"></i>
            <span class="lettera-date">${formatDate(letter.createdAt)}</span>
        </div>
        <div class="lettera-content">
            <h3>${letter.title}</h3>
            <p>${letter.content}</p>
            ${letter.spanish ? `<p class="spanish-text">"${letter.spanish}"</p>` : ''}
        </div>
    `;
    
    return item;
}

// Storage functions
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Errore nel salvare in localStorage:', error);
        showNotification('❌ Errore nel salvare i dati', 'error');
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Errore nel caricare da localStorage:', error);
        return [];
    }
}

function loadStoredData() {
    photobook.photos = loadFromStorage(STORAGE_KEYS.photos);
    photobook.memories = loadFromStorage(STORAGE_KEYS.memories);
    photobook.letters = loadFromStorage(STORAGE_KEYS.letters);
    
    updatePhotoCount();
    renderGallery();
    renderMemories();
    renderLetters();
    
    console.log('📚 Dati caricati:', {
        foto: photobook.photos.length,
        ricordi: photobook.memories.length,
        lettere: photobook.letters.length
    });
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getCategoryName(category) {
    const names = {
        speciale: 'Momento Speciale',
        selfie: 'Selfie',
        viaggio: 'Viaggio',
        casa: 'A Casa'
    };
    return names[category] || category;
}

// Navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            const isExpanded = navToggle.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
}

// Notifiche
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Download foto
function downloadPhoto() {
    if (!window.currentPhotoId) return;
    
    const photo = photobook.photos.find(p => p.id === window.currentPhotoId);
    if (!photo) return;
    
    const link = document.createElement('a');
    link.href = photo.src;
    link.download = photo.name || 'foto-ricordo.jpg';
    link.click();
    
    showNotification('📥 Download iniziato!', 'success');
}

// Elimina foto
function deletePhoto() {
    if (!window.currentPhotoId) return;
    
    if (confirm('Sei sicuro di voler eliminare questa foto? Non potrai recuperarla.')) {
        photobook.photos = photobook.photos.filter(p => p.id !== window.currentPhotoId);
        saveToStorage(STORAGE_KEYS.photos, photobook.photos);
        updatePhotoCount();
        renderGallery();
        closePhotoModal();
        showNotification('🗑️ Foto eliminata', 'info');
    }
}

// Export globale delle funzioni
window.photobook = {
    savePhotos,
    clearPreview,
    removePreviewItem,
    filterPhotos,
    openMemoryModal,
    closeMemoryModal,
    openLetterModal,
    closeLetterModal,
    saveMemory,
    saveLetter,
    openPhotoModal,
    closePhotoModal,
    downloadPhoto,
    deletePhoto,
    scrollToSection,
    showNotification
};

// Esponi le funzioni principali al window per compatibilità
Object.assign(window, {
    savePhotos,
    clearPreview,
    removePreviewItem,
    openMemoryModal,
    closeMemoryModal,
    openLetterModal,
    closeLetterModal,
    saveMemory,
    saveLetter,
    closePhotoModal,
    downloadPhoto,
    deletePhoto,
    scrollToSection
});

console.log('📖 Photobook JavaScript caricato!');
