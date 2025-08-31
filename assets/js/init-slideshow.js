/**
 * Inizializzazione e funzioni globali per la presentazione spettacolare
 */

let spectacularSlideshow = null;

/**
 * Inizializza il slideshow spettacolare
 */
function initSpectacularSlideshow() {
    console.log('Inizializzando slideshow...');
    if (!spectacularSlideshow) {
        if (typeof SpectacularSlideshow === 'undefined') {
            console.error('SpectacularSlideshow non è definito!');
            return false;
        }
        spectacularSlideshow = new SpectacularSlideshow();
        console.log('Slideshow inizializzato:', spectacularSlideshow);
    }
    return true;
}

/**
 * Apre la presentazione spettacolare
 */
function openSpectacularPresentation() {
    console.log('Tentativo di aprire presentazione...');
    
    // Inizializza il slideshow se non esiste
    if (!spectacularSlideshow) {
        console.log('Slideshow non esistente, inizializzo...');
        if (!initSpectacularSlideshow()) {
            console.error('Impossibile inizializzare slideshow');
            alert('Errore: impossibile avviare la presentazione');
            return;
        }
    }
    
    // Verifica che lo slideshow sia valido
    if (!spectacularSlideshow || typeof spectacularSlideshow.open !== 'function') {
        console.error('Slideshow non valido:', spectacularSlideshow);
        alert('Errore: slideshow non valido');
        return;
    }
    
    console.log('Avvio presentazione...');
    // Avvia la presentazione
    spectacularSlideshow.open();
}

// Rendi la funzione globale
window.openSpectacularPresentation = openSpectacularPresentation;

// Inizializza automaticamente quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM caricato, inizializzo slideshow...');
    
    // Aspetta che le foto di Anita siano disponibili
    function waitForAnitaPhotos() {
        if (typeof anitaPhotos !== 'undefined' && anitaPhotos.length > 0) {
            console.log('✅ Foto di Anita disponibili:', anitaPhotos.length);
            if (typeof SpectacularSlideshow !== 'undefined') {
                initSpectacularSlideshow();
            } else {
                console.warn('⚠️ SpectacularSlideshow non ancora disponibile');
            }
        } else {
            console.log('⏳ Aspettando foto di Anita...');
            setTimeout(waitForAnitaPhotos, 500);
        }
    }
    
    // Aspetta un po' per assicurarsi che tutti gli script siano caricati
    setTimeout(waitForAnitaPhotos, 1000);
});

// Supporto per i tasti freccia globali
document.addEventListener('keydown', function(e) {
    if (spectacularSlideshow && spectacularSlideshow.isActive) {
        switch(e.key) {
            case 'ArrowLeft':
                spectacularSlideshow.previousSlide();
                break;
            case 'ArrowRight':
                spectacularSlideshow.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                spectacularSlideshow.toggleAutoPlay();
                break;
            case 'Escape':
                spectacularSlideshow.stopPresentation();
                break;
        }
    }
});
