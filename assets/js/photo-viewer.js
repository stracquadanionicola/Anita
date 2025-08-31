/**
 * Sistema di visualizzazione foto interattivo con anteprima e navigazione
 */

class PhotoViewer {
    constructor() {
        this.currentPhotoIndex = 0;
        this.photos = [];
        this.isViewerOpen = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.initViewer();
        this.bindEvents();
    }
    
    initViewer() {
        // Crea il viewer se non esiste
        if (!document.getElementById('photo-viewer')) {
            const viewer = document.createElement('div');
            viewer.id = 'photo-viewer';
            viewer.className = 'photo-viewer';
            viewer.innerHTML = `
                <div class="photo-viewer-overlay"></div>
                <div class="photo-viewer-container">
                    <button class="photo-viewer-close" aria-label="Chiudi">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <button class="photo-nav photo-nav-prev" aria-label="Foto precedente">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <button class="photo-nav photo-nav-next" aria-label="Foto successiva">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    
                    <div class="photo-viewer-content">
                        <div class="photo-viewer-main">
                            <img class="photo-viewer-image" src="" alt="" />
                            <div class="photo-loading">
                                <i class="fas fa-heart photo-loading-heart"></i>
                                <p>Caricando...</p>
                            </div>
                        </div>
                        
                        <div class="photo-viewer-info">
                            <div class="photo-info-header">
                                <h3 class="photo-title"></h3>
                                <span class="photo-date"></span>
                            </div>
                            <div class="photo-description"></div>
                            <div class="photo-spanish-phrase"></div>
                            <div class="photo-tags"></div>
                            
                            <div class="photo-actions">
                                <button class="btn-outline photo-action-btn" onclick="downloadCurrentPhoto()">
                                    <i class="fas fa-download"></i>
                                    Scarica
                                </button>
                                <button class="btn-outline photo-action-btn" onclick="shareCurrentPhoto()">
                                    <i class="fas fa-share"></i>
                                    Condividi
                                </button>
                                <button class="btn-outline photo-action-btn" onclick="addToFavorites()">
                                    <i class="fas fa-heart"></i>
                                    Preferiti
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="photo-thumbnails">
                        <div class="thumbnails-container"></div>
                    </div>
                    
                    <div class="photo-counter">
                        <span class="current-photo">1</span>
                        <span class="photo-separator">di</span>
                        <span class="total-photos">1</span>
                    </div>
                </div>
            `;
            
            document.body.appendChild(viewer);
        }
    }
    
    bindEvents() {
        const viewer = document.getElementById('photo-viewer');
        if (!viewer) return;
        
        // Chiusura viewer
        viewer.querySelector('.photo-viewer-close').addEventListener('click', () => this.closeViewer());
        viewer.querySelector('.photo-viewer-overlay').addEventListener('click', () => this.closeViewer());
        
        // Navigazione
        viewer.querySelector('.photo-nav-prev').addEventListener('click', () => this.previousPhoto());
        viewer.querySelector('.photo-nav-next').addEventListener('click', () => this.nextPhoto());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isViewerOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeViewer();
                    break;
                case 'ArrowLeft':
                    this.previousPhoto();
                    break;
                case 'ArrowRight':
                    this.nextPhoto();
                    break;
            }
        });
        
        // Touch events per mobile
        const container = viewer.querySelector('.photo-viewer-main');
        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        // Prevenzione scroll quando viewer è aperto
        viewer.addEventListener('wheel', (e) => {
            e.preventDefault();
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextPhoto(); // Swipe left = next
            } else {
                this.previousPhoto(); // Swipe right = previous
            }
        }
    }
    
    openViewer(photos, startIndex = 0) {
        this.photos = photos;
        this.currentPhotoIndex = startIndex;
        this.isViewerOpen = true;
        
        const viewer = document.getElementById('photo-viewer');
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.updateViewer();
        this.createThumbnails();
        
        // Animazione di entrata
        requestAnimationFrame(() => {
            viewer.style.opacity = '1';
            viewer.querySelector('.photo-viewer-container').style.transform = 'scale(1)';
        });
    }
    
    closeViewer() {
        const viewer = document.getElementById('photo-viewer');
        this.isViewerOpen = false;
        
        // Animazione di uscita
        viewer.style.opacity = '0';
        viewer.querySelector('.photo-viewer-container').style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            viewer.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }
    
    updateViewer() {
        if (!this.photos.length) return;
        
        const photo = this.photos[this.currentPhotoIndex];
        const viewer = document.getElementById('photo-viewer');
        
        // Mostra loading
        const loading = viewer.querySelector('.photo-loading');
        const image = viewer.querySelector('.photo-viewer-image');
        loading.style.display = 'flex';
        image.style.opacity = '0';
        
        // Carica nuova immagine
        const newImage = new Image();
        newImage.onload = () => {
            image.src = newImage.src;
            image.alt = photo.title;
            
            // Animazione fade in
            setTimeout(() => {
                loading.style.display = 'none';
                image.style.opacity = '1';
            }, 200);
        };
        
        newImage.onerror = () => {
            loading.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Errore nel caricamento</p>';
        };
        
        newImage.src = photo.src;
        
        // Aggiorna info
        viewer.querySelector('.photo-title').textContent = photo.title;
        viewer.querySelector('.photo-description').textContent = photo.description;
        
        // Frase spagnola
        const spanishElement = viewer.querySelector('.photo-spanish-phrase');
        if (photo.spanishPhrase) {
            spanishElement.textContent = `"${photo.spanishPhrase}"`;
            spanishElement.style.display = 'block';
        } else {
            spanishElement.style.display = 'none';
        }
        
        // Tags
        const tagsContainer = viewer.querySelector('.photo-tags');
        tagsContainer.innerHTML = '';
        if (photo.tags && photo.tags.length) {
            photo.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'photo-tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
        
        // Counter
        viewer.querySelector('.current-photo').textContent = this.currentPhotoIndex + 1;
        viewer.querySelector('.total-photos').textContent = this.photos.length;
        
        // Aggiorna thumbnails
        this.updateThumbnails();
        
        // Controlli navigazione
        const prevBtn = viewer.querySelector('.photo-nav-prev');
        const nextBtn = viewer.querySelector('.photo-nav-next');
        
        prevBtn.style.opacity = this.currentPhotoIndex > 0 ? '1' : '0.3';
        nextBtn.style.opacity = this.currentPhotoIndex < this.photos.length - 1 ? '1' : '0.3';
    }
    
    createThumbnails() {
        const container = document.querySelector('.thumbnails-container');
        container.innerHTML = '';
        
        this.photos.forEach((photo, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'photo-thumbnail';
            thumb.innerHTML = `<img src="${photo.src}" alt="${photo.title}" />`;
            
            thumb.addEventListener('click', () => {
                this.currentPhotoIndex = index;
                this.updateViewer();
            });
            
            container.appendChild(thumb);
        });
    }
    
    updateThumbnails() {
        const thumbnails = document.querySelectorAll('.photo-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentPhotoIndex);
        });
        
        // Scroll to active thumbnail
        const activeThumb = thumbnails[this.currentPhotoIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    }
    
    previousPhoto() {
        if (this.currentPhotoIndex > 0) {
            this.currentPhotoIndex--;
            this.updateViewer();
        }
    }
    
    nextPhoto() {
        if (this.currentPhotoIndex < this.photos.length - 1) {
            this.currentPhotoIndex++;
            this.updateViewer();
        }
    }
    
    formatDate(dateString) {
        if (!dateString || dateString === 'Invalid Date') {
            return 'Momento speciale';
        }
        
        try {
            const date = new Date(dateString + 'T00:00:00');
            if (isNaN(date.getTime())) {
                return 'Momento speciale';
            }
            
            return date.toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return 'Momento speciale';
        }
    }
}

// Funzioni globali per le azioni
window.downloadCurrentPhoto = function() {
    const viewer = window.photoViewer;
    if (viewer && viewer.photos[viewer.currentPhotoIndex]) {
        const photo = viewer.photos[viewer.currentPhotoIndex];
        const link = document.createElement('a');
        link.href = photo.src;
        link.download = `${photo.title}.jpg`;
        link.click();
    }
};

window.shareCurrentPhoto = function() {
    const viewer = window.photoViewer;
    if (viewer && viewer.photos[viewer.currentPhotoIndex]) {
        const photo = viewer.photos[viewer.currentPhotoIndex];
        if (navigator.share) {
            navigator.share({
                title: photo.title,
                text: photo.description,
                url: window.location.href
            });
        } else {
            // Fallback: copia URL
            navigator.clipboard.writeText(window.location.href);
            showNotification('Link copiato negli appunti!');
        }
    }
};

window.addToFavorites = function() {
    const viewer = window.photoViewer;
    if (viewer && viewer.photos[viewer.currentPhotoIndex]) {
        const photo = viewer.photos[viewer.currentPhotoIndex];
        let favorites = JSON.parse(localStorage.getItem('favorite_photos') || '[]');
        
        if (!favorites.find(f => f.id === photo.id)) {
            favorites.push(photo);
            localStorage.setItem('favorite_photos', JSON.stringify(favorites));
            showNotification('Aggiunta ai preferiti! 💜');
        } else {
            showNotification('Già nei preferiti!');
        }
    }
};

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(135deg, #8a2be2 0%, #4b0082 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 11000;
        font-family: Inter, sans-serif;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(138, 43, 226, 0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Inizializza il viewer quando la pagina è carica
document.addEventListener('DOMContentLoaded', () => {
    window.photoViewer = new PhotoViewer();
});

console.log('📸 Sistema visualizzazione foto interattivo caricato!');
