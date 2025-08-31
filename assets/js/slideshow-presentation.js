/**
 * Presentazione spettacolare per "Apri il Libro"
 * Sistema di slideshow cinematografico con effetti fantastici
 */

class SpectacularSlideshow {
    constructor() {
        this.isActive = false;
        this.currentSlide = 0;
        this.slides = [];
        this.autoPlayTimer = null;
        this.transitionDuration = 4000; // 4 secondi per slide
        this.effects = [
            'fadeInScale', 'slideInRight', 'slideInLeft', 'zoomInRotate', 
            'flipInY', 'bounceIn', 'slideInDown', 'slideInUp'
        ];
        
        this.createSlideshowHTML();
        this.bindEvents();
    }
    
    createSlideshowHTML() {
        const slideshowHTML = `
            <div id="spectacular-slideshow" class="spectacular-slideshow">
                <div class="slideshow-overlay"></div>
                
                <!-- Controls -->
                <div class="slideshow-controls">
                    <button class="slideshow-control slideshow-close" aria-label="Chiudi presentazione">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="slideshow-control slideshow-pause" aria-label="Pausa/Play">
                        <i class="fas fa-pause"></i>
                    </button>
                    <button class="slideshow-control slideshow-prev" aria-label="Slide precedente">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="slideshow-control slideshow-next" aria-label="Slide successiva">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <!-- Main slide container -->
                <div class="slideshow-container">
                    <div class="slideshow-slide active">
                        <div class="slide-content">
                            <div class="slide-image-container">
                                <img class="slide-image" src="" alt="" />
                            </div>
                            <div class="slide-overlay">
                                <h2 class="slide-title"></h2>
                                <p class="slide-description"></p>
                                <div class="slide-spanish"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Progress indicators -->
                <div class="slideshow-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                
                <!-- Particle effects background -->
                <div class="slideshow-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>
                
                <!-- Welcome screen -->
                <div class="slideshow-welcome">
                    <div class="welcome-content">
                        <i class="fas fa-heart welcome-icon"></i>
                        <h1 class="welcome-title">Il Nostro Libro d'Amore</h1>
                        <p class="welcome-subtitle">Un viaggio attraverso i momenti più belli con Anita</p>
                        <div class="welcome-stats">
                            <div class="stat">
                                <span class="stat-number">💕</span>
                                <span class="stat-label">Amore</span>
                            </div>
                        </div>
                        <button class="welcome-start-btn">
                            <i class="fas fa-play"></i>
                            Inizia il Viaggio
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Aggiungi al DOM se non esiste
        if (!document.getElementById('spectacular-slideshow')) {
            document.body.insertAdjacentHTML('beforeend', slideshowHTML);
        }
    }
    
    bindEvents() {
        const slideshow = document.getElementById('spectacular-slideshow');
        if (!slideshow) return;
        
        // Controls
        slideshow.querySelector('.slideshow-close').addEventListener('click', () => this.close());
        slideshow.querySelector('.slideshow-pause').addEventListener('click', () => this.togglePause());
        slideshow.querySelector('.slideshow-prev').addEventListener('click', () => this.previousSlide());
        slideshow.querySelector('.slideshow-next').addEventListener('click', () => this.nextSlide());
        slideshow.querySelector('.welcome-start-btn').addEventListener('click', () => this.startPresentation());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case ' ':
                    this.nextSlide();
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        slideshow.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        
        slideshow.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }
    
    async open() {
        // Carica le foto dal photobook
        this.loadPhotos();
        
        if (this.slides.length === 0) {
            alert('Nessuna foto disponibile per la presentazione');
            return;
        }
        
        const slideshow = document.getElementById('spectacular-slideshow');
        slideshow.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isActive = true;
        
        // Mostra schermata di benvenuto
        slideshow.querySelector('.slideshow-welcome').classList.add('active');
        
        // Inizia animazione delle particelle
        this.startParticleAnimation();
        
        console.log('🎬 Presentazione spettacolare avviata!');
    }
    
    loadPhotos() {
        console.log('🔍 Caricamento foto per slideshow...');
        
        // Prima prova a caricare le foto di Anita dal file dedicato
        if (typeof anitaPhotos !== 'undefined' && anitaPhotos.length > 0) {
            this.slides = anitaPhotos;
            console.log('✅ Caricate', this.slides.length, 'foto di Anita dal file dedicato');
        } else {
            // Fallback: cerca nel localStorage
            const storedPhotos = JSON.parse(localStorage.getItem('photobook_photos') || '[]');
            this.slides = storedPhotos.filter(photo => photo.isAnitaPhoto);
            console.log('📦 Caricate', this.slides.length, 'foto di Anita dal localStorage');
        }
        
        // Se non ci sono foto, mostra un messaggio
        if (this.slides.length === 0) {
            console.warn('⚠️ Nessuna foto trovata per slideshow');
            this.slides = [{
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCI+Rm90byBub24gZGlzcG9uaWJpbGU8L3RleHQ+Cjwvc3ZnPg==',
                title: 'Nessuna foto disponibile',
                description: 'Le foto di Anita non sono ancora state caricate',
                spanishPhrase: 'Cargando amor...'
            }];
        }
        
        // Aggiorna contatore
        // Slideshow pronto - rimuovo aggiornamento contatori
        console.log('🎭 Slideshow pronto con', this.slides.length, 'foto');
    }
    
    startPresentation() {
        console.log('🎬 Avvio presentazione con', this.slides.length, 'foto');
        
        const slideshow = document.getElementById('spectacular-slideshow');
        if (!slideshow) {
            console.error('❌ Elemento slideshow non trovato!');
            return;
        }
        
        const welcomeScreen = slideshow.querySelector('.slideshow-welcome');
        if (welcomeScreen) {
            welcomeScreen.classList.remove('active');
        }
        
        setTimeout(() => {
            this.currentSlide = 0;
            this.showSlide(0);
            this.startAutoPlay();
        }, 500);
    }
    
    showSlide(index) {
        if (!this.slides[index]) return;
        
        const slideshow = document.getElementById('spectacular-slideshow');
        const slide = this.slides[index];
        
        // Aggiorna contenuto
        const slideImage = slideshow.querySelector('.slide-image');
        const slideTitle = slideshow.querySelector('.slide-title');
        const slideDescription = slideshow.querySelector('.slide-description');
        const slideSpanish = slideshow.querySelector('.slide-spanish');
        
        // Effetto di transizione
        const container = slideshow.querySelector('.slideshow-container');
        container.style.opacity = '0';
        
        setTimeout(() => {
            slideImage.src = slide.src;
            slideImage.alt = slide.title;
            slideTitle.textContent = slide.title;
            slideDescription.textContent = slide.description;
            slideSpanish.textContent = slide.spanishPhrase ? `"${slide.spanishPhrase}"` : '';
            
            // Applica effetto casuale
            const effect = this.effects[Math.floor(Math.random() * this.effects.length)];
            container.className = `slideshow-container ${effect}`;
            container.style.opacity = '1';
            
            // Aggiorna contatori
            slideshow.querySelector('.current').textContent = index + 1;
            this.updateProgress();
            
        }, 300);
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.showSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, this.transitionDuration);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    togglePause() {
        const slideshow = document.getElementById('spectacular-slideshow');
        const pauseBtn = slideshow.querySelector('.slideshow-pause i');
        
        if (this.autoPlayTimer) {
            this.stopAutoPlay();
            pauseBtn.className = 'fas fa-play';
        } else {
            this.startAutoPlay();
            pauseBtn.className = 'fas fa-pause';
        }
    }
    
    updateProgress() {
        const progress = ((this.currentSlide + 1) / this.slides.length) * 100;
        const progressFill = document.querySelector('.progress-fill');
        progressFill.style.width = `${progress}%`;
    }
    
    startParticleAnimation() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            particle.style.animationDelay = `${index * 0.5}s`;
            particle.style.animationDuration = `${3 + Math.random() * 2}s`;
        });
    }
    
    close() {
        this.stopAutoPlay();
        
        const slideshow = document.getElementById('spectacular-slideshow');
        slideshow.classList.remove('active');
        slideshow.querySelector('.slideshow-welcome').classList.remove('active');
        
        document.body.style.overflow = '';
        this.isActive = false;
        
        console.log('🎬 Presentazione terminata');
    }
}

// Il slideshow viene inizializzato tramite init-slideshow.js
console.log('🎬 Sistema di presentazione spettacolare caricato!');
