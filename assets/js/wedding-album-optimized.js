/**
 * ALBUM MATRIMONIALE ULTRA-REALISTICO E SNELLO
 * Libro fotografico con texture realistiche e performance ottimizzate per Render.com
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
            console.log('📖 Inizializzando album matrimoniale realistico...');
            
            // Inizializza optimizer se disponibile
            if (typeof PhotoOptimizer !== 'undefined') {
                this.photoOptimizer = new PhotoOptimizer();
            }
            
            this.createRealisticAlbumStructure();
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
                console.warn('⚠️ Array anitaPhotos non trovato, usando fallback');
                this.photos = this.createFallbackPhotos();
            }
        }

        createFallbackPhotos() {
            const fallbackPhotos = [];
            for (let i = 1; i <= 12; i++) {
                fallbackPhotos.push({
                    filename: `demo-${i}.jpg`,
                    title: 'Momento Speciale',
                    description: 'Un ricordo indimenticabile',
                    spanish: 'Te quiero mucho',
                    fallbackUrl: `https://picsum.photos/800/600?random=${i}`
                });
            }
            return fallbackPhotos;
        }
        
        async loadMainGallery() {
            console.log('🖼️ Caricando galleria principale ottimizzata...');
            
            const galleryContainer = document.getElementById('photo-gallery');
            if (!galleryContainer) {
                setTimeout(() => this.loadMainGallery(), 300);
                return;
            }
            
            // Rimuovi loading esistente
            const loadingElement = document.getElementById('loading-gallery');
            if (loadingElement) {
                loadingElement.remove();
            }
            
            // Crea la griglia ottimizzata
            this.createOptimizedPhotoGrid(galleryContainer);
        }

        createOptimizedPhotoGrid(container) {
            container.innerHTML = '';
            
            const photosToShow = this.photos.slice(0, 12);
            console.log(`📸 Creando griglia con ${photosToShow.length} foto`);
            
            photosToShow.forEach((photo, index) => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo-item gallery-photo';
                photoDiv.setAttribute('data-filter', 'all');
                
                const photoContainer = document.createElement('div');
                photoContainer.className = 'photo-container';
                
                const img = document.createElement('img');
                
                // Usa fallback URL se disponibile, altrimenti path normale
                if (photo.fallbackUrl) {
                    img.src = photo.fallbackUrl;
                } else {
                    img.src = `./assets/images/anita/ricordi/${photo.filename}`;
                }
                
                img.alt = photo.title;
                img.loading = 'lazy';
                img.style.cssText = 'opacity: 0; transition: opacity 0.3s ease;';
                
                // Gestione caricamento immagine
                img.onload = () => {
                    img.style.opacity = '1';
                    console.log(`✅ Foto caricata: ${photo.filename}`);
                };
                
                img.onerror = () => {
                    console.warn(`⚠️ Errore caricamento ${photo.filename}, uso fallback`);
                    img.src = `https://picsum.photos/800/600?random=${index + 100}`;
                };
                
                // CLICK APRE FULLSCREEN - NESSUN POPUP
                img.addEventListener('click', () => {
                    this.openPhotoFullscreen(img.src, photo);
                });
                
                photoContainer.appendChild(img);
                photoDiv.appendChild(photoContainer);
                container.appendChild(photoDiv);
            });
            
            // Aggiungi pulsante "Vedi Tutte"
            this.addViewAllButton(container);
        }

        // Fullscreen invece di popup con descrizione
        openPhotoFullscreen(imageSrc, photoData) {
            const overlay = document.createElement('div');
            overlay.className = 'photo-fullscreen-overlay';
            overlay.innerHTML = `
                <div class="fullscreen-photo-container">
                    <img src="${imageSrc}" alt="${photoData.title}" class="fullscreen-photo">
                    <button class="close-fullscreen" aria-label="Chiudi">✕</button>
                    <div class="photo-info">
                        <h3>${photoData.title}</h3>
                        <p class="spanish-quote">${photoData.spanish}</p>
                    </div>
                </div>
            `;
            
            // Stili inline per overlay
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            // Animazione ingresso
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
            });
            
            // Chiusura overlay
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay || e.target.classList.contains('close-fullscreen')) {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        if (document.body.contains(overlay)) {
                            document.body.removeChild(overlay);
                        }
                    }, 300);
                }
            });
            
            document.body.appendChild(overlay);
        }

        addViewAllButton(container) {
            const viewAllBtn = document.createElement('div');
            viewAllBtn.className = 'view-all-photos';
            viewAllBtn.innerHTML = `
                <button class="btn-view-all" onclick="weddingAlbum.openAlbum()">
                    <i class="fas fa-book-open"></i>
                    Vedi Tutte le Foto
                </button>
            `;
            container.appendChild(viewAllBtn);
        }

        overrideOpenFunction() {
            // Override della funzione globale
            window.openPhotoBook = () => {
                this.openAlbum();
            };
        }

        createRealisticAlbumStructure() {
            this.addRealisticAlbumCSS();
            
            const albumHTML = `
                <div id="wedding-photo-album" class="wedding-album-container">
                    <div class="album-book">
                        <div class="album-cover">
                            <div class="cover-texture"></div>
                            <div class="cover-content">
                                <div class="cover-title">Anita & Nicola</div>
                                <div class="cover-subtitle">I Nostri Momenti</div>
                                <div class="cover-heart">💕</div>
                            </div>
                        </div>
                        <div class="album-pages">
                            <div class="page-container" id="album-pages-container">
                                <!-- Le pagine vengono generate dinamicamente -->
                            </div>
                        </div>
                    </div>
                    <div class="album-controls">
                        <button class="album-btn prev-page" id="prev-page">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="page-indicator" id="page-indicator">Pagina 1</span>
                        <button class="album-btn next-page" id="next-page">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <button class="close-album-btn" id="close-album-btn">✕</button>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', albumHTML);
            this.albumElement = document.getElementById('wedding-photo-album');
            this.setupAlbumEventListeners();
        }

        setupAlbumEventListeners() {
            const closeBtn = document.getElementById('close-album-btn');
            const prevBtn = document.getElementById('prev-page');
            const nextBtn = document.getElementById('next-page');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeAlbum());
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.previousPage());
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextPage());
            }
        }

        generateAlbumPages() {
            const pagesContainer = document.getElementById('album-pages-container');
            if (!pagesContainer) return;
            
            pagesContainer.innerHTML = '';
            
            // Genera le pagine con 2 foto per pagina
            for (let i = 0; i < this.totalPages; i++) {
                const pageDiv = document.createElement('div');
                pageDiv.className = `album-page ${i === 0 ? 'active' : ''}`;
                pageDiv.style.transform = `rotateY(${i === 0 ? '0deg' : '-180deg'})`;
                
                const leftPhoto = this.photos[i * 2];
                const rightPhoto = this.photos[i * 2 + 1];
                
                pageDiv.innerHTML = `
                    <div class="page-content">
                        <div class="photo-slot left-photo">
                            ${leftPhoto ? `
                                <img src="./assets/images/anita/ricordi/${leftPhoto.filename}" 
                                     alt="${leftPhoto.title}"
                                     onerror="this.src='https://picsum.photos/400/300?random=${i * 2 + 1}'">
                            ` : ''}
                        </div>
                        <div class="page-spine"></div>
                        <div class="photo-slot right-photo">
                            ${rightPhoto ? `
                                <img src="./assets/images/anita/ricordi/${rightPhoto.filename}" 
                                     alt="${rightPhoto.title}"
                                     onerror="this.src='https://picsum.photos/400/300?random=${i * 2 + 2}'">
                            ` : ''}
                        </div>
                    </div>
                `;
                
                pagesContainer.appendChild(pageDiv);
            }
        }

        openAlbum() {
            if (this.isOpen || this.isAnimating) return;
            
            console.log('📖 Aprendo album...');
            this.isAnimating = true;
            this.isOpen = true;
            
            // Genera le pagine
            this.generateAlbumPages();
            
            // Mostra l'album
            this.albumElement.classList.add('album-open');
            
            // Animazione di apertura della copertina
            setTimeout(() => {
                const cover = this.albumElement.querySelector('.album-cover');
                if (cover) {
                    cover.style.transform = 'rotateY(-180deg)';
                }
                
                setTimeout(() => {
                    this.isAnimating = false;
                    this.updatePageIndicator();
                }, 800);
            }, 300);
        }

        closeAlbum() {
            if (!this.isOpen || this.isAnimating) return;
            
            console.log('📚 Chiudendo album...');
            this.isAnimating = true;
            
            // Chiudi la copertina
            const cover = this.albumElement.querySelector('.album-cover');
            if (cover) {
                cover.style.transform = 'rotateY(0deg)';
            }
            
            // Nascondi l'album
            setTimeout(() => {
                this.albumElement.classList.remove('album-open');
                this.isOpen = false;
                this.currentPage = 0;
                this.isAnimating = false;
            }, 800);
        }

        nextPage() {
            if (this.isAnimating || this.currentPage >= this.totalPages - 1) return;
            
            this.isAnimating = true;
            this.currentPage++;
            
            this.updatePages();
            
            setTimeout(() => {
                this.isAnimating = false;
                this.updatePageIndicator();
            }, 600);
        }

        previousPage() {
            if (this.isAnimating || this.currentPage <= 0) return;
            
            this.isAnimating = true;
            this.currentPage--;
            
            this.updatePages();
            
            setTimeout(() => {
                this.isAnimating = false;
                this.updatePageIndicator();
            }, 600);
        }

        updatePages() {
            const pages = document.querySelectorAll('.album-page');
            
            pages.forEach((page, index) => {
                page.classList.remove('active');
                
                if (index <= this.currentPage) {
                    page.style.transform = 'rotateY(-180deg)';
                } else {
                    page.style.transform = 'rotateY(0deg)';
                }
                
                if (index === this.currentPage) {
                    page.classList.add('active');
                }
            });
        }

        updatePageIndicator() {
            const indicator = document.getElementById('page-indicator');
            if (indicator) {
                indicator.textContent = `Pagina ${this.currentPage + 1} di ${this.totalPages}`;
            }
        }

        addRealisticAlbumCSS() {
            if (document.getElementById('realistic-album-styles')) return;
            
            const css = `
                <style id="realistic-album-styles">
                /* ALBUM REALISTICO ULTRA-SNELLO */
                .wedding-album-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.5s ease;
                }

                .wedding-album-container.album-open {
                    opacity: 1;
                    visibility: visible;
                }

                .album-book {
                    position: relative;
                    width: 800px;
                    height: 600px;
                    max-width: 90vw;
                    max-height: 80vh;
                    perspective: 2000px;
                    transform-style: preserve-3d;
                }

                .album-cover {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #8B4513, #A0522D);
                    border-radius: 10px;
                    box-shadow: 
                        0 20px 60px rgba(0,0,0,0.4),
                        inset 0 2px 10px rgba(255,255,255,0.1);
                    transform-origin: left center;
                    transform-style: preserve-3d;
                    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    z-index: 10;
                }

                .cover-texture {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
                        radial-gradient(circle at 70% 80%, rgba(0,0,0,0.1) 1px, transparent 1px);
                    background-size: 50px 50px, 30px 30px;
                    border-radius: 10px;
                }

                .cover-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    color: #FFD700;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                }

                .cover-title {
                    font-family: 'Great Vibes', cursive;
                    font-size: 3rem;
                    margin-bottom: 10px;
                    font-weight: 400;
                }

                .cover-subtitle {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    font-style: italic;
                    margin-bottom: 20px;
                }

                .cover-heart {
                    font-size: 2rem;
                    animation: heartbeat 2s infinite;
                }

                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .album-pages {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #FFFEF7;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }

                .page-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                }

                .album-page {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #FFFEF7;
                    border-radius: 10px;
                    transform-origin: left center;
                    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    box-shadow: 
                        inset 0 0 20px rgba(139,69,19,0.1),
                        2px 0 5px rgba(0,0,0,0.1);
                }

                .page-content {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    padding: 30px;
                    box-sizing: border-box;
                }

                .photo-slot {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px;
                    background: #FFFFFF;
                    margin: 10px;
                    border-radius: 8px;
                    box-shadow: 
                        0 2px 10px rgba(0,0,0,0.1),
                        inset 0 0 1px rgba(139,69,19,0.2);
                }

                .photo-slot img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: cover;
                    border-radius: 4px;
                    transition: transform 0.3s ease;
                }

                .photo-slot img:hover {
                    transform: scale(1.02);
                }

                .page-spine {
                    width: 2px;
                    background: linear-gradient(to bottom, #8B4513, #A0522D);
                    margin: 20px 0;
                    border-radius: 1px;
                }

                .album-controls {
                    position: absolute;
                    bottom: -80px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    background: rgba(255,255,255,0.9);
                    padding: 10px 20px;
                    border-radius: 25px;
                    backdrop-filter: blur(10px);
                }

                .album-btn {
                    background: #8B4513;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .album-btn:hover {
                    background: #A0522D;
                    transform: scale(1.1);
                }

                .album-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .page-indicator {
                    font-family: 'Playfair Display', serif;
                    font-size: 0.9rem;
                    color: #333;
                    white-space: nowrap;
                }

                .close-album-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(255,255,255,0.9);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 20;
                }

                .close-album-btn:hover {
                    background: #ff4757;
                    color: white;
                    transform: scale(1.1);
                }

                /* FULLSCREEN PHOTO OVERLAY */
                .photo-fullscreen-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }

                .fullscreen-photo-container {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .fullscreen-photo {
                    max-width: 100%;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 10px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                }

                .close-fullscreen {
                    position: absolute;
                    top: -50px;
                    right: -20px;
                    background: rgba(255,255,255,0.9);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .close-fullscreen:hover {
                    background: #ff4757;
                    color: white;
                    transform: scale(1.1);
                }

                .photo-info {
                    text-align: center;
                    color: white;
                    margin-top: 20px;
                }

                .photo-info h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                }

                .spanish-quote {
                    font-family: 'Great Vibes', cursive;
                    font-size: 1.2rem;
                    color: #FFD700;
                    font-style: italic;
                }

                /* GALLERIA OTTIMIZZATA */
                .gallery-photo {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                    border-radius: 10px;
                    overflow: hidden;
                }

                .gallery-photo:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }

                .gallery-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .gallery-photo:hover img {
                    transform: scale(1.05);
                }

                .view-all-photos {
                    grid-column: 1 / -1;
                    display: flex;
                    justify-content: center;
                    margin-top: 30px;
                }

                .btn-view-all {
                    background: linear-gradient(45deg, #8B4513, #A0522D);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: 'Playfair Display', serif;
                }

                .btn-view-all:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(139,69,19,0.3);
                }

                /* RESPONSIVE */
                @media (max-width: 768px) {
                    .album-book {
                        width: 95vw;
                        height: 70vh;
                    }

                    .cover-title {
                        font-size: 2rem;
                    }

                    .page-content {
                        flex-direction: column;
                        padding: 20px;
                    }

                    .page-spine {
                        width: 100%;
                        height: 2px;
                        margin: 10px 0;
                    }

                    .album-controls {
                        bottom: -60px;
                        padding: 8px 15px;
                    }
                }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', css);
        }
    }

    // Inizializzazione globale
    window.weddingAlbum = new WeddingPhotoAlbum();
    
    // Inizializza quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.weddingAlbum.init();
        });
    } else {
        window.weddingAlbum.init();
    }

})();
