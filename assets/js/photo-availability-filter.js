/**
 * Sistema di filtraggio automatico delle foto non disponibili
 * Rimuove spazi vuoti per foto che non si caricano
 */

class PhotoAvailabilityFilter {
    constructor() {
        this.failedPhotos = new Set();
        this.loadingPromises = new Map();
        this.initialized = false;
    }

    init() {
        console.log('🔍 Inizializzo filtro disponibilità foto...');
        this.setupImageErrorHandling();
        this.initialized = true;
    }

    setupImageErrorHandling() {
        // Intercetta tutti gli errori di caricamento immagini
        document.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                this.handleImageError(event.target);
            }
        }, true);

        // Override del metodo createElement per intercettare le immagini
        const originalCreateElement = document.createElement.bind(document);
        document.createElement = (tagName, options) => {
            const element = originalCreateElement(tagName, options);
            
            if (tagName.toLowerCase() === 'img') {
                this.setupImageMonitoring(element);
            }
            
            return element;
        };
    }

    setupImageMonitoring(img) {
        img.addEventListener('error', () => this.handleImageError(img));
        img.addEventListener('load', () => this.handleImageLoad(img));
    }

    handleImageError(img) {
        const src = img.src;
        const filename = this.extractFilename(src);
        
        if (filename) {
            this.failedPhotos.add(filename);
            console.warn(`❌ Foto non caricabile: ${filename}`);
            
            // Nascondi il contenitore della foto
            this.hidePhotoContainer(img);
            
            // Rimuovi dalla lista delle foto disponibili
            this.removeFromPhotoLists(filename);
        }
    }

    handleImageLoad(img) {
        const src = img.src;
        const filename = this.extractFilename(src);
        
        if (filename && this.failedPhotos.has(filename)) {
            this.failedPhotos.delete(filename);
            console.log(`✅ Foto ripristinata: ${filename}`);
        }
    }

    extractFilename(src) {
        if (!src) return null;
        const parts = src.split('/');
        return parts[parts.length - 1];
    }

    hidePhotoContainer(img) {
        // Trova il contenitore padre della foto
        let container = img.parentElement;
        
        // Cerca il contenitore principale della foto
        while (container && !container.classList.contains('photo-item') && 
               !container.classList.contains('slide-content') &&
               !container.classList.contains('memory-item')) {
            container = container.parentElement;
        }
        
        if (container) {
            container.style.display = 'none';
            console.log(`🚫 Nascosto contenitore per foto non disponibile`);
        }
    }

    removeFromPhotoLists(filename) {
        // Rimuovi dalle liste globali se esistono
        if (window.anitaPhotos) {
            window.anitaPhotos = window.anitaPhotos.filter(photo => 
                photo.filename !== filename
            );
        }

        // Rimuovi dal photobook localStorage
        try {
            const photobook = JSON.parse(localStorage.getItem('photobook') || '{}');
            
            if (photobook.photos) {
                photobook.photos = photobook.photos.filter(photo => 
                    photo.filename !== filename && 
                    (!photo.file || photo.file.name !== filename)
                );
            }
            
            if (photobook.memories) {
                photobook.memories = photobook.memories.filter(memory => 
                    memory.filename !== filename && 
                    (!memory.file || memory.file.name !== filename)
                );
            }
            
            localStorage.setItem('photobook', JSON.stringify(photobook));
            console.log(`🧹 Rimossa ${filename} dal localStorage`);
            
        } catch (error) {
            console.warn('Errore durante la pulizia localStorage:', error);
        }
    }

    async testPhotoAvailability(photoList) {
        if (!Array.isArray(photoList)) return photoList;
        
        console.log(`🧪 Test disponibilità di ${photoList.length} foto...`);
        
        const availablePhotos = [];
        const testPromises = photoList.map(async (photo) => {
            const filename = photo.filename || photo.file?.name;
            if (!filename) return photo;
            
            const isAvailable = await this.isPhotoAvailable(filename);
            if (isAvailable) {
                availablePhotos.push(photo);
            } else {
                console.warn(`❌ Foto non disponibile: ${filename}`);
                this.failedPhotos.add(filename);
            }
        });
        
        await Promise.all(testPromises);
        
        console.log(`✅ ${availablePhotos.length}/${photoList.length} foto disponibili`);
        return availablePhotos;
    }

    async isPhotoAvailable(filename) {
        if (this.loadingPromises.has(filename)) {
            return this.loadingPromises.get(filename);
        }
        
        const promise = new Promise((resolve) => {
            const img = new Image();
            
            const timeout = setTimeout(() => {
                resolve(false);
            }, 5000); // 5 secondi timeout
            
            img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };
            
            img.src = `./assets/images/anita/ricordi/${filename}`;
        });
        
        this.loadingPromises.set(filename, promise);
        return promise;
    }

    getFailedPhotos() {
        return Array.from(this.failedPhotos);
    }

    getAvailablePhotosCount() {
        const total = window.anitaPhotos?.length || 0;
        return total - this.failedPhotos.size;
    }
}

// Inizializza il filtro
const photoFilter = new PhotoAvailabilityFilter();

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => photoFilter.init());
} else {
    photoFilter.init();
}

// Esporta per uso globale
window.PhotoAvailabilityFilter = photoFilter;
