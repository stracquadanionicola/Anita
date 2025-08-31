/**
 * ALBUM MATRIMONIALE ULTRA-REALISTICO E SNELLO
 * Libro fotografico con texture realistiche e performance ottimizzate
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
            this.photoOptimizer = new PhotoOptimizer();
            this.loadedImages = new Map();
        }

        init() {
            console.log('📖 Inizializzando album matrimoniale realistico...');
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
        
        async loadMainGallery() {
            console.log('�️ Caricando galleria principale ottimizzata...');
            
            const galleryContainer = document.getElementById('photo-gallery');
            if (!galleryContainer) {
                setTimeout(() => this.loadMainGallery(), 300);
                return;
            }
            
            // Mostra loading
            galleryContainer.innerHTML = '<div class="gallery-loading">Caricamento foto...</div>';
            
            try {
                // Precarica le prime 12 foto ottimizzate
                const results = await this.photoOptimizer.preloadGalleryImages(this.photos, 12);
                
                // Crea la griglia delle foto
                this.createPhotoGrid(galleryContainer, results);
                
            } catch (error) {
                console.error('Errore caricamento galleria:', error);
                this.createFallbackGallery(galleryContainer);
            }
        }

        createPhotoGrid(container, imageResults) {
            container.innerHTML = '';
            
            imageResults.forEach((result, index) => {
                if (result.status === 'fulfilled' && this.photos[index]) {
                    const photoDiv = document.createElement('div');
                    photoDiv.className = 'gallery-photo';
                    
                    const img = document.createElement('img');
                    img.src = result.value;
                    img.alt = this.photos[index].title;
                    img.loading = 'lazy';
                    
                    // RIMUOVO IL POPUP - Click apre direttamente la foto fullscreen
                    img.addEventListener('click', () => {
                        this.openPhotoFullscreen(result.value, this.photos[index]);
                    });
                    
                    photoDiv.appendChild(img);
                    container.appendChild(photoDiv);
                }
            });
            
            // Aggiungi il pulsante "Vedi Tutte"
            this.addViewAllButton(container);
        }

        // Apre la foto in fullscreen invece del popup con descrizione
        openPhotoFullscreen(imageSrc, photoData) {
            const overlay = document.createElement('div');
            overlay.className = 'photo-fullscreen-overlay';
            overlay.innerHTML = `
                <div class="fullscreen-photo-container">
                    <img src="${imageSrc}" alt="${photoData.title}" class="fullscreen-photo">
                    <button class="close-fullscreen">✕</button>
                    <div class="photo-info">
                        <h3>${photoData.title}</h3>
                        <p class="spanish-quote">${photoData.spanish}</p>
                    </div>
                </div>
            `;
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay || e.target.classList.contains('close-fullscreen')) {
                    document.body.removeChild(overlay);
                }
            });
            
            document.body.appendChild(overlay);
        }
            if (loadingGallery) {
                loadingGallery.remove();
                console.log('✅ Loading rimosso');
            }
            
            // Crea griglia foto
            const photosToShow = this.photos.slice(0, 12); // Mostra prime 12 foto
            console.log('📸 Creando', photosToShow.length, 'elementi foto');
            
            photosToShow.forEach((photo, index) => {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item';
                photoItem.setAttribute('data-filter', 'all');
                
                // Debug: verifica che la foto esista
                console.log(`Foto ${index + 1}:`, photo.filename);
                
                photoItem.innerHTML = `
                    <div class="photo-container">
                        <img src="./assets/images/anita/ricordi/${photo.filename}" 
                             alt="${photo.title}"
                             loading="lazy"
                             onload="console.log('✅ Foto caricata: ${photo.filename}'); this.style.opacity='1';"
                             onerror="console.error('❌ Errore caricamento: ${photo.filename}'); this.parentElement.parentElement.style.display='none';"
                             style="opacity: 0; transition: opacity 0.3s ease;"
                        />
                        <div class="photo-overlay">
                            <div class="photo-info">
                                <h4>${photo.title}</h4>
                                <p>${photo.description}</p>
                                <div class="photo-spanish">${photo.spanish}</div>
                            </div>
                            <div class="photo-actions">
                                <button class="photo-btn" onclick="openPhotoModal('${photo.filename}', '${photo.title}', '${photo.description}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="photo-btn" onclick="weddingAlbum.openAlbumAtPhoto(${index})">
                                    <i class="fas fa-book-open"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                galleryContainer.appendChild(photoItem);
            });
            
            // Aggiungi pulsante "Vedi tutte"
            const viewAllBtn = document.createElement('div');
            viewAllBtn.className = 'photo-item view-all-item';
            viewAllBtn.innerHTML = `
                <div class="view-all-container" onclick="console.log('🔘 Click Vedi Tutte'); weddingAlbum.openAlbum();">
                    <i class="fas fa-book-open"></i>
                    <h3>Vedi Tutte</h3>
                    <p>${this.photos.length} foto</p>
                    <div class="spanish-text">Ver todas las fotos</div>
                </div>
            `;
            galleryContainer.appendChild(viewAllBtn);
            
            console.log('✅ Galleria principale caricata con', photosToShow.length, 'foto');
        }

        overrideOpenFunction() {
            window.openSpectacularPresentation = () => {
                this.openAlbum();
            };
            console.log('✅ Funzione openSpectacularPresentation configurata');
        }

        createAlbumStructure() {
            const albumHTML = `
                <div id="wedding-album-overlay" class="wedding-album-overlay" style="display: none;">
                    
                    <div class="wedding-album-container">
                        <!-- SOLO COPERTINA (separata dalle pagine) -->
                        <div class="album-cover-only" id="album-cover-only">
                            <div class="cover-front">
                                <div class="cover-decoration">
                                    <div class="cover-title">
                                        <h1>Te Quiero</h1>
                                        <div class="cover-subtitle">Anita & Nicola</div>
                                        <div class="cover-date">30 Agosto 2025</div>
                                    </div>
                                    <div class="cover-ornament">
                                        <i class="fas fa-heart"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- SOLO CONTENUTO ALBUM (separato dalla copertina) -->
                        <div class="wedding-album-book" id="wedding-album-book" style="display: none;">
                            <div class="album-pages-container" id="album-pages-container">
                                <!-- Le pagine verranno generate dinamicamente -->
                            </div>
                        </div>
                        
                        <!-- Controlli -->
                        <div class="album-navigation">
                            <button class="nav-btn" id="prev-page-btn" onclick="weddingAlbum.previousPage()">
                                <i class="fas fa-chevron-left"></i>
                                <span>Precedente</span>
                            </button>
                            
                            <div class="page-indicator" id="page-indicator">
                                Pagina 1 di 1
                            </div>
                            
                            <button class="nav-btn" id="next-page-btn" onclick="weddingAlbum.nextPage()">
                                <span>Successiva</span>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', albumHTML);
            this.albumElement = document.getElementById('wedding-album-overlay');
            this.addWeddingAlbumCSS();
            this.createNewCloseButton();
        }

        createNewCloseButton() {
            console.log('🔧 Creando nuovo tasto X funzionante...');
            
            // Crea il nuovo tasto X
            const closeButton = document.createElement('button');
            closeButton.id = 'new-close-btn';
            closeButton.innerHTML = '✕';
            closeButton.title = 'Chiudi Album';
            
            // Stile diretto nel JavaScript per garantire funzionamento
            closeButton.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                z-index: 999999 !important;
                background: rgba(139, 69, 19, 0.95) !important;
                color: white !important;
                border: none !important;
                border-radius: 50% !important;
                width: 55px !important;
                height: 55px !important;
                font-size: 1.5rem !important;
                font-weight: bold !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                pointer-events: auto !important;
                user-select: none !important;
                transition: all 0.1s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
                border: 2px solid rgba(218, 165, 32, 0.3) !important;
            `;
            
            // Event listener diretto e semplice
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔘 NUOVO TASTO X CLICCATO - Chiudendo album');
                this.closeAlbum();
            });
            
            // Hover effect
            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.background = 'rgba(139, 69, 19, 1)';
                closeButton.style.transform = 'scale(1.1)';
            });
            
            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.background = 'rgba(139, 69, 19, 0.95)';
                closeButton.style.transform = 'scale(1)';
            });
            
            // Aggiungi al DOM
            document.body.appendChild(closeButton);
            
            // Nascondi inizialmente
            closeButton.style.display = 'none';
            
            // Salva riferimento
            this.newCloseButton = closeButton;
            
            console.log('✅ Nuovo tasto X creato e configurato');
        }

        addWeddingAlbumCSS() {
            const style = document.createElement('style');
            style.textContent = `
                .wedding-album-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 10000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                
                .wedding-album-overlay.active {
                    opacity: 1;
                }
                
                .wedding-album-container {
                    position: relative;
                    width: 90%;
                    max-width: 1000px;
                    height: 90%;
                    perspective: 1000px;
                }
                
                .wedding-album-book {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.8s ease;
                }
                
                .wedding-album-book.opening {
                    transform: rotateY(-5deg) rotateX(2deg);
                }
                
                /* COPERTINA SEPARATA - ALBUM MATRIMONIALE REALISTICO */
                .album-cover-only {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    /* Copertina in vera pelle avorio con texture */
                    background: 
                        radial-gradient(circle at 30% 20%, rgba(255,248,240,0.8) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(245,239,231,0.6) 0%, transparent 40%),
                        linear-gradient(145deg, 
                            #F5F5DC 0%,    /* Beige chiaro */
                            #F0E68C 15%,   /* Khaki */
                            #DDD8B8 35%,   /* Beige medio */
                            #D2B48C 50%,   /* Tan */
                            #DDD8B8 65%,   /* Beige medio */
                            #F0E68C 85%,   /* Khaki */
                            #F5F5DC 100%   /* Beige chiaro */
                        );
                    /* Bordo libro realistico con dorso */
                    border: 6px solid #8B7355;
                    border-left: 15px solid #8B7355;
                    border-radius: 8px 15px 15px 8px;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    box-shadow: 
                        /* Ombra principale */
                        0 20px 60px rgba(0,0,0,0.4),
                        /* Ombra dorso libro */
                        -8px 0 25px rgba(0,0,0,0.3),
                        /* Riflessi interni */
                        inset 0 3px 10px rgba(255,255,255,0.3),
                        inset 0 -2px 8px rgba(139,115,85,0.2),
                        /* Effetto cuciture dorso */
                        inset -12px 0 15px rgba(139,115,85,0.4);
                    z-index: 10;
                    transform: perspective(1500px) rotateX(2deg) rotateY(-3deg);
                    /* Texture pelle premium con grana fine */
                    background-image: 
                        /* Grana pelle fine */
                        radial-gradient(circle at 25% 25%, rgba(139,115,85,0.1) 1px, transparent 1px),
                        radial-gradient(circle at 75% 75%, rgba(160,142,101,0.08) 1px, transparent 1px),
                        radial-gradient(circle at 50% 50%, rgba(245,245,220,0.05) 1px, transparent 1px),
                        /* Pattern a rombi sottile */
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 20px,
                            rgba(139,115,85,0.03) 20px,
                            rgba(139,115,85,0.03) 22px
                        ),
                        repeating-linear-gradient(
                            -45deg,
                            transparent,
                            transparent 20px,
                            rgba(139,115,85,0.03) 20px,
                            rgba(139,115,85,0.03) 22px
                        );
                    background-size: 15px 15px, 25px 25px, 35px 35px, 40px 40px, 40px 40px;
                }
                
                /* Cornice dorata elegante con motivi floreali */
                .album-cover-only::before {
                    content: '';
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    right: 20px;
                    bottom: 20px;
                    border: 3px solid;
                    border-image: linear-gradient(45deg, 
                        #DAA520 0%,    /* Oro classico */
                        #FFD700 25%,   /* Oro brillante */
                        #B8860B 50%,   /* Oro scuro */
                        #FFD700 75%,   /* Oro brillante */
                        #DAA520 100%   /* Oro classico */
                    ) 1;
                    border-radius: 12px;
                    pointer-events: none;
                    box-shadow: 
                        /* Effetto rilievo cornice */
                        inset 0 0 15px rgba(218, 165, 32, 0.3),
                        inset 0 2px 5px rgba(255,255,255,0.4),
                        inset 0 -2px 5px rgba(139,115,85,0.3),
                        /* Bagliore esterno */
                        0 0 8px rgba(218, 165, 32, 0.2);
                    /* Pattern decorativo angoli */
                    background-image: 
                        /* Motivi angolari */
                        radial-gradient(circle at 0% 0%, rgba(218,165,32,0.3) 8px, transparent 8px),
                        radial-gradient(circle at 100% 0%, rgba(218,165,32,0.3) 8px, transparent 8px),
                        radial-gradient(circle at 0% 100%, rgba(218,165,32,0.3) 8px, transparent 8px),
                        radial-gradient(circle at 100% 100%, rgba(218,165,32,0.3) 8px, transparent 8px);
                    background-size: 16px 16px;
                    background-repeat: no-repeat;
                    background-position: 0 0, 100% 0, 0 100%, 100% 100%;
                }
                
                /* Elementi decorativi sui bordi laterali */
                .album-cover-only::after {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 15%;
                    bottom: 15%;
                    width: 8px;
                    background: linear-gradient(180deg, 
                        rgba(218, 165, 32, 0.9) 0%,
                        rgba(255, 215, 0, 1) 30%,
                        rgba(184, 134, 11, 0.9) 50%,
                        rgba(255, 215, 0, 1) 70%,
                        rgba(218, 165, 32, 0.9) 100%);
                    border-radius: 4px 0 0 4px;
                    box-shadow: 
                        /* Ombra dorso */
                        inset 0 0 3px rgba(255,255,255,0.4),
                        inset 1px 0 2px rgba(255,215,0,0.6),
                        2px 0 8px rgba(0,0,0,0.4),
                        /* Decorazioni dorate */
                        inset 0 2px 1px rgba(255,255,255,0.3),
                        inset 0 -2px 1px rgba(139,115,85,0.3);
                    pointer-events: none;
                    /* Texture metallica */
                    background-image: 
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 1px,
                            rgba(255,255,255,0.2) 1px,
                            rgba(255,255,255,0.2) 2px
                        );
                }
                
                .album-cover-only:hover {
                    transform: perspective(1500px) rotateX(1deg) rotateY(-2deg) scale(1.03);
                    box-shadow: 
                        /* Ombra principale più intensa */
                        0 30px 80px rgba(0,0,0,0.5),
                        /* Ombra dorso più profonda */
                        -12px 0 30px rgba(0,0,0,0.4),
                        /* Riflessi interni più brillanti */
                        inset 0 4px 12px rgba(255,255,255,0.4),
                        inset 0 -3px 10px rgba(139,115,85,0.3),
                        /* Bagliore dorato */
                        inset 0 0 20px rgba(218,165,32,0.1),
                        /* Effetto cuciture dorso più evidente */
                        inset -12px 0 20px rgba(139,115,85,0.5);
                    /* Leggero bagliore esterno */
                    filter: drop-shadow(0 0 10px rgba(218,165,32,0.1));
                }
                
                .album-cover-only.hidden {
                    opacity: 0;
                    transform: translateX(-100%) rotateY(-90deg);
                    pointer-events: none;
                }
                
                /* LIBRO FOTOGRAFICO REALISTICO */
                .wedding-album-book {
                    position: relative;
                    width: 95%;
                    height: 90%;
                    margin: auto;
                    background: linear-gradient(135deg, #654321 0%, #8B4513 50%, #A0522D 100%);
                    border-radius: 20px;
                    box-shadow: 
                        0 25px 80px rgba(0,0,0,0.4),
                        inset 0 2px 5px rgba(255,255,255,0.1),
                        inset 0 -2px 5px rgba(0,0,0,0.2);
                    transform-style: preserve-3d;
                    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    /* Texture pelle libro */
                    background-image: 
                        radial-gradient(circle at 25% 25%, rgba(160, 82, 45, 0.3) 2px, transparent 2px),
                        radial-gradient(circle at 75% 75%, rgba(101, 67, 33, 0.2) 1px, transparent 1px);
                    background-size: 30px 30px, 50px 50px;
                    /* Bordo metallico */
                    border: 3px solid rgba(184, 134, 11, 0.3);
                }
                
                .wedding-album-book.opening {
                    transform: rotateY(-4deg) rotateX(3deg) scale(1.08);
                    box-shadow: 
                        0 35px 100px rgba(0,0,0,0.5),
                        inset 0 3px 8px rgba(255,255,255,0.15),
                        inset 0 -3px 8px rgba(0,0,0,0.25);
                }
                
                /* Vecchi stili copertina (da rimuovere) */
                .album-cover {
                    display: none !important;
                }
                
                .cover-front {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    transform: rotateY(0deg);
                }
                
                .cover-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    transform: rotateY(180deg);
                    background: #F5F5DC;
                    border-radius: 0 15px 15px 0;
                }
                
                .cover-decoration {
                    padding: 60px 40px;
                    text-align: center;
                    color: #fff;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background: linear-gradient(45deg, rgba(255,215,0,0.1), rgba(255,255,255,0.1));
                    backface-visibility: hidden;
                    transform: rotateY(0deg);
                }
                
                .cover-title h1 {
                    font-family: 'Allura', cursive;
                    font-size: 4rem;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                
                .cover-subtitle {
                    font-size: 1.8rem;
                    margin-bottom: 10px;
                    font-family: 'Great Vibes', cursive;
                }
                
                .cover-date {
                    font-size: 1.2rem;
                    opacity: 0.9;
                }
                
                .cover-ornament {
                    margin-top: 40px;
                    font-size: 3rem;
                    color: #FFD700;
                    animation: heartGlow 2s ease-in-out infinite;
                }
                
                @keyframes heartGlow {
                    0%, 100% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                
                .album-pages-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #F8F5F0 0%, #FFFBF5 50%, #F5F2E8 100%);
                    border-radius: 18px;
                    box-shadow: 
                        inset 0 0 80px rgba(139, 69, 19, 0.08),
                        inset 0 2px 10px rgba(0,0,0,0.1),
                        0 0 40px rgba(0,0,0,0.2);
                    overflow: hidden;
                    /* Effetto libro aperto - dorso centrale più realistico */
                    background-image: 
                        linear-gradient(90deg, transparent 48%, rgba(139, 69, 19, 0.1) 49%, rgba(101, 67, 33, 0.2) 50%, rgba(139, 69, 19, 0.1) 51%, transparent 52%),
                        /* Texture carta antica */
                        radial-gradient(circle at 30% 30%, rgba(160, 82, 45, 0.03) 1px, transparent 1px),
                        radial-gradient(circle at 70% 70%, rgba(139, 69, 19, 0.02) 1px, transparent 1px);
                    background-size: 100% 100%, 40px 40px, 60px 60px;
                    /* Bordo interno dorato */
                    border: 2px solid rgba(218, 165, 32, 0.2);
                }
                
                .album-page {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    /* Carta fotografica avorio premium */
                    background: linear-gradient(145deg, 
                        #FFFEF9 0%,    /* Avorio chiaro */
                        #FFF8F0 25%,   /* Crema */
                        #F5F5DC 50%,   /* Beige */
                        #FFF8F0 75%,   /* Crema */
                        #FFFEF9 100%   /* Avorio chiaro */
                    );
                    transform-origin: left center;
                    transition: all 0.12s cubic-bezier(0.4, 0.0, 0.2, 1);
                    transform-style: preserve-3d;
                    border-radius: 12px;
                    box-shadow: 
                        /* Ombra pagina principale */
                        3px 0 15px rgba(139, 115, 85, 0.2),
                        /* Ombra rilegatura */
                        inset -2px 0 8px rgba(139, 115, 85, 0.1),
                        /* Riflesso carta */
                        inset 0 1px 3px rgba(255,255,255,0.4),
                        /* Ombra sottile bordo */
                        inset 0 -1px 2px rgba(139, 115, 85, 0.1);
                    backface-visibility: hidden;
                    /* Texture carta fotografica di alta qualità */
                    background-image: 
                        /* Grana carta sottile */
                        radial-gradient(circle at 20% 30%, rgba(245,245,220,0.4) 0.5px, transparent 0.5px),
                        radial-gradient(circle at 80% 70%, rgba(139,115,85,0.02) 0.5px, transparent 0.5px),
                        radial-gradient(circle at 40% 60%, rgba(255,248,240,0.3) 0.5px, transparent 0.5px),
                        /* Pattern carta premium */
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 1px,
                            rgba(245,245,220,0.1) 1px,
                            rgba(245,245,220,0.1) 2px
                        ),
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 1px,
                            rgba(139,115,85,0.03) 1px,
                            rgba(139,115,85,0.03) 2px
                        );
                    background-size: 8px 8px, 12px 12px, 15px 15px, 20px 20px, 25px 25px;
                    /* Bordo pagina delicato */
                    border: 1px solid rgba(139, 115, 85, 0.1);
                }
                
                .album-page.turned {
                    transform: rotateY(-180deg);
                    box-shadow: 
                        -3px 0 25px rgba(139, 69, 19, 0.4),
                        inset 3px 0 15px rgba(139, 69, 19, 0.1);
                }
                
                /* Prima pagina speciale */
                .album-page[data-page="0"] {
                    background: linear-gradient(135deg, #FFFEF7 0%, #F5F5DC 100%);
                    border: 1px solid rgba(139, 69, 19, 0.1);
                }
                
                .album-page:not([data-page="0"]) {
                    background: linear-gradient(135deg, #FEFEFE 0%, #FFF8DC 100%);
                }
                
                .page-content {
                    padding: 30px;
                    height: 100%;
                    display: flex;
                    gap: 15px;
                    /* Effetto libro aperto - margine centrale */
                    background-image: 
                        linear-gradient(90deg, transparent 49.5%, rgba(139, 69, 19, 0.1) 50%, transparent 50.5%);
                }
                
                .page-left, .page-right {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    text-align: center;
                    padding: 20px 15px;
                    /* Effetto pagina incurvata */
                    background: linear-gradient(
                        to right, 
                        rgba(255, 255, 255, 0.9) 0%, 
                        rgba(255, 255, 255, 1) 50%, 
                        rgba(255, 255, 255, 0.9) 100%
                    );
                    border-radius: 8px;
                }
                
                .page-photo {
                    width: 100%;
                    max-width: 100%;
                    height: 92%;
                    max-height: 92%;
                    object-fit: cover;
                    border-radius: 8px;
                    /* Effetto foto reale incollata su album */
                    box-shadow: 
                        0 6px 20px rgba(0,0,0,0.3),
                        0 12px 40px rgba(0,0,0,0.2),
                        inset 0 2px 4px rgba(255,255,255,0.4),
                        inset 0 -2px 3px rgba(0,0,0,0.1);
                    margin-bottom: 8px;
                    /* Cornice foto vintage premium */
                    border: 3px solid #FEFEFE;
                    transition: all 0.15s cubic-bezier(0.4, 0.0, 0.2, 1);
                    /* Texture foto leggermente ruvida */
                    filter: contrast(1.05) saturate(1.1);
                    position: relative;
                }
                
                .page-photo::before {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    right: -4px;
                    bottom: -4px;
                    background: linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, transparent 30%, transparent 70%, rgba(139, 69, 19, 0.05) 100%);
                    border-radius: 6px;
                    z-index: -1;
                    /* Ombra colla sotto la foto */
                    box-shadow: 0 0 8px rgba(139, 69, 19, 0.2);
                }
                
                .page-photo:hover {
                    transform: scale(1.03) rotateZ(0.5deg);
                    box-shadow: 
                        0 6px 20px rgba(0,0,0,0.35),
                        0 12px 40px rgba(0,0,0,0.2),
                        inset 0 1px 3px rgba(255,255,255,0.5),
                        inset 0 -1px 2px rgba(0,0,0,0.15);
                    filter: contrast(1.08) saturate(1.15) brightness(1.02);
                }
                
                .page-text {
                    color: #333;
                    flex-shrink: 0;
                    max-height: 25%;
                    overflow: hidden;
                }
                
                .page-title {
                    font-size: 1.3rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #8B4513;
                }
                
                .page-description {
                    font-size: 1rem;
                    margin-bottom: 10px;
                    color: #666;
                }
                
                .page-spanish {
                    font-size: 1.1rem;
                    font-style: italic;
                    color: #D2691E;
                    font-family: 'Great Vibes', cursive;
                }
                
                /* Stile per pagine vuote */
                .empty-page {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #999;
                    font-style: italic;
                    font-size: 1.1rem;
                }
                
                .album-navigation {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    background: linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(101, 67, 33, 0.9));
                    padding: 18px 35px;
                    border-radius: 60px;
                    backdrop-filter: blur(15px);
                    box-shadow: 
                        0 8px 30px rgba(0,0,0,0.4),
                        inset 0 1px 3px rgba(255,255,255,0.2),
                        inset 0 -1px 2px rgba(0,0,0,0.2);
                    border: 1px solid rgba(218, 165, 32, 0.3);
                }
                
                .nav-btn {
                    background: transparent;
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    padding: 12px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.08s cubic-bezier(0.4, 0.0, 0.2, 1);
                    font-size: 0.9rem;
                }
                
                .nav-btn:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(255,255,255,0.6);
                    transform: translateY(-2px);
                }
                
                .nav-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .page-indicator {
                    color: white;
                    font-size: 1rem;
                    font-weight: 500;
                }
                
                .album-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .album-close:hover {
                    background: rgba(255,0,0,0.2);
                    border-color: rgba(255,0,0,0.5);
                    transform: scale(1.1);
                }
                
                /* Stili per la galleria principale */
                .photo-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }
                
                .photo-item {
                    position: relative;
                    aspect-ratio: 1;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }
                
                .photo-item:hover {
                    transform: translateY(-5px);
                }
                
                .photo-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                
                .photo-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                
                .photo-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 20px;
                    color: white;
                }
                
                .photo-item:hover .photo-overlay {
                    opacity: 1;
                }
                
                .photo-info h4 {
                    margin-bottom: 5px;
                    font-size: 1.1rem;
                }
                
                .photo-info p {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    margin-bottom: 5px;
                }
                
                .photo-spanish {
                    font-style: italic;
                    color: #FFD700;
                    font-size: 0.9rem;
                }
                
                .photo-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                
                .photo-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .photo-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: scale(1.1);
                }
                
                .view-all-item {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                
                .view-all-container {
                    text-align: center;
                    color: white;
                }
                
                .view-all-container i {
                    font-size: 3rem;
                    margin-bottom: 15px;
                    opacity: 0.9;
                }
                
                .view-all-container h3 {
                    margin-bottom: 10px;
                    font-size: 1.5rem;
                }
                
                .view-all-container p {
                    opacity: 0.9;
                    margin-bottom: 5px;
                }
                
                .spanish-text {
                    font-style: italic;
                    opacity: 0.8;
                    font-size: 0.9rem;
                }
                
                .loading-gallery {
                    text-align: center;
                    padding: 60px;
                    color: #666;
                }
                
                .loading-gallery i {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    animation: heartbeat 1.5s ease-in-out infinite;
                }
            `;
            document.head.appendChild(style);
        }

        openAlbum() {
            if (this.isAnimating || this.photos.length === 0) return;
            
            this.isAnimating = true;
            console.log('📖 Aprendo album matrimoniale...');
            
            // Nascondi la galleria principale
            if (this.gallery) {
                this.gallery.style.display = 'none';
            }
            
            // Mostra l'overlay dell'album
            this.albumElement.style.display = 'flex';
            
            // Mostra il nuovo tasto X
            if (this.newCloseButton) {
                this.newCloseButton.style.display = 'flex';
                console.log('✅ Nuovo tasto X mostrato');
            }
            
            // Mostra solo la copertina inizialmente
            const coverOnly = document.getElementById('album-cover-only');
            const albumBook = document.getElementById('wedding-album-book');
            
            if (coverOnly) {
                coverOnly.style.display = 'block';
                coverOnly.classList.remove('hidden');
            }
            
            if (albumBook) {
                albumBook.style.display = 'none';
            }
            
            // Azzera lo stato dell'album
            this.currentPage = 0;
            
            // Animazione di apertura dell'overlay
            setTimeout(() => {
                this.albumElement.classList.add('active');
            }, 50);
            
            // Aggiungi click handler alla copertina per aprire le pagine
            if (coverOnly) {
                coverOnly.onclick = () => this.openBookPages();
            }
            
            this.isAnimating = false;
            console.log('✅ Album aperto - clicca sulla copertina per vedere le foto');
        }
        
        openBookPages() {
            if (this.isAnimating) return;
            
            this.isAnimating = true;
            console.log('📄 Mescolando le foto per creare un album unico...');
            
            const coverOnly = document.getElementById('album-cover-only');
            const albumBook = document.getElementById('wedding-album-book');
            
            // Mostra messaggio di caricamento
            if (coverOnly) {
                const originalContent = coverOnly.innerHTML;
                coverOnly.innerHTML = `
                    <div class="cover-front">
                        <div class="cover-decoration">
                            <div style="text-align: center; color: white;">
                                <i class="fas fa-shuffle" style="font-size: 2.5rem; margin-bottom: 15px; animation: heartbeat 1s infinite;"></i>
                                <h2>Mescolando i ricordi...</h2>
                                <p>Creando il tuo album personalizzato</p>
                            </div>
                        </div>
                    </div>
                `;
                
                // Ripristina dopo 1 secondo (ridotto)
                setTimeout(() => {
                    coverOnly.innerHTML = originalContent;
                    coverOnly.classList.add('hidden');
                }, 1000);
            }
            
            // Re-randomizza le foto ogni volta che si apre l'album
            this.loadPhotos();
            
            // Genera le pagine (ridotto tempo)
            setTimeout(() => {
                this.generatePages();
                
                // Mostra le pagine dopo l'animazione della copertina (ridotto)
                setTimeout(() => {
                    if (albumBook) {
                        albumBook.style.display = 'block';
                    }
                    this.isOpen = true;
                    this.updateNavigation();
                    this.isAnimating = false;
                    console.log('✅ Album fotografico randomizzato aperto - usa frecce per navigare');
                }, 200);
            }, 1100);
        }

        closeAlbum() {
            if (this.isAnimating) return;
            
            this.isAnimating = true;
            console.log('� CHIUSURA ALBUM - Tornando alla galleria principale');
            
            // Chiudi immediatamente l'overlay dell'album
            this.albumElement.classList.remove('active');
            
            // Nascondi il nuovo tasto X
            if (this.newCloseButton) {
                this.newCloseButton.style.display = 'none';
                console.log('✅ Nuovo tasto X nascosto');
            }
            
            // Nascondi tutto l'album dopo una breve animazione
            setTimeout(() => {
                this.albumElement.style.display = 'none';
                
                // Mostra la galleria principale
                if (this.gallery) {
                    this.gallery.style.display = 'block';
                    console.log('✅ Galleria principale ripristinata');
                }
                
                // Reset completo dello stato
                this.isOpen = false;
                this.isAnimating = false;
                this.currentPage = 0;
                
                // Reset pagine dell'album
                const pages = document.querySelectorAll('.album-page');
                pages.forEach(page => {
                    page.classList.remove('turned');
                });
                
                console.log('✅ Album chiuso e stato resetato');
            }, 200); // Ridotto drasticamente per chiusura immediata
        }

        openAlbumAtPhoto(photoIndex) {
            this.currentPage = Math.floor(photoIndex / 2);
            this.openAlbum();
        }

        generatePages() {
            const pagesContainer = document.getElementById('album-pages-container');
            
            // Evita di rigenerare se le pagine esistono già
            if (pagesContainer.children.length > 0) {
                console.log('📄 Pagine già generate, riuso esistenti');
                return;
            }
            
            console.log(`🔧 Generando album fotografico per ${this.photos.length} foto (2 foto per pagina aperta)`);
            
            // Fragment per ottimizzare DOM manipulation
            const fragment = document.createDocumentFragment();
            
            // Ogni pagina aperta mostra 2 foto: una a sinistra e una a destra
            let pageIndex = 0;
            for (let i = 0; i < this.photos.length; i += 2) {
                const page = document.createElement('div');
                page.className = 'album-page';
                page.style.zIndex = 100 - pageIndex;
                page.setAttribute('data-page', pageIndex.toString());
                
                const leftPhoto = this.photos[i];
                const rightPhoto = this.photos[i + 1] || null;
                
                page.innerHTML = `
                    <div class="page-content">
                        <div class="page-left">
                            ${leftPhoto ? `
                                <img class="page-photo" 
                                     src="./assets/images/anita/ricordi/${leftPhoto.filename}" 
                                     alt="${leftPhoto.title}"
                                     onload="this.style.opacity='1'"
                                     onerror="console.error('❌ Errore foto sinistra:', this.src)"
                                     style="opacity:0; transition: opacity 0.1s ease;"
                                />
                            ` : '<div class="empty-page">Pagina vuota</div>'}
                        </div>
                        <div class="page-right">
                            ${rightPhoto ? `
                                <img class="page-photo" 
                                     src="./assets/images/anita/ricordi/${rightPhoto.filename}" 
                                     alt="${rightPhoto.title}"
                                     onload="this.style.opacity='1'"
                                     onerror="console.error('❌ Errore foto destra:', this.src)"
                                     style="opacity:0; transition: opacity 0.1s ease;"
                                />
                            ` : '<div class="empty-page">Spazio per altre foto</div>'}
                        </div>
                    </div>
                `;
                
                fragment.appendChild(page);
                pageIndex++;
            }
            
            // Aggiungi tutto in una volta per ottimizzare
            pagesContainer.appendChild(fragment);
            console.log(`📄 Album fotografico veloce: ${pageIndex} pagine generate in batch`);
        }

        nextPage() {
            if (this.isAnimating || this.currentPage >= this.totalPages - 1) return;
            
            this.isAnimating = true;
            console.log(`🔄 Passando alla pagina ${this.currentPage + 1}`);
            
            const currentPageElement = document.querySelector(`[data-page="${this.currentPage}"]`);
            
            if (currentPageElement) {
                currentPageElement.classList.add('turned');
                this.currentPage++;
                
                setTimeout(() => {
                    this.updateNavigation();
                    this.isAnimating = false;
                    console.log(`✅ Ora alla pagina ${this.currentPage}`);
                }, 150); // Ultra veloce per fluidità massima
            } else {
                console.error('❌ Pagina non trovata:', this.currentPage);
                this.isAnimating = false;
            }
        }

        previousPage() {
            if (this.isAnimating || this.currentPage <= 0) return;
            
            this.isAnimating = true;
            console.log(`🔄 Tornando alla pagina ${this.currentPage - 1}`);
            
            const prevPageElement = document.querySelector(`[data-page="${this.currentPage - 1}"]`);
            
            if (prevPageElement) {
                prevPageElement.classList.remove('turned');
                this.currentPage--;
                
                setTimeout(() => {
                    this.updateNavigation();
                    this.isAnimating = false;
                    console.log(`✅ Ora alla pagina ${this.currentPage}`);
                }, 150); // Ultra veloce per fluidità massima
            } else {
                console.error('❌ Pagina precedente non trovata:', this.currentPage - 1);
                this.isAnimating = false;
            }
        }

        updateNavigation() {
            const prevBtn = document.getElementById('prev-page-btn');
            const nextBtn = document.getElementById('next-page-btn');
            const indicator = document.getElementById('page-indicator');
            
            if (prevBtn) prevBtn.disabled = this.currentPage <= 0;
            if (nextBtn) nextBtn.disabled = this.currentPage >= this.totalPages - 1;
            if (indicator) indicator.textContent = `Pagina ${this.currentPage + 1} di ${this.totalPages}`;
        }
    }

    // Funzione globale per aprire modal foto
    window.openPhotoModal = function(filename, title, description) {
        // Implementazione semplice del modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 20000; display: flex;
            align-items: center; justify-content: center; cursor: pointer;
        `;
        
        modal.innerHTML = `
            <div style="max-width: 90%; max-height: 90%; text-align: center;">
                <img src="./assets/images/anita/ricordi/${filename}" 
                     style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 10px;" />
                <div style="color: white; margin-top: 20px;">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;
        
        modal.onclick = () => modal.remove();
        document.body.appendChild(modal);
    };

    // Crea istanza globale
    window.weddingAlbum = new WeddingPhotoAlbum();

    // Inizializza quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.weddingAlbum.init();
        });
    } else {
        window.weddingAlbum.init();
    }

    console.log('📖 Album matrimoniale caricato!');
})();
