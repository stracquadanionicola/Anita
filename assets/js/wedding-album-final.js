/**
 * ALBUM MATRIMONIALE FINALE - Con Polaroid Viewer e Funzioni Complete
 * Versione definitiva per Anita e Nicola
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
            console.log('📖 Inizializzando album matrimoniale finale...');
            
            // Inizializza optimizer se disponibile
            if (typeof PhotoOptimizer !== 'undefined') {
                this.photoOptimizer = new PhotoOptimizer();
            }
            
            this.createAlbumStructure();
            this.loadPhotos();
            this.setupEventListeners();
            
            // Carica galleria principale
            this.loadMainGallery();
            
            console.log('✅ Album inizializzato con successo!');
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

        setupEventListeners() {
            // ESC key per chiudere
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (this.isOpen) {
                        this.closeAlbum();
                    }
                    const viewer = document.getElementById('photo-viewer');
                    if (viewer && viewer.style.display !== 'none') {
                        this.closePhotoViewer();
                    }
                }
            });
            
            // Override della funzione globale openPhotobook
            window.openPhotobook = () => {
                console.log('🚀 Funzione openPhotobook chiamata');
                this.openAlbum();
            };
            
            // Assicura che TUTTI i pulsanti funzionino
            document.addEventListener('click', (e) => {
                const target = e.target.closest('.hero-btn, .cta-button, [onclick*="openPhotobook"]');
                if (target) {
                    e.preventDefault();
                    console.log('🎯 Click su pulsante rilevato:', target);
                    this.openAlbum();
                }
            });
            
            // Backup: controlla ogni secondo se ci sono pulsanti senza handler
            setInterval(() => {
                const buttons = document.querySelectorAll('.hero-btn, .cta-button');
                buttons.forEach(btn => {
                    if (!btn.dataset.handlerSet) {
                        btn.onclick = (e) => {
                            e.preventDefault();
                            console.log('🔧 Handler backup attivato');
                            this.openAlbum();
                        };
                        btn.dataset.handlerSet = 'true';
                    }
                });
            }, 1000);
        }

        openAlbum() {
            if (this.isAnimating) {
                console.log('⏳ Animazione in corso, aspetto...');
                return;
            }
            
            console.log('📖 APERTURA ALBUM - START');
            this.isAnimating = true;
            this.isOpen = true;
            
            // Genera le pagine
            this.generatePages();
            
            // Mostra l'album
            this.albumElement.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Animazione di apertura
            requestAnimationFrame(() => {
                this.albumElement.classList.add('active');
                setTimeout(() => {
                    this.isAnimating = false;
                    console.log('✅ Album aperto con successo!');
                }, 300);
            });
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
                console.log('✅ Album chiuso');
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
                <div class="photo-frame ${side}" onclick="window.photoAlbum.openPolaroidViewer('${imagePath}', '${this.escapeHtml(photo.title || '')}', '${this.escapeHtml(photo.description || '')}')">
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

        openPolaroidViewer(imagePath, title, description) {
            console.log('📸 Apertura Polaroid Viewer:', title);
            
            // Crea il viewer se non esiste
            let viewer = document.getElementById('photo-viewer');
            if (!viewer) {
                viewer = document.createElement('div');
                viewer.id = 'photo-viewer';
                viewer.className = 'photo-viewer-overlay';
                document.body.appendChild(viewer);
            }
            
            const downloadName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_AnitaNicola.jpg`;
            
            viewer.innerHTML = `
                <div class="photo-viewer-container">
                    <button class="photo-viewer-close" onclick="window.photoAlbum.closePhotoViewer()">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="photo-viewer-content">
                        <img src="${imagePath}" alt="${title}" class="photo-viewer-image" id="current-photo">
                        <div class="photo-viewer-info">
                            <h2 class="photo-viewer-title">${title || 'Momento Speciale'}</h2>
                            <p class="photo-viewer-description">${description || 'Un ricordo indimenticabile del nostro matrimonio'}</p>
                        </div>
                        <div class="photo-viewer-actions">
                            <button class="photo-action-btn" onclick="window.photoAlbum.downloadPhoto('${imagePath}', '${downloadName}')">
                                <i class="fas fa-download"></i>
                                Scarica
                            </button>
                            <button class="photo-action-btn" onclick="window.photoAlbum.sharePhoto('${imagePath}', '${title}')">
                                <i class="fas fa-share-alt"></i>
                                Condividi
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            viewer.style.display = 'flex';
            requestAnimationFrame(() => {
                viewer.classList.add('active');
            });
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

        downloadPhoto(imagePath, filename) {
            console.log('💾 Download foto:', filename);
            
            const link = document.createElement('a');
            link.href = imagePath;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Feedback visivo
            this.showNotification('📥 Foto scaricata!');
        }

        async sharePhoto(imagePath, title) {
            console.log('🔗 Condivisione foto:', title);
            
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `${title} - Album Anita e Nicola`,
                        text: `Guarda questa bellissima foto del matrimonio di Anita e Nicola!`,
                        url: window.location.href
                    });
                } catch (error) {
                    console.log('Condivisione annullata');
                }
            } else {
                // Fallback: copia URL negli appunti
                const shareUrl = `${window.location.href}#foto-${encodeURIComponent(title)}`;
                navigator.clipboard.writeText(shareUrl).then(() => {
                    this.showNotification('🔗 Link copiato negli appunti!');
                }).catch(() => {
                    this.showNotification('❌ Impossibile copiare il link');
                });
            }
        }

        showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(139, 69, 19, 0.95);
                color: white;
                padding: 15px 20px;
                border-radius: 25px;
                font-family: 'Playfair Display', serif;
                font-size: 1rem;
                z-index: 99999999;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
            });
            
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
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

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
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
                    <div class="gallery-photo" onclick="window.photoAlbum.openPolaroidViewer('${this.getImagePath(photo.filename)}', '${this.escapeHtml(photo.title)}', '${this.escapeHtml(photo.description)}')">
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
        console.log('🚀 DOM caricato, inizializzazione album...');
        
        window.photoAlbum = new WeddingPhotoAlbum();
        window.photoAlbum.init();
        
        // Assicura che openPhotobook sia sempre disponibile
        window.openPhotobook = () => {
            console.log('🔄 openPhotobook chiamata (global)');
            if (window.photoAlbum) {
                window.photoAlbum.openAlbum();
            } else {
                console.error('❌ photoAlbum non inizializzato');
            }
        };
        
        console.log('✅ Inizializzazione completata');
    });
})();
