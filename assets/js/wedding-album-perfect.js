/**
 * ALBUM MATRIMONIALE PERFETTO - VERSIONE FINALE
 * Tutte le funzioni originali + fix quadrato bianco
 */

(function() {
    'use strict';
    
    class WeddingPhotoAlbum {
        constructor() {
            this.isOpen = false;
            this.currentPage = 0;
            this.photos = [];
            this.albumElement = null;
            this.isAnimating = false;
            this.totalPages = 0;
            this.photoOptimizer = null;
            this.loadedImages = new Map();
        }

        init() {
            console.log('📖 Inizializzando album matrimoniale perfetto...');
            
            // Inizializza optimizer se disponibile
            if (typeof PhotoOptimizer !== 'undefined') {
                this.photoOptimizer = new PhotoOptimizer();
            }
            
            this.createAlbumStructure();
            this.loadPhotos();
            this.overrideOpenFunction();
            
            // ESC key per chiudere
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeAlbum();
                }
            });
            
            // Carica galleria principale
            this.loadMainGallery();
        }

        loadPhotos() {
            if (typeof anitaPhotos !== 'undefined' && Array.isArray(anitaPhotos)) {
                this.photos = [...anitaPhotos].filter(photo => photo.filename);
                
                // Randomizzazione Fisher-Yates
                for (let i = this.photos.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.photos[i], this.photos[j]] = [this.photos[j], this.photos[i]];
                }
                
                this.totalPages = Math.ceil(this.photos.length / 2);
                console.log(`📚 Album caricato: ${this.photos.length} foto, ${this.totalPages} pagine`);
            } else {
                console.warn('⚠️ Nessuna foto trovata, caricamento foto demo...');
                this.loadDemoPhotos();
            }
        }

        loadDemoPhotos() {
            if (typeof demoPhotos !== 'undefined' && Array.isArray(demoPhotos)) {
                this.photos = [...demoPhotos];
                this.totalPages = Math.ceil(this.photos.length / 2);
                console.log(`🎭 Foto demo caricate: ${this.photos.length} foto`);
            }
        }

        createAlbumStructure() {
            const albumHTML = `
                <div id="photo-album" class="album-overlay">
                    <div class="album-container">
                        <button class="album-close-btn" onclick="window.photoAlbum.closeAlbum()">
                            <i class="fas fa-times"></i>
                        </button>
                        
                        <div class="album-book">
                            <div class="album-spine"></div>
                            <div class="album-pages-container">
                                <div class="album-page-stack">
                                    <!-- Le pagine saranno generate dinamicamente -->
                                </div>
                            </div>
                            
                            <div class="album-controls">
                                <button class="album-nav-btn prev" onclick="window.photoAlbum.previousPage()">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <span class="album-page-indicator">
                                    <span class="current-page">1</span> / <span class="total-pages">1</span>
                                </span>
                                <button class="album-nav-btn next" onclick="window.photoAlbum.nextPage()">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', albumHTML);
            this.albumElement = document.getElementById('photo-album');
        }

        overrideOpenFunction() {
            // Override della funzione globale openPhotobook
            window.openPhotobook = () => {
                this.openAlbum();
            };
            
            // Assicura che il pulsante funzioni
            const openBtn = document.querySelector('.hero-btn, .cta-button, [onclick*="openPhotobook"]');
            if (openBtn) {
                openBtn.onclick = (e) => {
                    e.preventDefault();
                    this.openAlbum();
                };
            }
        }

        openAlbum() {
            if (this.isAnimating) return;
            
            console.log('📖 Apertura album...');
            this.isAnimating = true;
            this.isOpen = true;
            
            // Genera le pagine
            this.generatePages();
            
            // Mostra l'album
            this.albumElement.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Animazione di apertura
            setTimeout(() => {
                this.albumElement.classList.add('active');
                this.isAnimating = false;
            }, 50);
        }

        closeAlbum() {
            if (this.isAnimating) return;
            
            console.log('📖 Chiusura album...');
            this.isAnimating = true;
            
            this.albumElement.classList.remove('active');
            
            setTimeout(() => {
                this.albumElement.style.display = 'none';
                document.body.style.overflow = '';
                this.isOpen = false;
                this.isAnimating = false;
            }, 300);
        }

        generatePages() {
            const pageStack = this.albumElement.querySelector('.album-page-stack');
            pageStack.innerHTML = '';
            
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < this.totalPages; i++) {
                const leftPhoto = this.photos[i * 2];
                const rightPhoto = this.photos[i * 2 + 1];
                
                const pageElement = document.createElement('div');
                pageElement.className = `album-page ${i === 0 ? 'active' : ''}`;
                pageElement.innerHTML = this.createPageContent(leftPhoto, rightPhoto, i);
                
                fragment.appendChild(pageElement);
            }
            
            pageStack.appendChild(fragment);
            this.updatePageIndicator();
        }

        createPageContent(leftPhoto, rightPhoto, pageIndex) {
            const leftContent = leftPhoto ? this.createPhotoContent(leftPhoto, 'left') : '<div class="photo-placeholder left"></div>';
            const rightContent = rightPhoto ? this.createPhotoContent(rightPhoto, 'right') : '<div class="photo-placeholder right"></div>';
            
            return `
                <div class="page-left">${leftContent}</div>
                <div class="page-right">${rightContent}</div>
                <div class="page-number">${pageIndex + 1}</div>
            `;
        }

        createPhotoContent(photo, side) {
            const imagePath = this.getImagePath(photo.filename);
            const photoId = `photo-${side}-${Math.random().toString(36).substr(2, 9)}`;
            
            return `
                <div class="photo-frame ${side}" onclick="window.photoAlbum.openPhotoViewer('${imagePath}', '${photo.title || ''}', '${photo.description || ''}')">
                    <div class="photo-container">
                        <img src="${imagePath}" 
                             alt="${photo.title || 'Foto matrimonio'}" 
                             class="album-photo"
                             id="${photoId}"
                             loading="lazy">
                        <div class="photo-overlay">
                            <div class="photo-info">
                                <h3 class="photo-title">${photo.title || 'Momento Speciale'}</h3>
                                <p class="photo-description">${photo.description || 'Un ricordo indimenticabile'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        openPhotoViewer(imagePath, title, description) {
            console.log('🖼️ Apertura viewer foto:', title);
            
            // Crea il viewer se non esiste
            let viewer = document.getElementById('photo-viewer');
            if (!viewer) {
                viewer = document.createElement('div');
                viewer.id = 'photo-viewer';
                viewer.className = 'photo-viewer-overlay';
                document.body.appendChild(viewer);
            }
            
            viewer.innerHTML = `
                <div class="photo-viewer-container">
                    <button class="photo-viewer-close" onclick="window.photoAlbum.closePhotoViewer()">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="photo-viewer-content">
                        <img src="${imagePath}" alt="${title}" class="photo-viewer-image">
                        <div class="photo-viewer-info">
                            <h2 class="photo-viewer-title">${title}</h2>
                            <p class="photo-viewer-description">${description}</p>
                        </div>
                    </div>
                </div>
            `;
            
            viewer.style.display = 'flex';
            setTimeout(() => viewer.classList.add('active'), 50);
            
            // ESC per chiudere
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closePhotoViewer();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        closePhotoViewer() {
            const viewer = document.getElementById('photo-viewer');
            if (viewer) {
                viewer.classList.remove('active');
                setTimeout(() => {
                    viewer.style.display = 'none';
                }, 300);
            }
        }

        nextPage() {
            if (this.isAnimating || this.currentPage >= this.totalPages - 1) return;
            
            this.currentPage++;
            this.updatePageDisplay();
        }

        previousPage() {
            if (this.isAnimating || this.currentPage <= 0) return;
            
            this.currentPage--;
            this.updatePageDisplay();
        }

        updatePageDisplay() {
            const pages = this.albumElement.querySelectorAll('.album-page');
            pages.forEach((page, index) => {
                page.classList.toggle('active', index === this.currentPage);
            });
            
            this.updatePageIndicator();
        }

        updatePageIndicator() {
            const currentPageSpan = this.albumElement.querySelector('.current-page');
            const totalPagesSpan = this.albumElement.querySelector('.total-pages');
            
            if (currentPageSpan) currentPageSpan.textContent = this.currentPage + 1;
            if (totalPagesSpan) totalPagesSpan.textContent = this.totalPages;
        }

        getImagePath(filename) {
            return `assets/images/anita/ricordi/${filename}`;
        }

        loadMainGallery() {
            const galleryContainer = document.querySelector('.main-gallery, .photo-grid, .gallery-grid');
            if (!galleryContainer) return;
            
            console.log('🖼️ Caricamento galleria principale...');
            
            // Usa le prime 6 foto per l'anteprima
            const previewPhotos = this.photos.slice(0, 6);
            
            galleryContainer.innerHTML = '';
            const fragment = document.createDocumentFragment();
            
            previewPhotos.forEach((photo, index) => {
                const photoElement = document.createElement('div');
                photoElement.className = 'gallery-item';
                photoElement.innerHTML = `
                    <div class="gallery-photo" onclick="window.photoAlbum.openPhotoViewer('${this.getImagePath(photo.filename)}', '${photo.title}', '${photo.description}')">
                        <img src="${this.getImagePath(photo.filename)}" 
                             alt="${photo.title}" 
                             loading="lazy">
                        <div class="gallery-overlay">
                            <h3>${photo.title}</h3>
                            <p>${photo.description}</p>
                        </div>
                    </div>
                `;
                fragment.appendChild(photoElement);
            });
            
            galleryContainer.appendChild(fragment);
        }
    }

    // Inizializzazione
    document.addEventListener('DOMContentLoaded', function() {
        window.photoAlbum = new WeddingPhotoAlbum();
        window.photoAlbum.init();
        
        // Backup: assicura che openPhotobook sia disponibile
        window.openPhotobook = () => {
            if (window.photoAlbum) {
                window.photoAlbum.openAlbum();
            }
        };
    });
})();
