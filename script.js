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
document.addEventListener("DOMContentLoaded", () => {
  // 1. Array inicial de productos
  const defaultCatalog = [
    {
      id: 1,
      name: "Torta Chocolate con frutas",
      price: 45.00,
      desc: "Una torta de chocolate en la cual podrás probar el verdadero sabor de casa",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsldGvLLzi6-UunPavJsr1TSlk1dJNXZ2jXr5cWkpoeWRUAphWoixQzVA&s=10"
    },
    {
      id: 2,
      name: "Torta de manjar",
      price: 110.00,
      desc: "Dulce para el paladar",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2PnaVRDyi5g0pVp0Lly2yWxzvOwEOEPohEdPfDygopVyJnVSj6VXLie0&s=10"
    },
    {
      id: 3,
      name: "Cheesecake de Fresa",
      price: 45.00,
      desc: "Que mejor combinación que esta",
      img: "https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/7f9ebeaceea909a80306da27f0495c59.jpg"
    },
    {
      id: 4,
      name: "Torta Tres Leches",
      price: 50.00,
      desc: "Simple pero efectiva",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJi2FjNiekEyNyDn_JvSCY0GBciybCspPMBFqIdEA-OHqq9CklTrJjnv5D&s=10"
    },
    {
      id: 5,
      name: "Torta de Zanahoria & Nuez",
      price: 40.00,
      desc: "Apto para veganos con un precio de vegano",
      img: "https://peopleenespanol.com/thmb/yy2sl47SGlJH0dIZGZqADJ3FggQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pastel-de-zanahoria-con-nuez-2000-41c58bf044c0418d8694ffb720d29e85.jpg"
    },
    {
      id: 6,
      name: "Pie de Limón Artesanal",
      price: 50.00,
      desc: "El limon para ceviche nomas",
      img: "https://www.recetasnestle.com.pe/sites/default/files/srh_recipes/048eaabd06e27a57624b5ed079537b08.jpg"
    },
    {
      id: 7,
      name: "Cupcakes de Vainilla Francesa (x6)",
      price: 42.00,
      desc: "Son 6 x el precio de 1 que esperas, incluso su division es perfecta",
      img: "https://www.clarin.com/2021/04/29/9lAb2baoa_1200x0__1.jpg"
    },
    {
      id: 8,
      name: "Cupcakes de Choco-Avellana (x6)",
      price: 70.00,
      desc: "Irresistible",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs8eAG0-q6jIK9aTfb2Robeq0ATqIIgd7rdvEi0kawgZXk9dABl791AZM&s=10"
    },
    {
      id: 9,
      name: "Torta Selva Negra",
      price: 48.00,
      desc: "Tambien cuenta con su propio libro",
      img: "https://www.infobae.com/resizer/v2/WYA2IKFGGJH3VJNMLKDHP57EKI.jpg?auth=d4158258757a240a168e3dd66a230ff2faf0316f2e9f2a13cbc0c18afdba1ba0&smart=true&width=1200&height=900&quality=85"
    },
    {
      id: 10,
      name: "Tarta de Frutas de Estación",
      price: 35.00,
      desc: "Es como ensalada de frutas",
      img: "https://cocinerosargentinos.com/content/recipes/500x500/recipes.20239.jpg"
    },
    {
      id: 11,
      name: "Torta Mousse de Maracuyá",
      price: 70.00,
      desc: "Puedes escupir las pepitas",
      img: "https://cheesecakeoriginal.com/wp-content/uploads/2025/01/Mousse-Maracuya-mediano-delivery.webp"
    },
    {
      id: 12,
      name: "Brownie con Fudge y Pecanas",
      price: 25.00,
      desc: "Necesita descripcion?",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf-Yeqn7GtHDYfCN8a_8uoAQvpDxKNyESpUe2mGui_1CzZ356Wb1vXggY&s=10"
    }
  ];

  const fallbackImg = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80";

  // 2. Persistencia en localStorage
  function getCatalogProducts() {
    const data = localStorage.getItem("supkeiks_catalog");
    if (!data || JSON.parse(data).length === 0) {
      localStorage.setItem("supkeiks_catalog", JSON.stringify(defaultCatalog));
      return defaultCatalog;
    }
    return JSON.parse(data);
  }

  function saveCatalogProducts(prods) {
    localStorage.setItem("supkeiks_catalog", JSON.stringify(prods));
  }

  function getUpcomingProducts() {
    const data = localStorage.getItem("supkeiks_upcoming");
    return data ? JSON.parse(data) : [];
  }

  function saveUpcomingProducts(prods) {
    localStorage.setItem("supkeiks_upcoming", JSON.stringify(prods));
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
          <a href="https://wa.me/51999999999?text=Hola%20SUPKEIKS!%20Deseo%20comprar:%20${encodeURIComponent(prod.name)}" target="_blank" class="btn btn-primary" style="padding:6px 14px; font-size:0.85rem;">Comprar</a>
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
            <a href="https://wa.me/51999999999?text=Hola!%20Deseo%20la%20oferta%20de%20${encodeURIComponent(prod.name)}%20con%20descuento%20de%20${discountPercent}%25" target="_blank" class="btn btn-primary" style="padding:6px 14px; font-size:0.85rem;">Aprovechar</a>
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
      upcomingGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--color-cream-muted); padding: 30px;">No hay productos en espera. Registra uno arriba.</p>`;
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
          <button class="btn btn-primary btn-publish" data-index="${index}" style="padding:6px 12px; font-size:0.82rem;">Lanzar a Catálogo 🚀</button>
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
        alert(`¡"${launched.name}" ha sido agregado al Catálogo y a Ofertas!`);
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
    name: "Línea Macarons Parisinos (Caja x12)",
    price: 55.00,
    desc: "Delicadas galletas francesas rellenas de ganache de pistacho siciliano, maracuyá y salted caramel.",
    badge: "Lanzamiento: Próxima Semana",
    img: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 102,
    name: "Torta Keto & Gluten Free",
    price: 75.00,
    desc: "Bizcocho húmedo a base de harina de almendras, cacao al 80% y endulzado naturalmente con monk fruit.",
    badge: "Línea Saludable",
    img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 103,
    name: "Tartaleta Royale de Pistacho",
    price: 50.00,
    desc: "Masa sableé crocante con crema diplomata de pistacho puro y frambuesas frescas glaseadas.",
    badge: "Edición Especial",
    img: "https://images.unsplash.com/photo-1557308536-ee471ef2c390?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 104,
    name: "Éclairs Franceses Gourmet (Pack x4)",
    price: 38.00,
    desc: "Masa choux tradicional rellena de crema pastelera de vainilla de Madagascar y glaseado de chocolate belga.",
    badge: "En Pruebas",
    img: "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 105,
    name: "Torta Lotus Biscoff & Caramelo",
    price: 85.00,
    desc: "Capas de bizcocho especiado con relleno cremoso y cobertura de galleta Lotus Biscoff crujiente.",
    badge: "Próximo Mes",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz1uNFehRZDr-BcSLbwrEeV9yaS361ahYDC-Jl2PKX3DPC4uVgohoW8C2M&s=10"
  },
  {
    id: 106,
    name: "Pavlova de Frutas del Bosque",
    price: 60.00,
    desc: "Nube crocante de merengue horneado, crema chantilly fresca y reducción artesanal de frutos rojos.",
    badge: "Receta Nueva",
    img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 107,
    name: "Croissants Rellenos de Nutella (Pack x3)",
    price: 32.00,
    desc: "Hojaldre 100% mantequilla francesa con doble fermentación, relleno abundante de avellanas y cacao.",
    badge: "Desayunos & Brunch",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 108,
    name: "Torta Mousse de Baileys & Café",
    price: 78.00,
    desc: "Textura ligera y aireada con infusión de crema de licor irlandés sobre fina base de brownie.",
    badge: "Solo Adultos (+18)",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
  }
];

// --- RENDERIZAR ÚNICAMENTE PRÓXIMOS LANZAMIENTOS ---
const upcomingGrid = document.getElementById("upcomingProductGrid");
if (upcomingGrid) {
  upcomingGrid.innerHTML = defaultUpcoming.map(prod => `
      <article class="feature-card product-card" style="position:relative;">
        <span class="badge-discount" style="background:#d4a373; color:#140e0c;">${prod.badge}</span>
        <div class="product-image-container">
          <img src="${prod.img}" alt="${prod.name}" class="product-img">
        </div>
        <h3>${prod.name}</h3>
        <p>${prod.desc}</p>
        <div class="product-footer">
          <span class="product-price">Precio Est.: S/. ${parseFloat(prod.price).toFixed(2)}</span>
          <a href="https://wa.me/51999999999?text=Hola!%20Deseo%20que%20me%20notifiquen%20cuando%20se%20lance:%20${encodeURIComponent(prod.name)}" target="_blank" class="btn btn-outline" style="padding:6px 14px; font-size:0.85rem;">Notificarme 🔔</a>
        </div>
      </article>
    `).join("");
}
