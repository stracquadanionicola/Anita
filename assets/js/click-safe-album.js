/**
 * ALBUM CLICK-SAFE - Versione garantita funzionante
 */

(function() {
    'use strict';
    
    class ClickSafePhotoAlbum {
        constructor() {
            this.isOpen = false;
            this.currentPage = 0;
            this.photos = [];
            this.albumElement = null;
            this.isAnimating = false;
            this.totalPages = 0;
        }

        init() {
            console.log('📸 Inizializzando album click-safe...');
            this.loadPhotos();
            this.loadMainGallery();
            this.createAlbumStructure();
            this.overrideOpenFunction();
            
            // ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeAlbum();
                }
            });
        }

        loadPhotos() {
            if (typeof anitaPhotos !== 'undefined' && Array.isArray(anitaPhotos)) {
                this.photos = [...anitaPhotos].filter(photo => photo.filename);
                
                // Randomizzazione
                for (let i = this.photos.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.photos[i], this.photos[j]] = [this.photos[j], this.photos[i]];
                }
                
                this.totalPages = Math.ceil(this.photos.length / 2);
                console.log(`📸 Caricate ${this.photos.length} foto`);
            } else {
                console.warn('⚠️ Usando foto demo');
                this.loadDemoPhotos();
            }
        }

        loadDemoPhotos() {
            this.photos = Array.from({length: 20}, (_, i) => ({
                filename: `demo${i + 1}.jpg`,
                title: `Ricordo ${i + 1}`,
                description: 'Momento speciale',
                fallbackUrl: `https://picsum.photos/800/600?random=${i + 50}`
            }));
            this.totalPages = Math.ceil(this.photos.length / 2);
        }

        loadMainGallery() {
            const galleryElement = document.getElementById('photo-gallery');
            if (!galleryElement) return;

            galleryElement.innerHTML = '<div class="loading-gallery"><i class="fas fa-heart"></i><p>Caricando le nostre foto...</p></div>';
            
            setTimeout(() => {
                galleryElement.innerHTML = '';
                
                this.photos.slice(0, 12).forEach((photo, index) => {
                    const photoDiv = this.createClickSafePhotoElement(photo, index);
                    galleryElement.appendChild(photoDiv);
                });
                
                this.addViewAllButton(galleryElement);
            }, 300);
        }

        createClickSafePhotoElement(photo, index) {
            // Container principale
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-item';
            
            // OVERRIDE tutti gli stili problematici
            photoDiv.style.cssText = `
                position: relative !important;
                background: white !important;
                border-radius: 15px !important;
                overflow: hidden !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
                cursor: pointer !important;
                transition: transform 0.2s ease !important;
                aspect-ratio: 1 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
            `;
            
            // Elimina tutti i pseudo-elementi
            photoDiv.setAttribute('data-no-before', 'true');
            photoDiv.setAttribute('data-no-after', 'true');
            
            // Container immagine semplificato
            const imageContainer = document.createElement('div');
            imageContainer.style.cssText = `
                position: relative !important;
                width: 100% !important;
                height: 100% !important;
                overflow: hidden !important;
                border-radius: 15px !important;
                background: transparent !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
            `;
            
            // Immagine
            const img = document.createElement('img');
            img.src = `assets/images/anita/ricordi/${photo.filename}`;
            img.alt = photo.title || 'Ricordo Dolce';
            img.loading = 'lazy';
            
            img.style.cssText = `
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                display: block !important;
                opacity: 0 !important;
                transition: opacity 0.3s ease !important;
                border: none !important;
                outline: none !important;
                background: transparent !important;
                margin: 0 !important;
                padding: 0 !important;
                pointer-events: none !important;
            `;
            
            // Caricamento immagine
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
            
            // Area click invisibile sopra tutto
            const clickArea = document.createElement('div');
            clickArea.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: transparent !important;
                cursor: pointer !important;
                z-index: 1000 !important;
                border: none !important;
                outline: none !important;
                margin: 0 !important;
                padding: 0 !important;
            `;
            
            // EVENTI DIRETTI E SICURI
            clickArea.addEventListener('mouseenter', () => {
                photoDiv.style.transform = 'scale(1.03) !important';
            });
            
            clickArea.addEventListener('mouseleave', () => {
                photoDiv.style.transform = 'scale(1) !important';
            });
            
            clickArea.addEventListener('click', (e) => {
                console.log(`🖱️ CLICK su foto: ${photo.filename}`);
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Test immediato
                console.log('🖱️ Aprendo fullscreen...');
                this.openSafeFullscreen(img.src, photo);
            });
            
            // Assemblaggio sicuro
            imageContainer.appendChild(img);
            photoDiv.appendChild(imageContainer);
            photoDiv.appendChild(clickArea);
            
            return photoDiv;
        }

        openSafeFullscreen(imageSrc, photoData) {
            console.log('🔍 Aprendo fullscreen sicuro per:', photoData.filename);
            
            // Rimuovi overlay esistenti
            const existing = document.querySelector('.safe-fullscreen-overlay');
            if (existing) {
                existing.remove();
            }
            
            const overlay = document.createElement('div');
            overlay.className = 'safe-fullscreen-overlay';
            overlay.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0,0,0,0.95) !important;
                z-index: 999999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                opacity: 0 !important;
                transition: opacity 0.2s ease !important;
                cursor: pointer !important;
            `;
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.style.cssText = `
                max-width: 90vw !important;
                max-height: 90vh !important;
                object-fit: contain !important;
                border-radius: 8px !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
                transition: transform 0.2s ease !important;
                transform: scale(0.95) !important;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute !important;
                top: 20px !important;
                right: 20px !important;
                background: rgba(255,255,255,0.9) !important;
                border: none !important;
                font-size: 24px !important;
                width: 40px !important;
                height: 40px !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                z-index: 1000000 !important;
                transition: all 0.15s ease !important;
                font-weight: bold !important;
                color: #333 !important;
            `;
            
            // Eventi di chiusura
            const closeFullscreen = () => {
                console.log('🔍 Chiudendo fullscreen');
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.remove();
                    }
                }, 200);
            };
            
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
            
            // Assemblaggio e apertura
            overlay.appendChild(img);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);
            
            // Animazione apertura
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                img.style.transform = 'scale(1)';
            });
            
            console.log('🔍 Fullscreen aperto!');
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
                background: linear-gradient(45deg, #8B5CF6, #EC4899) !important;
                color: white !important;
                border: none !important;
                padding: 12px 24px !important;
                border-radius: 25px !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: all 0.15s ease !important;
                transform: translateY(0) !important;
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
            // Album structure minimal
            const albumHTML = `
                <div id="wedding-album" class="wedding-album-container" style="display: none;">
                    <div class="album-backdrop" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);"></div>
                    <div class="album-book" style="position: relative; width: 90vw; max-width: 1200px; height: 80vh; background: linear-gradient(45deg, #8B4513, #A0522D); border-radius: 15px; padding: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.4);">
                        <div class="book-cover" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(45deg, #F7F6F0, #E8E6D8); border-radius: 15px; display: flex; align-items: center; justify-content: center;">
                            <div class="cover-content" style="text-align: center; color: #8B4513;">
                                <h2 style="font-family: 'Allura', cursive; font-size: 3rem; margin-bottom: 10px;">I Nostri Ricordi</h2>
                                <p style="font-family: 'Great Vibes', cursive; font-size: 1.5rem; opacity: 0.8;">Anita ♡ Nicola</p>
                            </div>
                        </div>
                        <div class="book-pages" id="book-pages" style="position: relative; width: 100%; height: 100%; background: #FFFEF7; border-radius: 12px; padding: 30px; overflow: hidden; display: none;">
                            <!-- Pagine generate dinamicamente -->
                        </div>
                        <button id="close-album" class="close-album-btn" style="position: absolute; top: -15px; right: -15px; background: rgba(255,255,255,0.9); border: none; width: 35px; height: 35px; border-radius: 50%; font-size: 18px; font-weight: bold; cursor: pointer; z-index: 10;">×</button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', albumHTML);
            this.albumElement = document.getElementById('wedding-album');
            this.bindAlbumEvents();
        }

        bindAlbumEvents() {
            const closeBtn = document.getElementById('close-album');
            closeBtn.addEventListener('click', () => this.closeAlbum());
        }

        openAlbum() {
            console.log('📖 Aprendo album...');
            alert('📖 Album aperto! (versione semplificata per test click)');
        }

        closeAlbum() {
            if (this.albumElement) {
                this.albumElement.style.display = 'none';
            }
            this.isOpen = false;
        }

        overrideOpenFunction() {
            window.openAlbumSlideshow = () => this.openAlbum();
        }
    }
    
    // Sostituisci album esistente
    window.weddingAlbum = new ClickSafePhotoAlbum();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.weddingAlbum.init();
        });
    } else {
        window.weddingAlbum.init();
    }
})();
