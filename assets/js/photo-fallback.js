// Sistema di fallback per le foto - se le foto non sono disponibili localmente,
// usa foto di esempio o un placeholder
const photoFallback = {
    createPlaceholderPhotos() {
        const placeholderPhotos = [];
        for (let i = 1; i <= 12; i++) {
            placeholderPhotos.push({
                filename: `placeholder-${i}.jpg`,
                title: 'Momento Speciale',
                description: 'Foto di esempio per l\'album',
                spanish: 'Te quiero mucho',
                url: `https://picsum.photos/800/600?random=${i}` // Foto casuali per demo
            });
        }
        return placeholderPhotos;
    },

    // Verifica se le foto locali sono disponibili
    async checkLocalPhotos() {
        try {
            // Prova a caricare una foto locale
            const testImage = new Image();
            const testPromise = new Promise((resolve, reject) => {
                testImage.onload = () => resolve(true);
                testImage.onerror = () => resolve(false);
                setTimeout(() => resolve(false), 3000); // Timeout di 3 secondi
            });
            
            testImage.src = 'assets/images/anita/ricordi/IMG_0857.JPG';
            return await testPromise;
        } catch (e) {
            return false;
        }
    },

    // Ritorna le foto appropriate (locali o placeholder)
    async getPhotos() {
        const localAvailable = await this.checkLocalPhotos();
        
        if (localAvailable && typeof anitaPhotos !== 'undefined' && anitaPhotos.length > 0) {
            console.log('✅ Usando foto locali');
            return anitaPhotos;
        } else {
            console.log('📸 Usando foto di esempio (deployment in corso...)');
            return this.createPlaceholderPhotos();
        }
    }
};

// Export per uso globale
window.photoFallback = photoFallback;
