// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
    
    // Inicializar navegación móvil
    initMobileNavigation();
    
    // Inicializar scroll suave del header
    initHeaderScroll();
    
    // Inicializar lazy loading de imágenes
    initLazyLoading();
    
    // Configurar lightbox
    initLightbox();
    
    // Validación de formulario
    initFormValidation();
    
    // Configurar navegación por teclado
    initKeyboardNavigation();
});

// Navegación móvil
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Actualizar aria-expanded
            const isExpanded = navToggle.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Bloquear scroll del body cuando el menú está abierto
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
        
        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
}

// Header con efecto de scroll
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            // Agregar clase cuando se hace scroll
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Función para scroll suave a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Navegación por teclado mejorada
function initKeyboardNavigation() {
    // Configurar navegación por teclado para el menú
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (index + 1) % navLinks.length;
                navLinks[nextIndex].focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = index === 0 ? navLinks.length - 1 : index - 1;
                navLinks[prevIndex].focus();
            }
        });
    });
}

// Lazy loading de imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.onload = function() {
                        img.classList.add('loaded');
                    };
                    if (img.complete) {
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        images.forEach(function(img) {
            img.classList.add('loaded');
        });
    }
}

// Configuración de lightbox
function initLightbox() {
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'showImageNumberLabel': true,
            'albumLabel': 'Imagen %1 de %2',
            'fadeDuration': 300,
            'imageFadeDuration': 300
        });
    }
}

// Función para toggle de likes en las notas
function toggleLike(button) {
    button.classList.toggle('liked');
    const heart = button.querySelector('.heart');
    
    if (button.classList.contains('liked')) {
        heart.textContent = '♥';
        
        // Vibración en dispositivos compatibles
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
        
        // Guardar en localStorage
        const noteCard = button.closest('.note-card');
        const noteIndex = Array.from(noteCard.parentNode.children).indexOf(noteCard);
        localStorage.setItem(`note-liked-${noteIndex}`, 'true');
        
        // Mostrar mensaje de feedback
        showLikeToast('¡Me gusta! ♥');
    } else {
        heart.textContent = '♡';
        
        // Remover de localStorage
        const noteCard = button.closest('.note-card');
        const noteIndex = Array.from(noteCard.parentNode.children).indexOf(noteCard);
        localStorage.removeItem(`note-liked-${noteIndex}`);
    }
}

// Función para mostrar toast de like
function showLikeToast(message) {
    // Crear elemento toast si no existe
    let toast = document.getElementById('like-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'like-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 12px 20px;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            z-index: 10000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            font-weight: 500;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    
    // Mostrar toast
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Ocultar toast después de 2 segundos
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 2000);
}

// Restaurar likes guardados
function restoreSavedLikes() {
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach((button, index) => {
        if (localStorage.getItem(`note-liked-${index}`) === 'true') {
            button.classList.add('liked');
            button.querySelector('.heart').textContent = '♥';
        }
    });
}

// Validación y envío del formulario
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    // Validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar errores previos
    clearFieldError(field);
    
    // Validar campo requerido
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }
    
    // Validar email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un email válido';
        }
    }
    
    // Validar longitud mínima para mensaje
    if (field.name === 'mensaje' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Mostrar error en campo
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Crear elemento de error
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        font-weight: 500;
    `;
    
    field.parentNode.appendChild(errorElement);
    
    // Agregar estilos de error al campo
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
}

// Limpiar error en campo
function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    // Validar todos los campos
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        // Enfocar el primer campo con error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Mostrar indicador de carga
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const data = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        mensaje: formData.get('mensaje')
    };
    
    // Simular envío (puedes reemplazar esto con tu lógica de envío real)
    setTimeout(() => {
        // Crear enlace mailto como fallback
        const subject = encodeURIComponent(`Mensaje de ${data.nombre} - Sitio web de amor`);
        const body = encodeURIComponent(`
Nombre: ${data.nombre}
Email: ${data.email || 'No proporcionado'}

Mensaje:
${data.mensaje}

---
Enviado desde el sitio web de amor
        `);
        
        const mailtoLink = `mailto:tu.email@ejemplo.com?subject=${subject}&body=${body}`;
        
        // Abrir cliente de email
        window.location.href = mailtoLink;
        
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
        // Resetear formulario
        form.reset();
        
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="
            background: #27ae60;
            color: white;
            padding: 1.5rem;
            border-radius: var(--radius);
            margin: 2rem 0;
            text-align: center;
            animation: fadeInUp 0.5s ease-out;
        ">
            <h3 style="margin-bottom: 0.5rem;">¡Mensaje enviado!</h3>
            <p style="margin: 0; opacity: 0.9;">Tu mensaje ha sido enviado correctamente. ¡Gracias por escribir!</p>
        </div>
    `;
    
    const form = document.querySelector('.contact-form');
    form.appendChild(successMessage);
    
    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
    
    // Scroll al mensaje
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Función para actualizar el año dinámicamente
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Función para animaciones de entrada cuando el elemento entra en viewport
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos con animaciones
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Función para mejorar la performance
function initPerformanceOptimizations() {
    // Lazy loading para iframes (como Spotify)
    const iframes = document.querySelectorAll('iframe');
    if ('IntersectionObserver' in window) {
        const iframeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (iframe.dataset.src) {
                        iframe.src = iframe.dataset.src;
                        iframe.removeAttribute('data-src');
                    }
                    iframeObserver.unobserve(iframe);
                }
            });
        }, { rootMargin: '50px' });
        
        iframes.forEach(iframe => {
            if (iframe.src && iframe.src.includes('spotify')) {
                iframe.dataset.src = iframe.src;
                iframe.src = '';
                iframeObserver.observe(iframe);
            }
        });
    }
}

// Funciones para accesibilidad mejorada
function initAccessibility() {
    // Anunciar cambios para lectores de pantalla
    const announceRegion = document.createElement('div');
    announceRegion.setAttribute('aria-live', 'polite');
    announceRegion.setAttribute('aria-atomic', 'true');
    announceRegion.className = 'sr-only';
    announceRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    document.body.appendChild(announceRegion);
    
    window.announceToScreenReader = function(message) {
        announceRegion.textContent = message;
        setTimeout(() => {
            announceRegion.textContent = '';
        }, 1000);
    };
}

// Event listeners adicionales
window.addEventListener('load', function() {
    // Restaurar likes guardados
    restoreSavedLikes();
    
    // Actualizar año actual
    updateCurrentYear();
    
    // Inicializar optimizaciones de performance
    initPerformanceOptimizations();
    
    // Inicializar accesibilidad
    initAccessibility();
});

// Manejar cambios de orientación en móviles
window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        // Recalcular posiciones después del cambio de orientación
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 500);
});

// Función para detectar si el usuario prefiere movimiento reducido
function respectReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Desactivar AOS si el usuario prefiere movimiento reducido
        if (typeof AOS !== 'undefined') {
            AOS.init({
                disable: true
            });
        }
    }
}

// Inicializar respeto por preferencias de movimiento
respectReducedMotion();

// Función para logging de errores (opcional, para desarrollo)
function logError(error, context) {
    if (console && console.error) {
        console.error(`Error en ${context}:`, error);
    }
}

// Manejo global de errores para mejor experiencia del usuario
window.addEventListener('error', function(event) {
    logError(event.error, 'Global');
    
    // Aquí podrías enviar el error a un servicio de monitoreo
    // Ej: sendErrorToService(event.error);
});

// Exportar funciones principales para uso global
window.scrollToSection = scrollToSection;
window.toggleLike = toggleLike;
window.handleFormSubmit = handleFormSubmit;
