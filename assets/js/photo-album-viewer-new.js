/**
 * Album Fotografico con Pagine Sottili Realistiche
 * Sistema di visualizzazione foto integrate nelle pagine sottili
 */

class PhotoAlbumViewer {
    constructor() {
        this.albumContainer = null;
        this.currentPage = 0;
        this.photos = [];
        this.isAnimating = false;
        this.originalOpenBook = null;
        this.pages = [];
        this.coverElement = null;
        this.isCoverOpen = false;
    }

    init() {
        // Sostituisci la funzione originale
        this.originalOpenBook = window.openSpectacularPresentation;
        window.openSpectacularPresentation = () => this.openPhotoAlbum();
        
        this.createAlbumHTML();
        console.log('📖 Album fotografico con pagine sottili inizializzato!');
    }

    createAlbumHTML() {
        const albumHTML = `
            <div id="photo-album-viewer" class="photo-album-viewer">
                <div class="album-container">
                    <div class="album-book" id="album-book">
                        <div class="album-spine"></div>
                        
                        <!-- Copertina del libro -->
                        <div class="album-cover" id="album-cover">
                            <div>Te Quiero<br/>💕</div>
                        </div>
                        
                        <!-- Le pagine verranno generate dinamicamente -->
                    </div>
                    
                    <div class="album-controls">
                        <button class="album-control-btn" id="prev-page" onclick="photoAlbum.previousPage()">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="album-control-btn" id="next-page" onclick="photoAlbum.nextPage()">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    <div class="album-progress" id="album-progress">
                        Pagina 1 di 1
                    </div>
                    
                    <button class="album-close-btn" onclick="photoAlbum.closeAlbum()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', albumHTML);
        this.albumContainer = document.getElementById('photo-album-viewer');
        this.coverElement = document.getElementById('album-cover');
    }

    async openPhotoAlbum() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        console.log('📖 Aprendo album fotografico...');

        // Carica le foto
        await this.loadPhotos();
        
        if (this.photos.length === 0) {
            console.warn('⚠️ Nessuna foto trovata!');
            this.isAnimating = false;
            return;
        }
        
        // Genera le pagine
        this.generatePages();
        
        // Mostra l'album
        this.albumContainer.classList.add('active');
        
        // Animazione di apertura
        const albumBook = document.getElementById('album-book');
        albumBook.classList.add('opening');
        
        // Apri la copertina dopo un momento
        setTimeout(() => {
            this.openCover();
        }, 800);
        
        // Aggiorna controlli
        this.updateControls();
        
        this.isAnimating = false;
    }

    async loadPhotos() {
        // Carica le foto da anitaPhotos se disponibile
        if (typeof anitaPhotos !== 'undefined' && anitaPhotos.length > 0) {
            this.photos = anitaPhotos.slice(); // Copia array
            console.log(`📸 Caricate ${this.photos.length} foto dall'array anitaPhotos`);
        } else {
            // Fallback: carica dal localStorage
            const photobook = JSON.parse(localStorage.getItem('photobook') || '{}');
            this.photos = [...(photobook.photos || []), ...(photobook.memories || [])];
            console.log(`📸 Caricate ${this.photos.length} foto dal localStorage`);
        }
        
        // Filtra solo le foto con immagini valide
        this.photos = this.photos.filter(photo => 
            photo.filename || (photo.file && photo.file.name)
        );
        
        console.log(`📚 Foto finali disponibili: ${this.photos.length}`);
    }

    openCover() {
        this.coverElement.classList.add('open');
        this.isCoverOpen = true;
        console.log('📖 Copertina aperta');
    }

    generatePages() {
        const albumBook = document.getElementById('album-book');
        
        // Rimuovi pagine esistenti (mantieni spine e cover)
        albumBook.querySelectorAll('.album-page').forEach(page => page.remove());
        
        this.pages = [];
        
        // Genera una pagina per ogni foto
        this.photos.forEach((photo, index) => {
            const page = this.createPage(photo, index);
            this.pages.push(page);
            albumBook.appendChild(page);
        });
        
        // Organizza le pagine
        this.arrangePages();
        
        console.log(`📄 Generate ${this.pages.length} pagine sottili`);
    }

    createPage(photo, index) {
        const page = document.createElement('div');
        page.className = 'album-page';
        
        // Z-index per stacking corretto (le pagine future sopra quelle passate)
        page.style.zIndex = 90 - index;
        
        const filename = photo.filename || photo.file?.name || '';
        const title = photo.title || 'Momento Speciale';
        const description = photo.description || 'Un ricordo prezioso';
        const spanish = photo.spanish || 'Te quiero';
        
        page.innerHTML = `
            <div class="page-content">
                <div class="page-photo-container">
                    <img class="page-photo" 
                         src="./assets/images/anita/ricordi/${filename}" 
                         alt="${title}"
                         onerror="this.parentElement.innerHTML='<div style=\\"display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:1.5rem;\\"><i class=\\"fas fa-image\\"></i><br/>Foto non disponibile</div>'"
                    />
                </div>
                <div class="page-description">
                    <div class="page-title">${title}</div>
                    <div class="page-text">${description}</div>
                    <div class="page-spanish">${spanish}</div>
                </div>
            </div>
        `;
        
        return page;
    }

    arrangePages() {
        this.pages.forEach((page, index) => {
            page.classList.remove('turned', 'left-page');
            
            if (index < this.currentPage) {
                // Pagine già voltate (diventano pagine sinistre)
                page.classList.add('left-page', 'turned');
            } else {
                // Pagine future (rimangono a destra)
                page.classList.remove('left-page', 'turned');
            }
        });
    }

    nextPage() {
        if (this.isAnimating || this.currentPage >= this.photos.length - 1) return;
        
        this.isAnimating = true;
        console.log(`📄 Voltando pagina ${this.currentPage + 1}`);
        
        // Volta la pagina corrente
        const currentPageElement = this.pages[this.currentPage];
        
        // Prima la trasforma in pagina sinistra
        currentPageElement.classList.add('left-page');
        
        // Poi la volta
        setTimeout(() => {
            currentPageElement.classList.add('turned');
        }, 50);
        
        this.currentPage++;
        
        setTimeout(() => {
            this.updateControls();
            this.isAnimating = false;
        }, 700);
    }

    previousPage() {
        if (this.isAnimating || this.currentPage <= 0) return;
        
        this.isAnimating = true;
        
        this.currentPage--;
        console.log(`📄 Tornando alla pagina ${this.currentPage + 1}`);
        
        // Prendi la pagina da voltare indietro
        const prevPageElement = this.pages[this.currentPage];
        
        // Rimuovi la rotazione
        prevPageElement.classList.remove('turned');
        
        // Poi rimuovi la classe left-page
        setTimeout(() => {
            prevPageElement.classList.remove('left-page');
        }, 50);
        
        setTimeout(() => {
            this.updateControls();
            this.isAnimating = false;
        }, 700);
    }

    updateControls() {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const progress = document.getElementById('album-progress');
        
        prevBtn.disabled = this.currentPage <= 0;
        nextBtn.disabled = this.currentPage >= this.photos.length - 1;
        
        progress.textContent = `Pagina ${this.currentPage + 1} di ${this.photos.length}`;
    }

    async closeAlbum() {
        if (this.isAnimating) return;
        
        console.log('📖 Chiudendo album...');
        
        // Chiudi la copertina
        this.coverElement.classList.remove('open');
        this.isCoverOpen = false;
        
        // Nascondi l'album
        setTimeout(() => {
            this.albumContainer.classList.remove('active');
        }, 400);
        
        // Reset dell'album
        setTimeout(() => {
            this.currentPage = 0;
            this.arrangePages();
            
            const albumBook = document.getElementById('album-book');
            albumBook.classList.remove('opening');
        }, 1200);
    }

    // Metodi pubblici per i controlli esterni
    goToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.photos.length || this.isAnimating) return;
        
        this.currentPage = pageIndex;
        this.arrangePages();
        this.updateControls();
    }
}

// Inizializza l'album quando il DOM è pronto
const photoAlbum = new PhotoAlbumViewer();

document.addEventListener('DOMContentLoaded', () => {
    photoAlbum.init();
});

// Esporta per uso globale
window.PhotoAlbumViewer = PhotoAlbumViewer;
window.photoAlbum = photoAlbum;
