/**
 * ALBUM FOTOGRAFICO SEMPLICE E FUNZIONANTE
 * Versione standalone senza dipendenze
 */

(function() {
    'use strict';
    
    // Configurazione globale
    const ALBUM_CONFIG = {
        photosPerPage: 1,
        basePhotoPath: './assets/images/anita/ricordi/',
        defaultTitle: 'Momento Speciale',
        defaultDescription: 'Un ricordo prezioso',
        defaultSpanish: 'Te quiero'
    };

    class SimplePhotoAlbum {
        constructor() {
            this.isOpen = false;
            this.currentPage = 0;
            this.photos = [];
            this.albumElement = null;
            this.isAnimating = false;
        }

        // Inizializzazione
        init() {
            console.log('📖 Inizializzando album fotografico semplice...');
            this.createAlbumStructure();
            this.loadPhotos();
            this.overrideOpenFunction();
        }

        // Carica le foto
        loadPhotos() {
            if (typeof anitaPhotos !== 'undefined' && Array.isArray(anitaPhotos)) {
                this.photos = anitaPhotos.filter(photo => photo.filename);
                console.log(`📸 Caricate ${this.photos.length} foto`);
            } else {
                console.warn('⚠️ Array anitaPhotos non trovato');
                this.photos = [];
            }
        }

        // Sovrascrive la funzione di apertura
        overrideOpenFunction() {
            window.openSpectacularPresentation = () => {
                this.openAlbum();
            };
            console.log('✅ Funzione openSpectacularPresentation configurata');
        }

        // Crea la struttura HTML dell'album
        createAlbumStructure() {
            const albumHTML = `
                <div id="simple-photo-album" class="simple-album-overlay" style="display: none;">
                    <div class="simple-album-container">
                        <div class="simple-album-book">
                            <div class="simple-album-cover">
                                <h2>Te Quiero 💕</h2>
                                <p>I nostri ricordi</p>
                            </div>
                            <div class="simple-album-pages" id="album-pages"></div>
                        </div>
                        
                        <div class="simple-album-controls">
                            <button class="simple-btn" id="prev-btn" onclick="simpleAlbum.previousPage()">
                                ◀ Precedente
                            </button>
                            <span class="simple-page-info" id="page-info">Pagina 1 di 1</span>
                            <button class="simple-btn" id="next-btn" onclick="simpleAlbum.nextPage()">
                                Successiva ▶
                            </button>
                        </div>
                        
                        <button class="simple-close-btn" onclick="simpleAlbum.closeAlbum()">✕</button>
                    </div>
                </div>
            `;

            // Aggiungi al body
            document.body.insertAdjacentHTML('beforeend', albumHTML);
            this.albumElement = document.getElementById('simple-photo-album');
            
            // Aggiungi CSS
            this.addCSS();
        }

        // Aggiungi CSS inline
        addCSS() {
            const style = document.createElement('style');
            style.textContent = `
                .simple-album-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 10000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .simple-album-container {
                    position: relative;
                    width: 90%;
                    max-width: 800px;
                    height: 90%;
                    background: white;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    display: flex;
                    flex-direction: column;
                }

                .simple-album-book {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .simple-album-cover {
                    text-align: center;
                    padding: 30px;
                    background: linear-gradient(135deg, #ff6b9d, #c44569);
                    color: white;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }

                .simple-album-cover h2 {
                    margin: 0;
                    font-size: 2.5rem;
                    font-family: 'Allura', cursive;
                }

                .simple-album-pages {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8f9fa;
                    border-radius: 10px;
                    overflow: hidden;
                }

                .simple-page {
                    width: 100%;
                    height: 100%;
                    display: none;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .simple-page.active {
                    display: flex;
                }

                .simple-page img {
                    max-width: 90%;
                    max-height: 70%;
                    object-fit: contain;
                    border-radius: 10px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }

                .simple-page-text {
                    margin-top: 20px;
                    text-align: center;
                }

                .simple-page-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }

                .simple-page-description {
                    font-size: 1.1rem;
                    color: #666;
                    margin-bottom: 10px;
                }

                .simple-page-spanish {
                    font-size: 1.2rem;
                    color: #ff6b9d;
                    font-style: italic;
                    font-family: 'Great Vibes', cursive;
                }

                .simple-album-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                    padding: 0 20px;
                }

                .simple-btn {
                    background: #ff6b9d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .simple-btn:hover {
                    background: #e55a87;
                    transform: translateY(-2px);
                }

                .simple-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                }

                .simple-page-info {
                    font-size: 1.1rem;
                    color: #666;
                }

                .simple-close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #ff4757;
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                }

                .simple-close-btn:hover {
                    background: #ff3742;
                    transform: scale(1.1);
                }

                .simple-error {
                    text-align: center;
                    color: #999;
                    font-size: 1.2rem;
                    padding: 40px;
                }
            `;
            document.head.appendChild(style);
        }

        // Apri l'album
        openAlbum() {
            if (this.isAnimating) return;
            
            console.log('📖 Aprendo album fotografico...');
            
            if (this.photos.length === 0) {
                alert('⚠️ Nessuna foto trovata!');
                return;
            }

            this.generatePages();
            this.albumElement.style.display = 'flex';
            this.isOpen = true;
            this.currentPage = 0;
            this.showPage(0);
            this.updateControls();
        }

        // Genera le pagine
        generatePages() {
            const pagesContainer = document.getElementById('album-pages');
            pagesContainer.innerHTML = '';

            this.photos.forEach((photo, index) => {
                const page = document.createElement('div');
                page.className = 'simple-page';
                page.id = `page-${index}`;

                const filename = photo.filename || '';
                const title = photo.title || ALBUM_CONFIG.defaultTitle;
                const description = photo.description || ALBUM_CONFIG.defaultDescription;
                const spanish = photo.spanish || ALBUM_CONFIG.defaultSpanish;
                const imagePath = ALBUM_CONFIG.basePhotoPath + filename;

                page.innerHTML = `
                    <img src="${imagePath}" alt="${title}" 
                         onerror="this.parentElement.innerHTML='<div class=\\"simple-error\\">📷<br/>Foto non disponibile</div>'" />
                    <div class="simple-page-text">
                        <div class="simple-page-title">${title}</div>
                        <div class="simple-page-description">${description}</div>
                        <div class="simple-page-spanish">${spanish}</div>
                    </div>
                `;

                pagesContainer.appendChild(page);
            });

            console.log(`📄 Generate ${this.photos.length} pagine`);
        }

        // Mostra una pagina specifica
        showPage(pageIndex) {
            // Nascondi tutte le pagine
            document.querySelectorAll('.simple-page').forEach(page => {
                page.classList.remove('active');
            });

            // Mostra la pagina corrente
            const currentPage = document.getElementById(`page-${pageIndex}`);
            if (currentPage) {
                currentPage.classList.add('active');
            }

            this.currentPage = pageIndex;
            this.updateControls();
        }

        // Pagina successiva
        nextPage() {
            if (this.isAnimating) return;
            
            if (this.currentPage < this.photos.length - 1) {
                this.showPage(this.currentPage + 1);
                console.log(`📄 Pagina ${this.currentPage + 1}`);
            }
        }

        // Pagina precedente
        previousPage() {
            if (this.isAnimating) return;
            
            if (this.currentPage > 0) {
                this.showPage(this.currentPage - 1);
                console.log(`📄 Pagina ${this.currentPage + 1}`);
            }
        }

        // Aggiorna controlli
        updateControls() {
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const pageInfo = document.getElementById('page-info');

            if (prevBtn) prevBtn.disabled = this.currentPage <= 0;
            if (nextBtn) nextBtn.disabled = this.currentPage >= this.photos.length - 1;
            if (pageInfo) pageInfo.textContent = `Pagina ${this.currentPage + 1} di ${this.photos.length}`;
        }

        // Chiudi album
        closeAlbum() {
            console.log('📖 Chiudendo album...');
            this.albumElement.style.display = 'none';
            this.isOpen = false;
            this.currentPage = 0;
        }
    }

    // Crea istanza globale
    window.simpleAlbum = new SimplePhotoAlbum();

    // Inizializza quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.simpleAlbum.init();
        });
    } else {
        window.simpleAlbum.init();
    }

    console.log('📖 Album fotografico semplice caricato!');
})();
