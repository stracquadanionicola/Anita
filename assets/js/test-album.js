/**
 * Script di test per l'album fotografico
 */

function testAlbumFunctionality() {
    console.log('🧪 TESTING ALBUM FUNCTIONALITY...');
    
    // Test 1: Verifica che anitaPhotos sia caricato
    if (typeof anitaPhotos !== 'undefined') {
        console.log(`✅ anitaPhotos caricato: ${anitaPhotos.length} foto`);
    } else {
        console.error('❌ anitaPhotos NON caricato');
    }
    
    // Test 2: Verifica che photoAlbum sia inizializzato
    if (typeof photoAlbum !== 'undefined') {
        console.log('✅ photoAlbum inizializzato');
    } else {
        console.error('❌ photoAlbum NON inizializzato');
    }
    
    // Test 3: Verifica che openSpectacularPresentation esista
    if (typeof openSpectacularPresentation === 'function') {
        console.log('✅ openSpectacularPresentation definita');
    } else {
        console.error('❌ openSpectacularPresentation NON definita');
    }
    
    // Test 4: Verifica CSS dell'album
    const albumCSS = document.querySelector('link[href*="photo-album-viewer.css"]');
    if (albumCSS) {
        console.log('✅ CSS album caricato');
    } else {
        console.error('❌ CSS album NON caricato');
    }
    
    // Test 5: Testa apertura album
    console.log('🧪 Testando apertura album...');
    try {
        openSpectacularPresentation();
        console.log('✅ Album aperto con successo');
    } catch (error) {
        console.error('❌ Errore apertura album:', error);
    }
}

// Testa dopo che tutto è caricato
window.addEventListener('load', () => {
    setTimeout(testAlbumFunctionality, 1000);
});

console.log('🧪 Test script caricato!');
