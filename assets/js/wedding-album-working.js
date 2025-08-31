/**
 * ALBUM MATRIMONIALE ANITA E NICOLA - VERSIONE SEMPLICE E FUNZIONANTE
 * Con Polaroid Viewer e tutte le funzioni che funzionano davvero
 */

(function() {
    'use strict';
    
    console.log('🚀 Caricamento Album Anita e Nicola...');
    
    // Variabili globali
    let albumPhotos = [];
    let isAlbumOpen = false;
    let currentPage = 0;
    let totalPages = 0;
    
    // Inizializzazione quando il DOM è pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📖 Inizializzazione album...');
        initializeAlbum();
    });
    
    function initializeAlbum() {
        loadPhotos();
        createAlbumHTML();
        setupGlobalFunctions();
        loadMainGallery();
        console.log('✅ Album inizializzato con successo!');
    }
    
    function loadPhotos() {
        console.log('📸 Caricamento foto...');
        
        // Prova a caricare le foto di Anita
        if (typeof anitaPhotos !== 'undefined' && Array.isArray(anitaPhotos)) {
            albumPhotos = [...anitaPhotos].filter(photo => photo.filename);
            console.log(`✅ Caricate ${albumPhotos.length} foto di Anita`);
        } 
        // Fallback alle foto demo
        else if (typeof demoPhotos !== 'undefined' && Array.isArray(demoPhotos)) {
            albumPhotos = [...demoPhotos];
            console.log(`🎭 Caricate ${albumPhotos.length} foto demo`);
        }
        // Fallback a foto create al volo
        else {
            albumPhotos = createDemoPhotos();
            console.log(`🔧 Create ${albumPhotos.length} foto di test`);
        }
        
        // Randomizza le foto
        shuffleArray(albumPhotos);
        totalPages = Math.ceil(albumPhotos.length / 2);
        
        console.log(`📚 Album pronto: ${albumPhotos.length} foto, ${totalPages} pagine`);
    }
    
    function createDemoPhotos() {
        const demoList = [];
        for (let i = 1; i <= 6; i++) {
            demoList.push({
                filename: `demo-${i}.jpg`,
                title: `Momento Speciale ${i}`,
                description: `Un ricordo indimenticabile del nostro matrimonio`,
                spanish: 'Te quiero mucho'
            });
        }
        return demoList;
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function createAlbumHTML() {
        // Rimuovi album esistente se presente
        const existingAlbum = document.getElementById('photo-album');
        if (existingAlbum) {
            existingAlbum.remove();
        }
        
        const albumHTML = `
            <div id="photo-album" class="album-overlay" style="display: none;">
                <div class="album-container">
                    <button class="album-close-btn" onclick="closePhotoAlbum()">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="album-book">
                        <div class="album-pages-container">
                            <div id="album-page-stack" class="album-page-stack">
                                <!-- Pagine generate dinamicamente -->
                            </div>
                        </div>
                        
                        <div class="album-controls">
                            <button class="album-nav-btn prev" onclick="previousAlbumPage()" id="prev-btn">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <span class="album-page-indicator">
                                <span id="current-page-num">1</span> / <span id="total-pages-num">1</span>
                            </span>
                            <button class="album-nav-btn next" onclick="nextAlbumPage()" id="next-btn">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="polaroid-viewer" class="photo-viewer-overlay" style="display: none;">
                <div class="photo-viewer-container">
                    <button class="photo-viewer-close" onclick="closePolaroidViewer()">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="photo-viewer-content">
                        <img id="polaroid-image" src="" alt="" class="photo-viewer-image">
                        <div class="photo-viewer-info">
                            <h2 id="polaroid-title" class="photo-viewer-title">Titolo</h2>
                            <p id="polaroid-description" class="photo-viewer-description">Descrizione</p>
                        </div>
                        <div class="photo-viewer-actions">
                            <button class="photo-action-btn" onclick="downloadCurrentPhoto()">
                                <i class="fas fa-download"></i>
                                Scarica
                            </button>
                            <button class="photo-action-btn" onclick="shareCurrentPhoto()">
                                <i class="fas fa-share-alt"></i>
                                Condividi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', albumHTML);
    }
    
    function setupGlobalFunctions() {
        // Funzione principale per aprire l'album
        window.openPhotobook = function() {
            console.log('📖 APERTURA ALBUM - openPhotobook chiamata');
            openPhotoAlbum();
        };
        
        // Funzioni globali per l'album
        window.openPhotoAlbum = openPhotoAlbum;
        window.closePhotoAlbum = closePhotoAlbum;
        window.nextAlbumPage = nextAlbumPage;
        window.previousAlbumPage = previousAlbumPage;
        
        // Funzioni globali per il viewer
        window.openPolaroidViewer = openPolaroidViewer;
        window.closePolaroidViewer = closePolaroidViewer;
        window.downloadCurrentPhoto = downloadCurrentPhoto;
        window.shareCurrentPhoto = shareCurrentPhoto;
        
        // Listener per ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (document.getElementById('polaroid-viewer').style.display !== 'none') {
                    closePolaroidViewer();
                } else if (isAlbumOpen) {
                    closePhotoAlbum();
                }
            }
        });
        
        console.log('🔧 Funzioni globali configurate');
    }
    
    function openPhotoAlbum() {
        console.log('📖 Apertura album...');
        
        generateAlbumPages();
        
        const album = document.getElementById('photo-album');
        album.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            album.classList.add('active');
            isAlbumOpen = true;
            console.log('✅ Album aperto!');
        }, 50);
    }
    
    function closePhotoAlbum() {
        console.log('📖 Chiusura album...');
        
        const album = document.getElementById('photo-album');
        album.classList.remove('active');
        
        setTimeout(() => {
            album.style.display = 'none';
            document.body.style.overflow = '';
            isAlbumOpen = false;
            console.log('✅ Album chiuso');
        }, 300);
    }
    
    function generateAlbumPages() {
        const pageStack = document.getElementById('album-page-stack');
        pageStack.innerHTML = '';
        
        for (let i = 0; i < totalPages; i++) {
            const leftPhoto = albumPhotos[i * 2];
            const rightPhoto = albumPhotos[i * 2 + 1];
            
            const pageDiv = document.createElement('div');
            pageDiv.className = `album-page ${i === 0 ? 'active' : ''}`;
            pageDiv.innerHTML = createPageHTML(leftPhoto, rightPhoto, i);
            
            pageStack.appendChild(pageDiv);
        }
        
        updatePageIndicator();
    }
    
    function createPageHTML(leftPhoto, rightPhoto, pageIndex) {
        const leftContent = leftPhoto ? createPhotoHTML(leftPhoto, 'left') : '<div class="photo-placeholder left"></div>';
        const rightContent = rightPhoto ? createPhotoHTML(rightPhoto, 'right') : '<div class="photo-placeholder right"></div>';
        
        return `
            <div class="page-left">${leftContent}</div>
            <div class="page-right">${rightContent}</div>
            <div class="page-number">${pageIndex + 1}</div>
        `;
    }
    
    function createPhotoHTML(photo, side) {
        const imagePath = getImagePath(photo.filename);
        const safeTitle = escapeHtml(photo.title || 'Momento Speciale');
        const safeDesc = escapeHtml(photo.description || 'Un ricordo del nostro matrimonio');
        
        return `
            <div class="photo-frame ${side}" onclick="openPolaroidViewer('${imagePath}', '${safeTitle}', '${safeDesc}')">
                <div class="photo-container">
                    <img src="${imagePath}" alt="${safeTitle}" class="album-photo" loading="lazy">
                    <div class="photo-overlay">
                        <div class="photo-info">
                            <h3 class="photo-title">${safeTitle}</h3>
                            <p class="photo-description">${safeDesc}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function openPolaroidViewer(imagePath, title, description) {
        console.log('📸 Apertura Polaroid:', title);
        
        const viewer = document.getElementById('polaroid-viewer');
        const image = document.getElementById('polaroid-image');
        const titleEl = document.getElementById('polaroid-title');
        const descEl = document.getElementById('polaroid-description');
        
        image.src = imagePath;
        image.alt = title;
        titleEl.textContent = title;
        descEl.textContent = description;
        
        // Salva i dati per download/share
        viewer.dataset.currentImage = imagePath;
        viewer.dataset.currentTitle = title;
        viewer.dataset.currentDescription = description;
        
        viewer.style.display = 'flex';
        setTimeout(() => {
            viewer.classList.add('active');
        }, 50);
    }
    
    function closePolaroidViewer() {
        const viewer = document.getElementById('polaroid-viewer');
        viewer.classList.remove('active');
        
        setTimeout(() => {
            viewer.style.display = 'none';
        }, 300);
    }
    
    function downloadCurrentPhoto() {
        const viewer = document.getElementById('polaroid-viewer');
        const imagePath = viewer.dataset.currentImage;
        const title = viewer.dataset.currentTitle;
        
        const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_AnitaNicola.jpg`;
        
        const link = document.createElement('a');
        link.href = imagePath;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('📥 Foto scaricata!');
    }
    
    function shareCurrentPhoto() {
        const viewer = document.getElementById('polaroid-viewer');
        const title = viewer.dataset.currentTitle;
        
        if (navigator.share) {
            navigator.share({
                title: `${title} - Album Anita e Nicola`,
                text: `Guarda questa foto del matrimonio di Anita e Nicola!`,
                url: window.location.href
            }).catch(() => {
                copyShareLink(title);
            });
        } else {
            copyShareLink(title);
        }
    }
    
    function copyShareLink(title) {
        const shareUrl = `${window.location.href}#foto-${encodeURIComponent(title)}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('🔗 Link copiato!');
        }).catch(() => {
            showNotification('❌ Impossibile copiare');
        });
    }
    
    function nextAlbumPage() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePageDisplay();
        }
    }
    
    function previousAlbumPage() {
        if (currentPage > 0) {
            currentPage--;
            updatePageDisplay();
        }
    }
    
    function updatePageDisplay() {
        const pages = document.querySelectorAll('.album-page');
        pages.forEach((page, index) => {
            page.classList.toggle('active', index === currentPage);
        });
        updatePageIndicator();
    }
    
    function updatePageIndicator() {
        const currentPageEl = document.getElementById('current-page-num');
        const totalPagesEl = document.getElementById('total-pages-num');
        
        if (currentPageEl) currentPageEl.textContent = currentPage + 1;
        if (totalPagesEl) totalPagesEl.textContent = totalPages;
    }
    
    function loadMainGallery() {
        const galleryContainer = document.querySelector('.main-gallery, .photo-grid, .gallery-grid, .gallery');
        if (!galleryContainer) {
            console.log('⚠️ Nessun container galleria trovato');
            return;
        }
        
        console.log('🖼️ Caricamento galleria principale...');
        
        // Usa le prime 6 foto per l'anteprima
        const previewPhotos = albumPhotos.slice(0, 6);
        
        galleryContainer.innerHTML = '';
        
        previewPhotos.forEach((photo) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'gallery-item';
            
            const imagePath = getImagePath(photo.filename);
            const safeTitle = escapeHtml(photo.title);
            const safeDesc = escapeHtml(photo.description);
            
            photoElement.innerHTML = `
                <div class="gallery-photo" onclick="openPolaroidViewer('${imagePath}', '${safeTitle}', '${safeDesc}')">
                    <img src="${imagePath}" alt="${safeTitle}" loading="lazy">
                    <div class="gallery-overlay">
                        <h3>${safeTitle}</h3>
                        <p>${safeDesc}</p>
                    </div>
                </div>
            `;
            
            galleryContainer.appendChild(photoElement);
        });
        
        console.log(`✅ Galleria caricata con ${previewPhotos.length} foto`);
    }
    
    function getImagePath(filename) {
        return `assets/images/anita/ricordi/${filename}`;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(139, 69, 19, 0.95);
            color: white;
            padding: 15px 20px;
            border-radius: 25px;
            font-family: 'Playfair Display', serif;
            font-size: 1rem;
            z-index: 99999999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    console.log('✅ Album Anita e Nicola caricato!');
})();
