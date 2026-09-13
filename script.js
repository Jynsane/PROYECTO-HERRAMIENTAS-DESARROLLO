/**
 * SUPKEIKS - Pastelería Boutique
 * Script Principal: Carrusel / Hero Slider y Navegación Responsive
 * Vanilla JavaScript (Sin dependencias externas)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURACIÓN Y SELECTORES
  // ==========================================================================
  const SLIDE_INTERVAL = 5000; // 5 segundos por diapositiva

  // Elementos del Carrusel
  const sliderSection = document.querySelector('.hero-slider');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const progressBar = document.getElementById('sliderProgressBar');

  // Elementos de Navegación Móvil
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');
  const mainHeader = document.getElementById('mainHeader');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  let progressAnimation = null;
  let isPaused = false;

  // ==========================================================================
  // 2. LÓGICA DEL CARRUSEL (HERO SLIDER)
  // ==========================================================================

  /**
   * Actualiza el slide activo y los dots correspondientes
   * @param {number} newIndex - Índice del slide a mostrar
   */
  function goToSlide(newIndex) {
    if (newIndex === currentIndex && slides[currentIndex].classList.contains('active')) {
      return;
    }

    // Normalizar índice circular
    if (newIndex >= totalSlides) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = totalSlides - 1;
    }

    // Remover clase active del slide actual
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    dots[currentIndex].setAttribute('aria-selected', 'false');

    // Asignar nuevo índice
    currentIndex = newIndex;

    // Activar nuevo slide
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
    dots[currentIndex].setAttribute('aria-selected', 'true');

    // Reiniciar barra de progreso y temporizador
    resetAutoplayTimer();
  }

  /**
   * Avanza al siguiente slide
   */
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  /**
   * Retrocede al slide anterior
   */
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  /**
   * Anima la barra de progreso superior durante los 5 segundos
   */
  function startProgressBar() {
    if (!progressBar) return;
    
    // Cancelar animación previa
    if (progressAnimation) {
      progressAnimation.cancel();
    }

    progressBar.style.width = '0%';

    progressAnimation = progressBar.animate(
      [
        { width: '0%' },
        { width: '100%' }
      ],
      {
        duration: SLIDE_INTERVAL,
        easing: 'linear',
        fill: 'forwards'
      }
    );

    if (isPaused) {
      progressAnimation.pause();
    }
  }

  /**
   * Inicia el temporizador de reproducción automática
   */
  function startAutoplay() {
    clearInterval(autoplayTimer);
    startProgressBar();

    autoplayTimer = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, SLIDE_INTERVAL);
  }

  /**
   * Pausa el carrusel (cuando el cursor entra)
   */
  function pauseAutoplay() {
    isPaused = true;
    if (progressAnimation && progressAnimation.playState === 'running') {
      progressAnimation.pause();
    }
  }

  /**
   * Reanuda el carrusel (cuando el cursor sale)
   */
  function resumeAutoplay() {
    isPaused = false;
    if (progressAnimation && progressAnimation.playState === 'paused') {
      progressAnimation.play();
    }
  }

  /**
   * Reinicia el temporizador de reproducción automática tras interacción manual
   */
  function resetAutoplayTimer() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // ==========================================================================
  // 3. LISTENERS DE EVENTOS DEL CARRUSEL
  // ==========================================================================

  // Clic en Flecha Siguiente
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
    });
  }

  // Clic en Flecha Anterior
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
    });
  }

  // Clic en Dots / Indicadores
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.currentTarget.getAttribute('data-slide-to'), 10);
      if (!isNaN(slideIndex)) {
        goToSlide(slideIndex);
      }
    });
  });

  // Pausa automática al pasar el mouse por encima (hover)
  if (sliderSection) {
    sliderSection.addEventListener('mouseenter', pauseAutoplay);
    sliderSection.addEventListener('mouseleave', resumeAutoplay);
  }

  // Navegación por teclado (Flecha izquierda / Flecha derecha)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  // Soporte Touch Swipe en dispositivos móviles y tablets
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  if (sliderSection) {
    sliderSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
      if (swipeDistance < 0) {
        // Deslizar izquierda -> Siguiente
        nextSlide();
      } else {
        // Deslizar derecha -> Anterior
        prevSlide();
      }
    }
  }

  // Iniciar carrusel al cargar la página
  startAutoplay();

  // ==========================================================================
  // 4. CONTROL DEL MENÚ MÓVIL (HAMBURGUESA)
  // ==========================================================================

  function toggleMobileMenu() {
    const isOpen = navMenu.classList.contains('is-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    navMenu.classList.add('is-open');
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    menuBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // Evita scroll de fondo
  }

  function closeMobileMenu() {
    navMenu.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    menuBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Cerrar menú móvil al hacer clic en cualquier enlace
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      
      // Actualizar estado activo del link
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Cerrar menú con la tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // 5. EFECTO DEL HEADER AL HACER SCROLL
  // ==========================================================================
  function handleHeaderScroll() {
    if (!mainHeader) return;
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
});
