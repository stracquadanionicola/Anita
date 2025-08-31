/**
 * SISTEMA ALBUM SEMPLICE E FUNZIONANTE
 * Versione minimalista che funziona sempre
 */

(function() {
    'use strict';
    
    console.log('🚀 Album Semplice - Caricamento...');
    
    // Array delle foto che esistono davvero
    const photos = [
        '0baa6533-a5f7-42ca-b75d-93b6a7f77f1e.JPG',
        '0fb53d1f-4f7e-4e41-b61d-f24ebe649ae3.JPG', 
        '4258930b-26f3-487c-9c11-7c42dfb0d0ce.JPG',
        '6BD2F7E7-266E-4CF0-A52A-4298A8FAD7FE.JPG',
        '6da3198b-7f62-4023-9a39-33ba0fa41626.JPG',
        '94db9bc6-1306-49b4-be39-85753db32afa.JPG',
        'a15b9f9e-cefe-406b-bf5e-26d6da38ea3a.JPG',
        'b7d7dddb-1bbc-4b81-9cb5-705fa3408c65.JPG',
        'bf7803b4-3dd6-4454-8a4a-08935d66e51c.JPG',
        'D899EB89-780F-400D-AF97-CD74FDEA38E4.JPG',
        'DSC02589.JPG',
        'DSC02621.JPG',
        'DSC03731.JPG',
        'DSC03733.JPG',
        'DSC03734.JPG',
        'DSC03735.JPG',
        'DSC03736.JPG',
        'DSC03782.JPG',
        'DSC03784.JPG',
        'e037de9d-6dc3-4ea0-8ab4-c6d40d68f704.JPG',
        'IMG_1612.jpeg',
        'IMG_7972.PNG',
        'IMG_7992.PNG'
    ];
    
    // Funzione principale per aprire l'album
    function openPhotobook() {
        console.log('📖 Apertura album...');
        
        // Rimuovi eventuali album esistenti
        const existingAlbum = document.getElementById('photo-album');
        if (existingAlbum) {
            existingAlbum.remove();
        }
        
        // Crea il contenitore dell'album
        const albumContainer = document.createElement('div');
        albumContainer.id = 'photo-album';
        albumContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Crea il libro
        const bookContainer = document.createElement('div');
        bookContainer.style.cssText = `
            width: 90%;
            max-width: 800px;
            height: 80%;
            background: #8B4513;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            position: relative;
            overflow: hidden;
        `;
        
        // Pulsante chiudi
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: #fff;
            border: none;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            z-index: 10001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        closeBtn.onclick = closeAlbum;
        
        // Area foto
        const photoArea = document.createElement('div');
        photoArea.style.cssText = `
            width: 100%;
            height: calc(100% - 60px);
            background: #F5F5DC;
            border-radius: 5px;
            padding: 20px;
            margin-top: 40px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            align-content: start;
        `;
        
        // Aggiungi le foto
        photos.forEach((photoName, index) => {
            const photoContainer = document.createElement('div');
            photoContainer.style.cssText = `
                background: white;
                border-radius: 8px;
                padding: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                cursor: pointer;
                transition: transform 0.2s ease;
            `;
            
            const img = document.createElement('img');
            img.src = `assets/images/anita/ricordi/${photoName}`;
            img.style.cssText = `
                width: 100%;
                height: 150px;
                object-fit: cover;
                border-radius: 5px;
                display: block;
            `;
            
            const caption = document.createElement('p');
            caption.textContent = `Foto ${index + 1}`;
            caption.style.cssText = `
                margin: 10px 0 0 0;
                text-align: center;
                font-family: 'Great Vibes', cursive;
                color: #8B4513;
                font-size: 16px;
            `;
            
            // Click per ingrandire
            photoContainer.onclick = () => openPhotoViewer(img.src, `Foto ${index + 1}`);
            
            // Hover effect
            photoContainer.onmouseenter = () => {
                photoContainer.style.transform = 'scale(1.05)';
            };
            photoContainer.onmouseleave = () => {
                photoContainer.style.transform = 'scale(1)';
            };
            
            photoContainer.appendChild(img);
            photoContainer.appendChild(caption);
            photoArea.appendChild(photoContainer);
        });
        
        // Assembla tutto
        bookContainer.appendChild(closeBtn);
        bookContainer.appendChild(photoArea);
        albumContainer.appendChild(bookContainer);
        document.body.appendChild(albumContainer);
        
        // Animazione di apertura
        setTimeout(() => {
            albumContainer.style.opacity = '1';
        }, 10);
        
        console.log('✅ Album aperto con', photos.length, 'foto');
    }
    
    // Funzione per chiudere l'album
    function closeAlbum() {
        console.log('📖 Chiusura album...');
        const album = document.getElementById('photo-album');
        if (album) {
            album.style.opacity = '0';
            setTimeout(() => {
                album.remove();
            }, 300);
        }
    }
    
    // Viewer per foto singola
    function openPhotoViewer(src, title) {
        console.log('🖼️ Apertura foto:', title);
        
        const viewer = document.createElement('div');
        viewer.id = 'photo-viewer';
        viewer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border-radius: 10px;
        `;
        
        const closeViewerBtn = document.createElement('button');
        closeViewerBtn.innerHTML = '✕';
        closeViewerBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 20001;
        `;
        
        closeViewerBtn.onclick = () => {
            viewer.style.opacity = '0';
            setTimeout(() => viewer.remove(), 300);
        };
        
        viewer.onclick = (e) => {
            if (e.target === viewer) {
                closeViewerBtn.click();
            }
        };
        
        viewer.appendChild(img);
        viewer.appendChild(closeViewerBtn);
        document.body.appendChild(viewer);
        
        setTimeout(() => {
            viewer.style.opacity = '1';
        }, 10);
    }
    
    // Rendi le funzioni globali
    window.openPhotobook = openPhotobook;
    window.closeAlbum = closeAlbum;
    
    // Listener per ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const viewer = document.getElementById('photo-viewer');
            const album = document.getElementById('photo-album');
            if (viewer) {
                viewer.remove();
            } else if (album) {
                closeAlbum();
            }
        }
    });
    
    console.log('✅ Album Semplice - Pronto!');
    
})();
