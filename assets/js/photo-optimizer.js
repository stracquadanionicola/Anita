// Sistema di ottimizzazione foto per Render.com
class PhotoOptimizer {
    constructor() {
        this.compressionQuality = 0.7;
        this.maxWidth = 800;
        this.maxHeight = 600;
        this.cache = new Map();
    }

    // Crea una versione compressa dell'immagine
    async compressImage(imageUrl, quality = this.compressionQuality) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calcola dimensioni ottimali
                let { width, height } = this.calculateOptimalSize(img.width, img.height);
                
                canvas.width = width;
                canvas.height = height;
                
                // Disegna l'immagine compressa
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                
                // Converte in blob compresso
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.onerror = () => resolve(null);
            img.src = imageUrl;
        });
    }

    calculateOptimalSize(originalWidth, originalHeight) {
        let width = originalWidth;
        let height = originalHeight;
        
        // Ridimensiona se troppo grande
        if (width > this.maxWidth) {
            height = (height * this.maxWidth) / width;
            width = this.maxWidth;
        }
        
        if (height > this.maxHeight) {
            width = (width * this.maxHeight) / height;
            height = this.maxHeight;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }

    // Caricamento lazy con fallback
    async loadImageWithFallback(photoData, retries = 3) {
        const imagePath = `assets/images/anita/ricordi/${photoData.filename}`;
        
        // Prova prima l'immagine originale
        for (let i = 0; i < retries; i++) {
            try {
                const success = await this.testImageLoad(imagePath);
                if (success) return imagePath;
            } catch (e) {
                console.warn(`Tentativo ${i + 1} fallito per ${photoData.filename}`);
            }
            
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
            }
        }
        
        // Fallback a foto demo
        console.log(`Usando fallback per ${photoData.filename}`);
        return `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`;
    }

    testImageLoad(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const timeoutId = setTimeout(() => {
                img.onload = img.onerror = null;
                reject(new Error('Timeout'));
            }, 3000);
            
            img.onload = () => {
                clearTimeout(timeoutId);
                resolve(true);
            };
            
            img.onerror = () => {
                clearTimeout(timeoutId);
                reject(new Error('Load failed'));
            };
            
            img.src = src;
        });
    }

    // Precarica le immagini per la galleria
    async preloadGalleryImages(photos, limit = 12) {
        const imagesToLoad = photos.slice(0, limit);
        const loadPromises = imagesToLoad.map(photo => 
            this.loadImageWithFallback(photo)
        );
        
        return Promise.allSettled(loadPromises);
    }
}

// Export globale
window.PhotoOptimizer = PhotoOptimizer;
