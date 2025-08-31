/**
 * ALBUM MATRIMONIALE ULTRA-FLUIDO E PULITO
 * Versione ottimizzata per performance e UX perfetta - NESSUN QUADRATO BIANCO
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
            console.log('📖 Inizializzando album ultra-fluido...');
            
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
                console.log(`📸 Caricate ${this.photos.length} foto randomizzate in ${this.totalPages} pagine`);
            } else {
                console.warn('⚠️ anitaPhotos non trovato, usando foto demo');
                this.loadDemoPhotos();
            }
        }

        loadDemoPhotos() {
            this.photos = Array.from({length: 20}, (_, i) => ({
                filename: `demo${i + 1}.jpg`,
                title: `Ricordo ${i + 1}`,
                description: 'Momento speciale',
                spanish: 'Te quiero',
                fallbackUrl: `https://picsum.photos/800/600?random=${i + 50}`
            }));
            this.totalPages = Math.ceil(this.photos.length / 2);
        }

        loadMainGallery() {
            const galleryElement = document.getElementById('photo-gallery');
            if (!galleryElement) return;

            galleryElement.innerHTML = '<div class="loading-gallery"><i class="fas fa-heart"></i><p>Caricando le nostre foto...</p></div>';
            
            setTimeout(() => {
                const fragment = document.createDocumentFragment();
                
                this.photos.slice(0, 12).forEach((photo, index) => {
                    const photoDiv = this.createGalleryPhotoElement(photo, index);
                    fragment.appendChild(photoDiv);
                });
                
                galleryElement.innerHTML = '';
                galleryElement.appendChild(fragment);
                this.addViewAllButton(galleryElement);
            }, 300);
        }

        createGalleryPhotoElement(photo, index) {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-item';
            photoDiv.style.animationDelay = `${index * 50}ms`;
            
            // Container ULTRA-PULITO senza sovrapposizioni
            const photoContainer = document.createElement('div');
            photoContainer.style.cssText = `
                position: relative;
                width: 100%;
                height: 100%;
                cursor: pointer;
                overflow: hidden;
                border-radius: 15px;
                background: transparent;
                border: none;
                outline: none;
                margin: 0;
                padding: 0;
            `;
            
            const img = document.createElement('img');
            img.src = `assets/images/anita/ricordi/${photo.filename}`;
            img.alt = photo.title || 'Ricordo Dolce';
            img.loading = 'lazy';
            
            // Stili ULTRA-OTTIMIZZATI senza conflitti
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0;
                transition: opacity 0.2s ease;
                display: block;
                border: none;
                outline: none;
                background: transparent;
                margin: 0;
                padding: 0;
                pointer-events: none;
            `;
            
            // Eventi di caricamento
            img.onload = () => {
                img.style.opacity = '1';
                console.log(`✅ Foto caricata: ${photo.filename}`);
            };
            
            img.onerror = () => {
                console.warn(`⚠️ Fallback per ${photo.filename}`);
                if (photo.fallbackUrl) {
                    img.src = photo.fallbackUrl;
                } else {
                    img.src = `https://picsum.photos/800/600?random=${index + 100}`;
                }
            };
            
            // HOVER EFFECT DIRETTO SUL CONTAINER
            let hoverTimeout;
            photoContainer.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                photoContainer.style.transform = 'scale(1.03)';
                photoContainer.style.transition = 'transform 0.15s ease';
            });
            
            photoContainer.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    photoContainer.style.transform = 'scale(1)';
                }, 50);
            });
            
            // CLICK UNICO E DIRETTO
            photoContainer.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.openPhotoFullscreen(img.src, photo);
            });
            
            // AGGIUNGI IMG AL CONTAINER
            photoContainer.appendChild(img);
            photoDiv.appendChild(photoContainer);
            
            return photoDiv;
        }

        // Fullscreen ultra-pulito e veloce
        openPhotoFullscreen(imageSrc, photoData) {
            // Rimuovi eventuali overlay esistenti
            const existingOverlay = document.querySelector('.photo-fullscreen-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            const overlay = document.createElement('div');
            overlay.className = 'photo-fullscreen-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.95);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.2s ease;
                cursor: pointer;
            `;
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.style.cssText = `
                max-width: 90vw;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                transition: transform 0.15s ease;
                transform: scale(0.95);
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.9);
                border: none;
                font-size: 24px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                z-index: 100000;
                transition: all 0.15s ease;
                font-weight: bold;
                color: #333;
            `;
            
            // Funzione di chiusura pulita
            const closeFullscreen = () => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.remove();
                    }
                }, 200);
            };
            
            // Eventi di chiusura
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeFullscreen();
                }
            });
            
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeFullscreen();
            });
            
            // ESC key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeFullscreen();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
            
            // Montaggio e animazione
            overlay.appendChild(img);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);
            
            // Trigger animazione
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                img.style.transform = 'scale(1)';
            });
        }

        addViewAllButton(container) {
            const buttonDiv = document.createElement('div');
            buttonDiv.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                margin-top: 20px;
            `;
            
            const button = document.createElement('button');
            button.className = 'btn-view-all';
            button.textContent = '📖 Apri l\'Album Completo';
            button.style.cssText = `
                background: linear-gradient(45deg, #8B5CF6, #EC4899);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.15s ease;
                transform: translateY(0);
            `;
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
            
            button.addEventListener('click', () => {
                this.openAlbum();
            });
            
            buttonDiv.appendChild(button);
            container.appendChild(buttonDiv);
        }

        createAlbumStructure() {
            const albumHTML = `
                <div id="wedding-album" class="wedding-album-container" style="display: none;">
                    <div class="album-backdrop"></div>
                    <div class="album-book">
                        <div class="book-cover">
                            <div class="cover-content">
                                <h2>I Nostri Ricordi</h2>
                                <p>Anita ♡ Nicola</p>
                            </div>
                        </div>
                        <div class="book-pages" id="book-pages">
                            <!-- Pagine generate dinamicamente -->
                        </div>
                        <div class="album-controls">
                            <button id="prev-page" class="album-btn" title="Pagina Precedente">‹</button>
                            <span id="page-counter">1 / 1</span>
                            <button id="next-page" class="album-btn" title="Pagina Successiva">›</button>
                        </div>
                        <button id="close-album" class="close-album-btn" title="Chiudi Album">×</button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', albumHTML);
            this.albumElement = document.getElementById('wedding-album');
            this.addAlbumStyles();
            this.bindAlbumEvents();
        }

        addAlbumStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .wedding-album-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
                
                .album-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                }
                
                .album-book {
                    position: relative;
                    width: 90vw;
                    max-width: 1200px;
                    height: 80vh;
                    background: linear-gradient(45deg, #8B4513, #A0522D);
                    border-radius: 15px;
                    padding: 40px;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                    transform: perspective(1000px) rotateY(-5deg) scale(0.9);
                    transition: all 0.25s ease;
                }
                
                .book-cover {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
                        radial-gradient(circle at 70% 70%, rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(45deg, #F7F6F0, #E8E6D8);
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform-origin: left center;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: inset 0 0 30px rgba(139, 69, 19, 0.1);
                }
                
                .cover-content {
                    text-align: center;
                    color: #8B4513;
                }
                
                .cover-content h2 {
                    font-family: 'Allura', cursive;
                    font-size: 3rem;
                    margin-bottom: 10px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                }
                
                .cover-content p {
                    font-family: 'Great Vibes', cursive;
                    font-size: 1.5rem;
                    opacity: 0.8;
                }
                
                .book-pages {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: #FFFEF7;
                    border-radius: 12px;
                    padding: 30px;
                    overflow: hidden;
                    display: none;
                }
                
                .album-page {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    display: none;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    align-items: center;
                }
                
                .album-page.active {
                    display: grid;
                }
                
                .photo-slot {
                    position: relative;
                    aspect-ratio: 4/3;
                    background: #FFFFFF;
                    border-radius: 8px;
                    padding: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    cursor: pointer;
                    transition: transform 0.1s ease;
                    overflow: hidden;
                }
                
                .photo-slot:hover {
                    transform: scale(1.02);
                }
                
                .photo-slot img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 4px;
                    border: none;
                    outline: none;
                    background: transparent;
                    pointer-events: none;
                }
                
                .album-controls {
                    position: absolute;
                    bottom: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: rgba(255,255,255,0.9);
                    padding: 10px 20px;
                    border-radius: 25px;
                    backdrop-filter: blur(10px);
                }
                
                .album-btn {
                    background: #8B4513;
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.1s ease;
                }
                
                .album-btn:hover {
                    background: #A0522D;
                    transform: scale(1.05);
                }
                
                .album-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                #page-counter {
                    font-weight: 600;
                    color: #8B4513;
                    white-space: nowrap;
                    min-width: 60px;
                    text-align: center;
                }
                
                .close-album-btn {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    background: rgba(255,255,255,0.9);
                    border: none;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.1s ease;
                    z-index: 10;
                }
                
                .close-album-btn:hover {
                    background: #ff4757;
                    color: white;
                    transform: scale(1.05);
                }
                
                /* Animazioni ultra-veloci */
                .wedding-album-container.open {
                    opacity: 1;
                }
                
                .wedding-album-container.open .album-book {
                    transform: perspective(1000px) rotateY(0deg) scale(1);
                }
                
                .wedding-album-container.open .book-cover.opened {
                    transform: rotateY(-160deg);
                }
                
                /* Responsive ottimizzato */
                @media (max-width: 768px) {
                    .album-book {
                        width: 95vw;
                        height: 85vh;
                        padding: 20px;
                    }
                    
                    .album-page {
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }
                    
                    .cover-content h2 {
                        font-size: 2rem;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }

        bindAlbumEvents() {
            const closeBtn = document.getElementById('close-album');
            const prevBtn = document.getElementById('prev-page');
            const nextBtn = document.getElementById('next-page');
            
            closeBtn.addEventListener('click', () => this.closeAlbum());
            prevBtn.addEventListener('click', () => this.previousPage());
            nextBtn.addEventListener('click', () => this.nextPage());
        }

        openAlbum() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            
            console.log('📖 Aprendo album...');
            this.generateAlbumPages();
            this.albumElement.style.display = 'flex';
            
            requestAnimationFrame(() => {
                this.albumElement.classList.add('open');
                
                setTimeout(() => {
                    const cover = this.albumElement.querySelector('.book-cover');
                    cover.classList.add('opened');
                    
                    setTimeout(() => {
                        document.getElementById('book-pages').style.display = 'block';
                        this.showPage(0);
                        this.isAnimating = false;
                        this.isOpen = true;
                    }, 300);
                }, 200);
            });
        }

        closeAlbum() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            
            this.albumElement.classList.remove('open');
            
            setTimeout(() => {
                this.albumElement.style.display = 'none';
                this.resetAlbumState();
                this.isAnimating = false;
                this.isOpen = false;
            }, 200);
        }

        resetAlbumState() {
            const cover = this.albumElement.querySelector('.book-cover');
            cover.classList.remove('opened');
            document.getElementById('book-pages').style.display = 'none';
            this.currentPage = 0;
        }

        generateAlbumPages() {
            const pagesContainer = document.getElementById('book-pages');
            pagesContainer.innerHTML = '';
            
            for (let i = 0; i < this.totalPages; i++) {
                const page = document.createElement('div');
                page.className = `album-page page-${i}`;
                
                const photo1Index = i * 2;
                const photo2Index = i * 2 + 1;
                
                if (this.photos[photo1Index]) {
                    page.appendChild(this.createPhotoSlot(this.photos[photo1Index]));
                }
                
                if (this.photos[photo2Index]) {
                    page.appendChild(this.createPhotoSlot(this.photos[photo2Index]));
                }
                
                pagesContainer.appendChild(page);
            }
            
            this.updatePageCounter();
        }

        createPhotoSlot(photo) {
            const slot = document.createElement('div');
            slot.className = 'photo-slot';
            
            const img = document.createElement('img');
            img.src = `assets/images/anita/ricordi/${photo.filename}`;
            img.alt = photo.title || 'Ricordo';
            img.loading = 'lazy';
            
            img.onerror = () => {
                if (photo.fallbackUrl) {
                    img.src = photo.fallbackUrl;
                } else {
                    img.src = `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
                }
            };
            
            // Click per fullscreen SENZA CONFLITTI
            slot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openPhotoFullscreen(img.src, photo);
            });
            
            slot.appendChild(img);
            return slot;
        }

        showPage(pageIndex) {
            document.querySelectorAll('.album-page').forEach(page => {
                page.classList.remove('active');
            });
            
            const targetPage = document.querySelector(`.page-${pageIndex}`);
            if (targetPage) {
                targetPage.classList.add('active');
                this.currentPage = pageIndex;
                this.updatePageCounter();
                this.updateNavigationButtons();
            }
        }

        nextPage() {
            if (this.currentPage < this.totalPages - 1 && !this.isAnimating) {
                this.showPage(this.currentPage + 1);
            }
        }

        previousPage() {
            if (this.currentPage > 0 && !this.isAnimating) {
                this.showPage(this.currentPage - 1);
            }
        }

        updatePageCounter() {
            const counter = document.getElementById('page-counter');
            if (counter) {
                counter.textContent = `${this.currentPage + 1} / ${this.totalPages}`;
            }
        }

        updateNavigationButtons() {
            const prevBtn = document.getElementById('prev-page');
            const nextBtn = document.getElementById('next-page');
            
            prevBtn.disabled = this.currentPage === 0;
            nextBtn.disabled = this.currentPage === this.totalPages - 1;
        }

        overrideOpenFunction() {
            window.openAlbumSlideshow = () => this.openAlbum();
        }
    }
    
    // Inizializzazione globale
    window.weddingAlbum = new WeddingPhotoAlbum();
    
    // Auto-init quando DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.weddingAlbum.init();
        });
    } else {
        window.weddingAlbum.init();
    }
})();
