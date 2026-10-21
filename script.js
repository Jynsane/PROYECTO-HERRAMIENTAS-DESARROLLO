/**
 * FerreMax - Ferretería y Construcción
 * Script principal: carrusel, navegación y productos
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
    if (totalSlides === 0) {
      return;
    }

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
    if (totalSlides > 0) {
      startAutoplay();
    }
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

  // Iniciar carrusel solo en páginas que lo contienen
  if (totalSlides > 0) {
    startAutoplay();
  }

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
    if (navMenu) navMenu.classList.remove('is-open');
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    if (menuBackdrop) menuBackdrop.classList.remove('is-active');
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
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('is-open')) {
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
document.addEventListener("DOMContentLoaded", () => {
  // 1. Array inicial de productos
  const defaultCatalog = [
    {
      id: 1,
      name: "Clavos de acero 2 pulgadas (1 kg)",
      price: 12.90,
      desc: "Clavos resistentes para trabajos de carpintería, reparaciones y construcción.",
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      name: "Martillo de uña 16 oz",
      price: 28.50,
      desc: "Martillo con mango ergonómico, ideal para clavar y retirar clavos.",
      img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      name: "Juego de destornilladores (6 piezas)",
      price: 35.00,
      desc: "Set con puntas planas y Phillips para tareas de instalación y mantenimiento.",
      img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      name: "Taladro percutor 650 W",
      price: 189.90,
      desc: "Taladro con función percutora para perforar madera, metal y mampostería.",
      img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      name: "Tornillos para madera 2 pulgadas (100 unidades)",
      price: 16.90,
      desc: "Tornillos galvanizados con punta fina para fijaciones firmes en madera.",
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      name: "Cinta métrica profesional 5 m",
      price: 19.90,
      desc: "Cinta retráctil con seguro y gancho metálico para mediciones precisas.",
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 7,
      name: "Pintura látex blanca (1 galón)",
      price: 59.90,
      desc: "Pintura para interiores de buen rendimiento y acabado uniforme.",
      img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 8,
      name: "Guantes de seguridad reforzados",
      price: 18.00,
      desc: "Guantes resistentes para proteger las manos durante trabajos de mantenimiento.",
      img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 9,
      name: "Llave inglesa ajustable 10 pulgadas",
      price: 32.90,
      desc: "Llave ajustable de acero para apretar y aflojar tuercas de distintos tamaños.",
      img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 10,
      name: "Cable eléctrico calibre 12 (por metro)",
      price: 4.50,
      desc: "Cable de cobre para instalaciones eléctricas, disponible por metro.",
      img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 11,
      name: "Cemento de uso general (bolsa 42.5 kg)",
      price: 29.90,
      desc: "Cemento para preparar concreto, mortero y realizar trabajos de albañilería.",
      img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 12,
      name: "Cinta aislante negra",
      price: 4.90,
      desc: "Cinta aislante flexible para trabajos eléctricos y reparaciones generales.",
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const fallbackImg = "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80";

  // 2. Persistencia en localStorage
  function getCatalogProducts() {
    const data = localStorage.getItem("ferremax_catalog");
    if (!data || JSON.parse(data).length === 0) {
      localStorage.setItem("ferremax_catalog", JSON.stringify(defaultCatalog));
      return defaultCatalog;
    }
    return JSON.parse(data);
  }

  function saveCatalogProducts(prods) {
    localStorage.setItem("ferremax_catalog", JSON.stringify(prods));
  }

  function getUpcomingProducts() {
    const data = localStorage.getItem("ferremax_upcoming");
    return data ? JSON.parse(data) : [];
  }

  function saveUpcomingProducts(prods) {
    localStorage.setItem("ferremax_upcoming", JSON.stringify(prods));
  }

  // 3. Render Catálogo
  const catalogGrid = document.getElementById("catalogProductGrid");
  if (catalogGrid) {
    const products = getCatalogProducts();
    catalogGrid.innerHTML = products.map(prod => `
      <article class="feature-card product-card">
        <div class="product-image-container">
          <img src="${prod.img || fallbackImg}" alt="${prod.name}" class="product-img">
        </div>
        <h3>${prod.name}</h3>
        <p>${prod.desc}</p>
        <div class="product-footer">
          <span class="product-price">S/. ${parseFloat(prod.price).toFixed(2)}</span>
          <a href="https://wa.me/51999999999?text=Hola%20FerreMax!%20Quiero%20consultar%20por:%20${encodeURIComponent(prod.name)}" target="_blank" class="btn btn-primary" style="padding:6px 14px; font-size:0.85rem;">Cotizar</a>
        </div>
      </article>
    `).join("");
  }

  // 4. Render Ofertas
  const offersGrid = document.getElementById("offersProductGrid");
  const btnRegenerate = document.getElementById("btnRegenerateDiscounts");

  function renderOffers() {
    if (!offersGrid) return;
    const products = getCatalogProducts();

    offersGrid.innerHTML = products.map(prod => {
      const discountPercent = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
      const originalPrice = parseFloat(prod.price);
      const discountedPrice = originalPrice * (1 - discountPercent / 100);

      return `
        <article class="feature-card product-card" style="position:relative;">
          <span class="badge-discount">-${discountPercent}% OFF</span>
          <div class="product-image-container">
            <img src="${prod.img || fallbackImg}" alt="${prod.name}" class="product-img">
          </div>
          <h3>${prod.name}</h3>
          <p>${prod.desc}</p>
          <div class="product-footer">
            <div>
              <span class="old-price">S/. ${originalPrice.toFixed(2)}</span>
              <span class="product-price">S/. ${discountedPrice.toFixed(2)}</span>
            </div>
            <a href="https://wa.me/51999999999?text=Hola%20FerreMax!%20Quiero%20consultar%20por%20la%20oferta%20de:%20${encodeURIComponent(prod.name)}%20con%20descuento%20de%20${discountPercent}%25" target="_blank" class="btn btn-primary" style="padding:6px 14px; font-size:0.85rem;">Aprovechar</a>
          </div>
        </article>
      `;
    }).join("");
  }

  if (offersGrid) {
    renderOffers();
    if (btnRegenerate) {
      btnRegenerate.addEventListener("click", renderOffers);
    }
  }

  // 5. Render Próximos
  const upcomingGrid = document.getElementById("upcomingProductGrid");
  const formNewProduct = document.getElementById("formNewProduct");

  function renderUpcoming() {
    if (!upcomingGrid) return;
    const upcomings = getUpcomingProducts();

    if (upcomings.length === 0) {
      upcomingGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--color-cream-muted); padding: 30px;">Próximamente anunciaremos nuevos productos.</p>`;
      return;
    }

    upcomingGrid.innerHTML = upcomings.map((prod, index) => `
      <article class="feature-card product-card">
        <div class="product-image-container">
          <img src="${prod.img || fallbackImg}" alt="${prod.name}" class="product-img">
        </div>
        <h3>${prod.name}</h3>
        <p>${prod.desc}</p>
        <div class="product-footer">
          <span class="product-price">S/. ${parseFloat(prod.price).toFixed(2)}</span>
          <button class="btn btn-primary btn-publish" data-index="${index}" style="padding:6px 12px; font-size:0.82rem;">Agregar al catálogo</button>
        </div>
      </article>
    `).join("");

    document.querySelectorAll(".btn-publish").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        const prods = getUpcomingProducts();
        const launched = prods[idx];

        const catalog = getCatalogProducts();
        catalog.push(launched);
        saveCatalogProducts(catalog);

        prods.splice(idx, 1);
        saveUpcomingProducts(prods);

        renderUpcoming();
        alert(`"${launched.name}" se agregó al catálogo y a las ofertas.`);
      });
    });
  }

  if (formNewProduct) {
    renderUpcoming();

    formNewProduct.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("prodName").value.trim();
      const price = parseFloat(document.getElementById("prodPrice").value);
      const desc = document.getElementById("prodDesc").value.trim();
      const img = document.getElementById("prodImg").value.trim();

      const prods = getUpcomingProducts();
      prods.push({ id: Date.now(), name, price, desc, img });
      saveUpcomingProducts(prods);

      formNewProduct.reset();
      renderUpcoming();
    });
  }
});
// 2. PRODUCTOS EXCLUSIVOS QUE SE LANZARÁN EN EL FUTURO (NO ESTÁN EN CATÁLOGO)
const defaultUpcoming = [
  {
    id: 101,
    name: "Sierra circular 7 1/4 pulgadas",
    price: 249.90,
    desc: "Herramienta eléctrica para cortes rectos y precisos en madera y tableros.",
    badge: "Próximamente",
    img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 102,
    name: "Amoladora angular 4 1/2 pulgadas",
    price: 179.90,
    desc: "Equipo compacto para cortar, desbastar y pulir distintos materiales.",
    badge: "Próximamente",
    img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 103,
    name: "Caja de herramientas metálica",
    price: 89.90,
    desc: "Caja resistente con bandeja organizadora para guardar y transportar herramientas.",
    badge: "Nuevo",
    img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 104,
    name: "Nivel de aluminio 24 pulgadas",
    price: 39.90,
    desc: "Nivel con burbujas de precisión para comprobar superficies y alineaciones.",
    badge: "Nuevo",
    img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 105,
    name: "Llave de tubo para plomería",
    price: 54.90,
    desc: "Herramienta de agarre firme para ajustar y aflojar conexiones de tubería.",
    badge: "Próximamente",
    img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 106,
    name: "Reflector LED para exterior 50 W",
    price: 49.90,
    desc: "Iluminación de bajo consumo para patios, talleres y zonas de trabajo.",
    badge: "Nuevo",
    img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 107,
    name: "Manguera reforzada para jardín (15 m)",
    price: 69.90,
    desc: "Manguera flexible y resistente para riego y limpieza de exteriores.",
    badge: "Próximamente",
    img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 108,
    name: "Set de llaves combinadas (8 piezas)",
    price: 74.90,
    desc: "Juego de llaves métricas para trabajos de ajuste, montaje y reparación.",
    badge: "Próximamente",
    img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80"
  }
];

// --- RENDERIZAR ÚNICAMENTE PRÓXIMOS LANZAMIENTOS ---
const upcomingGrid = document.getElementById("upcomingProductGrid");
if (upcomingGrid) {
  upcomingGrid.innerHTML = defaultUpcoming.map(prod => `
      <article class="feature-card product-card" style="position:relative;">
        <span class="badge-discount">${prod.badge}</span>
        <div class="product-image-container">
          <img src="${prod.img}" alt="${prod.name}" class="product-img">
        </div>
        <h3>${prod.name}</h3>
        <p>${prod.desc}</p>
        <div class="product-footer">
          <span class="product-price">Precio estimado: S/. ${parseFloat(prod.price).toFixed(2)}</span>
          <a href="https://wa.me/51999999999?text=Hola%20FerreMax!%20Quiero%20consultar%20cuando%20este%20disponible:%20${encodeURIComponent(prod.name)}" target="_blank" class="btn btn-outline" style="padding:6px 14px; font-size:0.85rem;">Consultar</a>
        </div>
      </article>
    `).join("");
}
