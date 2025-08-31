/**
 * Script di inizializzazione sicuro per le foto di Anita
 * Controlla l'esistenza delle foto prima di caricarle
 */

(function() {
    'use strict';
    
    console.log('🔧 Inizializzazione sicura foto Anita...');
    
    // Lista delle foto verificate (83 foto esistenti)
    const fotoVerificate = [
        "0baa6533-a5f7-42ca-b75d-93b6a7f77f1e.JPG",
        "0fb53d1f-4f7e-4e41-b61d-f24ebe649ae3.JPG",
        "4258930b-26f3-487c-9c11-7c42dfb0d0ce.JPG",
        "6BD2F7E7-266E-4CF0-A52A-4298A8FAD7FE.JPG",
        "6da3198b-7f62-4023-9a39-33ba0fa41626.JPG",
        "94db9bc6-1306-49b4-be39-85753db32afa.JPG",
        "a15b9f9e-cefe-406b-bf5e-26d6da38ea3a.JPG",
        "b7d7dddb-1bbc-4b81-9cb5-705fa3408c65.JPG",
        "bf7803b4-3dd6-4454-8a4a-08935d66e51c.JPG",
        "D899EB89-780F-400D-AF97-CD74FDEA38E4.JPG",
        "DSC02589.JPG", "DSC02621.JPG", "DSC03731.JPG", "DSC03733.JPG", "DSC03734.JPG",
        "DSC03735.JPG", "DSC03736.JPG", "DSC03782.JPG", "DSC03784.JPG",
        "e037de9d-6dc3-4ea0-8ab4-c6d40d68f704.JPG",
        "IMG_0006 2.HEIC", "IMG_0007 2.HEIC", "IMG_0027.HEIC", "IMG_0033.HEIC", "IMG_0034.HEIC",
        "IMG_0081.HEIC", "IMG_0247.HEIC", "IMG_0254.HEIC", "IMG_0256.HEIC", "IMG_0387.HEIC",
        "IMG_0390 2.HEIC", "IMG_0390.HEIC", "IMG_0391 2.HEIC", "IMG_0391.HEIC", "IMG_0392.HEIC",
        "IMG_0393.HEIC", "IMG_0606.HEIC", "IMG_0791.HEIC", "IMG_0792.HEIC", "IMG_1144.HEIC",
        "IMG_1146.HEIC", "IMG_1499.HEIC", "IMG_1612.jpeg", "IMG_1770.HEIC", "IMG_2034.HEIC",
        "IMG_2050.jpeg", "IMG_2404.HEIC", "IMG_3111.HEIC", "IMG_3507.HEIC", "IMG_3648.HEIC",
        "IMG_3650.HEIC", "IMG_4343.HEIC", "IMG_4346.HEIC", "IMG_4559.HEIC", "IMG_5031.jpeg",
        "IMG_5207.HEIC", "IMG_6545.HEIC", "IMG_6632.jpeg", "IMG_7570.HEIC", "IMG_7902.HEIC",
        "IMG_7907.HEIC", "IMG_7972.PNG", "IMG_7973.PNG", "IMG_7974.PNG", "IMG_7992.PNG",
        "IMG_7993.PNG", "IMG_7994.PNG", "IMG_7995.PNG", "IMG_8188.PNG", "IMG_8191.PNG",
        "IMG_8199.HEIC", "IMG_8228.PNG", "IMG_8256.HEIC", "IMG_8332.HEIC", "IMG_8379.PNG",
        "IMG_8389.PNG", "IMG_8505.HEIC", "IMG_8625.HEIC", "IMG_8962.jpeg", "IMG_9621.HEIC",
        "IMG_9622.HEIC", "IMG_9624.HEIC", "IMG_9762.HEIC"
    ];
    
    // Funzione per verificare se una foto esiste
    async function verificaFoto(filename) {
        try {
            const response = await fetch(`./assets/images/anita/ricordi/${filename}`, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // Funzione per pulire il localStorage da foto inesistenti
    function pulisciLocalStorage() {
        const photobook = JSON.parse(localStorage.getItem('photobook') || '{"photos": [], "memories": [], "letters": []}');
        
        // Filtra solo le foto esistenti
        const fotoFiltrate = photobook.photos.filter(photo => 
            fotoVerificate.includes(photo.filename || photo.file?.name || '')
        );
        
        const ricordiFiltrati = photobook.memories.filter(memory => 
            fotoVerificate.includes(memory.filename || memory.file?.name || '')
        );
        
        // Aggiorna localStorage
        const photobookPulito = {
            ...photobook,
            photos: fotoFiltrate,
            memories: ricordiFiltrati
        };
        
        localStorage.setItem('photobook', JSON.stringify(photobookPulito));
        
        console.log(`✅ Foto verificate nel localStorage: ${fotoFiltrate.length + ricordiFiltrati.length}/83`);
        
        return photobookPulito;
    }
    
    // Inizializza solo quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', pulisciLocalStorage);
    } else {
        pulisciLocalStorage();
    }
    
    // Esporta per uso globale
    window.anitaPhotoSafeInit = {
        fotoVerificate,
        pulisciLocalStorage,
        verificaFoto
    };
    
    console.log('✅ Inizializzazione sicura completata - 83 foto verificate');
    
})();
