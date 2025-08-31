/**
 * Sistema di precaricamento immagini per migliorare le performance
 */

class ImagePreloader {
    constructor() {
        this.cache = new Map();
        this.loading = new Set();
        this.preloadQueue = [];
        this.maxConcurrent = 3;
        this.currentLoading = 0;
    }
    
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.cache.has(src)) {
                resolve(this.cache.get(src));
                return;
            }
            
            if (this.loading.has(src)) {
                // Se l'immagine è già in caricamento, aspetta
                setTimeout(() => {
                    this.preloadImage(src).then(resolve).catch(reject);
                }, 100);
                return;
            }
            
            this.loading.add(src);
            
            const img = new Image();
            
            img.onload = () => {
                this.cache.set(src, img);
                this.loading.delete(src);
                this.currentLoading--;
                this.processQueue();
                resolve(img);
            };
            
            img.onerror = () => {
                this.loading.delete(src);
                this.currentLoading--;
                this.processQueue();
                reject(new Error(`Failed to load image: ${src}`));
            };
            
            if (this.currentLoading < this.maxConcurrent) {
                this.currentLoading++;
                img.src = src;
            } else {
                this.preloadQueue.push(() => {
                    this.currentLoading++;
                    img.src = src;
                });
            }
        });
    }
    
    processQueue() {
        if (this.preloadQueue.length > 0 && this.currentLoading < this.maxConcurrent) {
            const next = this.preloadQueue.shift();
            next();
        }
    }
    
    preloadBatch(srcs) {
        return Promise.allSettled(srcs.map(src => this.preloadImage(src)));
    }
    
    clearCache() {
        this.cache.clear();
        this.loading.clear();
        this.preloadQueue = [];
        this.currentLoading = 0;
    }
    
    getCachedImage(src) {
        return this.cache.get(src);
    }
    
    getStats() {
        return {
            cached: this.cache.size,
            loading: this.loading.size,
            queued: this.preloadQueue.length,
            currentLoading: this.currentLoading
        };
    }
}

// Inizializza il preloader globale
window.imagePreloader = new ImagePreloader();

// Sistema di caricamento progressivo per la galleria
class ProgressiveGalleryLoader {
    constructor() {
        this.observer = null;
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadPhotoItem(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
        }
    }
    
    observePhotoItems() {
        const photoItems = document.querySelectorAll('.photo-item img[data-src]');
        photoItems.forEach(img => {
            if (this.observer) {
                this.observer.observe(img);
            } else {
                // Fallback per browser senza IntersectionObserver
                this.loadPhotoItem(img);
            }
        });
    }
    
    loadPhotoItem(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        // Mostra loading indicator
        img.style.opacity = '0.5';
        
        window.imagePreloader.preloadImage(src)
            .then((cachedImg) => {
                img.src = src;
                img.removeAttribute('data-src');
                img.style.opacity = '1';
                img.classList.add('loaded');
                
                // Trigger animation
                if (img.closest('.photo-item')) {
                    img.closest('.photo-item').classList.add('image-loaded');
                }
            })
            .catch((error) => {
                console.warn('Failed to load image:', src, error);
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSIxNTAiIHk9IjEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5Ij5JbW1hZ2luZSBub24gdHJvdmF0YTwvdGV4dD48L3N2Zz4=';
                img.style.opacity = '1';
            });
    }
    
    preloadVisibleImages() {
        // Precarica le prime immagini visibili
        const visibleImages = Array.from(document.querySelectorAll('.photo-item img'))
            .slice(0, 6) // Prime 6 immagini
            .map(img => img.src || img.getAttribute('data-src'))
            .filter(src => src && !src.startsWith('data:'));
        
        if (visibleImages.length > 0) {
            window.imagePreloader.preloadBatch(visibleImages);
        }
    }
}

// Inizializza il caricatore progressivo
window.progressiveLoader = new ProgressiveGalleryLoader();

// Hook per integrare con il sistema esistente
document.addEventListener('DOMContentLoaded', () => {
    // Aspetta che le foto siano caricate
    setTimeout(() => {
        window.progressiveLoader.observePhotoItems();
        window.progressiveLoader.preloadVisibleImages();
    }, 2000);
});

// Aggiorna quando la galleria viene aggiornata
const originalRefreshGallery = window.refreshPhotoGallery;
window.refreshPhotoGallery = function() {
    if (originalRefreshGallery) {
        originalRefreshGallery();
    }
    
    setTimeout(() => {
        window.progressiveLoader.observePhotoItems();
        window.progressiveLoader.preloadVisibleImages();
    }, 500);
};

// Utility per ottimizzare le performance
class PerformanceOptimizer {
    constructor() {
        this.isTabVisible = true;
        this.setupVisibilityAPI();
        this.setupPerformanceMonitoring();
    }
    
    setupVisibilityAPI() {
        document.addEventListener('visibilitychange', () => {
            this.isTabVisible = !document.hidden;
            
            if (this.isTabVisible) {
                // Tab è diventato visibile, riprendi precaricamento
                window.progressiveLoader.preloadVisibleImages();
            }
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitora le performance del sistema
        if ('performance' in window && 'memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
                
                if (memoryUsage > 0.8) {
                    // Se la memoria è quasi piena, pulisci la cache
                    console.warn('High memory usage detected, clearing image cache');
                    window.imagePreloader.clearCache();
                }
            }, 30000); // Controlla ogni 30 secondi
        }
    }
    
    optimizeImages() {
        // Ottimizza le immagini riducendo la qualità se necessario
        const images = document.querySelectorAll('.photo-item img');
        images.forEach(img => {
            if (img.naturalWidth > 1920) {
                // Immagine molto grande, applica ottimizzazioni CSS
                img.style.imageRendering = 'optimizeQuality';
                img.style.transform = 'translateZ(0)'; // Force GPU acceleration
            }
        });
    }
}

// Inizializza l'ottimizzatore
window.performanceOptimizer = new PerformanceOptimizer();

console.log('🚀 Sistema di ottimizzazione immagini avviato!');
