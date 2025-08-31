/**
 * Album Fotografico Realistico con Pagine Sfogliabili
 * Sistema di visualizzazione foto integrate nelle pagine
 */

class PhotoAlbumViewer {
    constructor() {
        this.albumContainer = null;
        this.currentPage = 0;
        this.photos = [];
        this.isAnimating = false;
        this.originalOpenBook = null;
        this.pages = [];
    }

    init() {
        // Sostituisci la funzione originale
        this.originalOpenBook = window.openSpectacularPresentation;
        window.openSpectacularPresentation = () => this.openPhotoAlbum();
        
        this.createAlbumHTML();
        console.log('📖 Album fotografico inizializzato!');
    }

    createAlbumHTML() {
        const albumHTML = `
            <div id="photo-album-viewer" class="photo-album-viewer">
                <div class="album-container">
                    <div class="album-book" id="album-book">
                        <div class="album-spine"></div>
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
    }

    async openPhotoAlbum() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        console.log('📖 Aprendo album fotografico...');

        // Carica le foto
        await this.loadPhotos();
        
        // Genera le pagine
        this.generatePages();
        
        // Mostra l'album
        this.albumContainer.classList.add('active');
        
        // Animazione di apertura
        const albumBook = document.getElementById('album-book');
        albumBook.classList.add('opening');
        
        // Aggiorna controlli
        this.updateControls();
        
        this.isAnimating = false;
    }

    async loadPhotos() {
        // Carica le foto da anitaPhotos se disponibile
        if (typeof anitaPhotos !== 'undefined' && anitaPhotos.length > 0) {
            this.photos = anitaPhotos.slice(); // Copia array
            console.log(`� Caricate ${this.photos.length} foto dall'array anitaPhotos`);
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
    }

    generatePages() {
        const albumBook = document.getElementById('album-book');
        const spine = albumBook.querySelector('.album-spine');
        
        // Rimuovi pagine esistenti (eccetto spine)
        albumBook.querySelectorAll('.album-page').forEach(page => page.remove());
        
        this.pages = [];
        
        // Genera una pagina per ogni foto
        this.photos.forEach((photo, index) => {
            const page = this.createPage(photo, index);
            this.pages.push(page);
            albumBook.appendChild(page);
        });
        
        // Posiziona le pagine
        this.arrangePages();
        
        console.log(`📄 Generate ${this.pages.length} pagine`);
    }

    createPage(photo, index) {
        const page = document.createElement('div');
        page.className = 'album-page';
        page.style.zIndex = this.photos.length - index;
        
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
                         onerror="this.parentElement.innerHTML='<div style=\\"display:flex;align-items:center;justify-content:center;height:100%;color:#999;\\"><i class=\\"fas fa-image\\" style=\\"font-size:3rem;\\"></i></div>'"
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
            if (index < this.currentPage) {
                // Pagine già voltate (a sinistra)
                page.classList.add('left', 'turning');
            } else if (index === this.currentPage) {
                // Pagina corrente (a destra)
                page.classList.remove('left', 'turning');
            } else {
                // Pagine future (impilate a destra)
                page.classList.remove('left', 'turning');
            }
        });
    }

    nextPage() {
        if (this.isAnimating || this.currentPage >= this.photos.length - 1) return;
        
        this.isAnimating = true;
        
        // Anima la pagina corrente
        const currentPageElement = this.pages[this.currentPage];
        currentPageElement.classList.add('left', 'turning');
        
        this.currentPage++;
        
        setTimeout(() => {
            this.updateControls();
            this.isAnimating = false;
        }, 800);
    }

    previousPage() {
        if (this.isAnimating || this.currentPage <= 0) return;
        
        this.isAnimating = true;
        
        this.currentPage--;
        
        // Anima la pagina precedente di ritorno
        const prevPageElement = this.pages[this.currentPage];
        prevPageElement.classList.remove('left', 'turning');
        
        setTimeout(() => {
            this.updateControls();
            this.isAnimating = false;
        }, 800);
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
        
        this.albumContainer.classList.remove('active');
        
        // Reset dell'album
        setTimeout(() => {
            this.currentPage = 0;
            this.arrangePages();
            
            const albumBook = document.getElementById('album-book');
            albumBook.classList.remove('opening');
        }, 800);
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
