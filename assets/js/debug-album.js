/**
 * DEBUG VERSION - ALBUM SUPER SEMPLICE PER TEST CLICK
 */

(function() {
    'use strict';
    
    class DebugPhotoAlbum {
        constructor() {
            this.photos = [];
        }

        init() {
            console.log('🔧 DEBUG: Inizializzando album per test click...');
            this.loadPhotos();
            this.loadMainGallery();
        }

        loadPhotos() {
            // Usa foto demo se anitaPhotos non disponibile
            if (typeof anitaPhotos !== 'undefined' && Array.isArray(anitaPhotos)) {
                this.photos = [...anitaPhotos].slice(0, 6); // Solo prime 6 per test
                console.log(`🔧 DEBUG: Caricate ${this.photos.length} foto per test`);
            } else {
                console.warn('🔧 DEBUG: Usando foto demo per test');
                this.photos = Array.from({length: 6}, (_, i) => ({
                    filename: `demo${i + 1}.jpg`,
                    title: `Test Foto ${i + 1}`,
                    description: 'Test click',
                    fallbackUrl: `https://picsum.photos/300/200?random=${i + 1}`
                }));
            }
        }

        loadMainGallery() {
            const galleryElement = document.getElementById('photo-gallery');
            if (!galleryElement) {
                console.error('🔧 DEBUG: photo-gallery non trovato!');
                return;
            }

            console.log('🔧 DEBUG: Caricando galleria...');
            galleryElement.innerHTML = '<div style="margin-bottom: 20px; text-align: center; color: red; font-weight: bold;">🔧 DEBUG MODE - Test Click Foto</div>';
            
            this.photos.forEach((photo, index) => {
                const photoDiv = this.createDebugPhotoElement(photo, index);
                galleryElement.appendChild(photoDiv);
            });
        }

        createDebugPhotoElement(photo, index) {
            // Container super semplice
            const photoDiv = document.createElement('div');
            photoDiv.style.cssText = `
                display: inline-block;
                margin: 10px;
                width: 200px;
                height: 150px;
                border: 3px solid red;
                position: relative;
                cursor: pointer;
                background: white;
                text-align: center;
            `;
            
            // Numero debug
            const debugLabel = document.createElement('div');
            debugLabel.textContent = `FOTO ${index + 1}`;
            debugLabel.style.cssText = `
                position: absolute;
                top: 5px;
                left: 5px;
                background: red;
                color: white;
                padding: 2px 5px;
                font-size: 10px;
                font-weight: bold;
                z-index: 1000;
            `;
            
            // Immagine
            const img = document.createElement('img');
            img.src = `assets/images/anita/ricordi/${photo.filename}`;
            img.alt = photo.title || 'Test';
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                pointer-events: none;
            `;
            
            img.onerror = () => {
                console.log(`🔧 DEBUG: Fallback per ${photo.filename}`);
                if (photo.fallbackUrl) {
                    img.src = photo.fallbackUrl;
                } else {
                    img.src = `https://picsum.photos/200/150?random=${index + 10}`;
                }
            };
            
            // Area click
            const clickArea = document.createElement('div');
            clickArea.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,255,0,0.1);
                cursor: pointer;
                z-index: 999;
            `;
            
            // CLICK DEBUG
            clickArea.addEventListener('click', (e) => {
                console.log(`🔧 DEBUG: CLICK su foto ${index + 1} - ${photo.filename}`);
                e.preventDefault();
                e.stopPropagation();
                
                // Test alert invece di fullscreen
                alert(`✅ CLICK FUNZIONA!\n\nFoto: ${photo.filename}\nIndice: ${index + 1}\nTitolo: ${photo.title}`);
                
                // Prova anche fullscreen
                this.openDebugFullscreen(img.src, photo, index);
            });
            
            // Mouse events per debug
            clickArea.addEventListener('mouseenter', () => {
                console.log(`🔧 DEBUG: Mouse ENTER su foto ${index + 1}`);
                photoDiv.style.background = 'yellow';
            });
            
            clickArea.addEventListener('mouseleave', () => {
                console.log(`🔧 DEBUG: Mouse LEAVE su foto ${index + 1}`);
                photoDiv.style.background = 'white';
            });
            
            // Assemblaggio
            photoDiv.appendChild(img);
            photoDiv.appendChild(debugLabel);
            photoDiv.appendChild(clickArea);
            
            return photoDiv;
        }

        openDebugFullscreen(imageSrc, photoData, index) {
            console.log(`🔧 DEBUG: Aprendo fullscreen per foto ${index + 1}`);
            
            // Rimuovi overlay esistenti
            const existing = document.querySelector('.debug-fullscreen-overlay');
            if (existing) existing.remove();
            
            const overlay = document.createElement('div');
            overlay.className = 'debug-fullscreen-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.9);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                cursor: pointer;
            `;
            
            const debugInfo = document.createElement('div');
            debugInfo.style.cssText = `
                color: white;
                text-align: center;
                margin-bottom: 20px;
                padding: 10px;
                background: rgba(255,0,0,0.8);
                border-radius: 5px;
            `;
            debugInfo.innerHTML = `
                <strong>🔧 DEBUG FULLSCREEN</strong><br>
                Foto: ${photoData.filename}<br>
                Indice: ${index + 1}<br>
                Titolo: ${photoData.title}<br>
                <em>Click anywhere to close</em>
            `;
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.style.cssText = `
                max-width: 80vw;
                max-height: 70vh;
                object-fit: contain;
                border: 3px solid white;
                border-radius: 8px;
            `;
            
            overlay.appendChild(debugInfo);
            overlay.appendChild(img);
            
            // Close on click
            overlay.addEventListener('click', () => {
                console.log('🔧 DEBUG: Chiudendo fullscreen');
                overlay.remove();
            });
            
            document.body.appendChild(overlay);
            console.log('🔧 DEBUG: Fullscreen aperto!');
        }
    }
    
    // ATTIVA DEBUG MODE
    console.log('🔧 DEBUG: Creando istanza debug...');
    window.debugAlbum = new DebugPhotoAlbum();
    
    // SOSTITUISCI TEMPORANEAMENTE L'ALBUM NORMALE
    window.weddingAlbum = {
        init: () => window.debugAlbum.init(),
        openAlbum: () => alert('🔧 DEBUG: Album aperto! Click sulle foto per test.')
    };
    
    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🔧 DEBUG: DOM pronto, inizializzando...');
            window.debugAlbum.init();
        });
    } else {
        console.log('🔧 DEBUG: DOM già pronto, inizializzando subito...');
        window.debugAlbum.init();
    }
})();
