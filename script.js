/**
 * FerreMax - Ferretería y Construcción
 * Script Principal: Carrusel, Navegación Móvil, Catálogo con Filtros, Carrito de Compras y Contacto
 * Vanilla JavaScript (Sin dependencias externas)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURACIÓN GLOBAL Y TELÉFONO DE ATENCIÓN
  // ==========================================================================
  const WHATSAPP_PHONE = '51984110884';
  const fallbackImg = 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80';

  // ==========================================================================
  // 2. NAVEGACIÓN MÓVIL Y HEADER STICKY
  // ==========================================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const mainHeader = document.getElementById('mainHeader');

  function openMobileMenu() {
    if (!hamburgerBtn || !navMenu) return;
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-open');
    if (menuBackdrop) menuBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!hamburgerBtn || !navMenu) return;
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    if (menuBackdrop) menuBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu && navMenu.classList.contains('is-open');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Cerrar menú móvil al hacer clic en un enlace de navegación
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  });

  // Cerrar con Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navMenu && navMenu.classList.contains('is-open')) closeMobileMenu();
      closeCart();
    }
  });

  // Efecto Sticky en Header al hacer scroll
  function handleHeaderScroll() {
    if (!mainHeader) return;
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      // En páginas secundarias mantenemos scrolled siempre si así lo amerita
      const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
      if (isIndex) {
        mainHeader.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ==========================================================================
  // 3. CARRUSEL / HERO SLIDER (Solo en páginas con .hero-slider)
  // ==========================================================================
  const sliderSection = document.querySelector('.hero-slider');
  if (sliderSection) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const progressBar = document.getElementById('sliderProgressBar');
    const SLIDE_INTERVAL = 5000;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;
    let progressAnimation = null;
    let isPaused = false;

    function goToSlide(newIndex) {
      if (totalSlides === 0) return;
      if (newIndex >= totalSlides) newIndex = 0;
      else if (newIndex < 0) newIndex = totalSlides - 1;

      slides[currentIndex]?.classList.remove('active');
      dots[currentIndex]?.classList.remove('active');
      dots[currentIndex]?.setAttribute('aria-selected', 'false');

      currentIndex = newIndex;

      slides[currentIndex]?.classList.add('active');
      dots[currentIndex]?.classList.add('active');
      dots[currentIndex]?.setAttribute('aria-selected', 'true');

      resetAutoplayTimer();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    function startProgressBar() {
      if (!progressBar) return;
      if (progressAnimation) progressAnimation.cancel();
      progressBar.style.width = '0%';
      progressAnimation = progressBar.animate([
        { width: '0%' },
        { width: '100%' }
      ], {
        duration: SLIDE_INTERVAL,
        easing: 'linear',
        fill: 'forwards'
      });
    }

    function resetAutoplayTimer() {
      clearInterval(autoplayTimer);
      startProgressBar();
      if (!isPaused) {
        autoplayTimer = setInterval(nextSlide, SLIDE_INTERVAL);
      }
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    sliderSection.addEventListener('mouseenter', () => {
      isPaused = true;
      clearInterval(autoplayTimer);
      if (progressAnimation) progressAnimation.pause();
    });

    sliderSection.addEventListener('mouseleave', () => {
      isPaused = false;
      if (progressAnimation) progressAnimation.play();
      autoplayTimer = setInterval(nextSlide, SLIDE_INTERVAL);
    });

    resetAutoplayTimer();
  }

  // ==========================================================================
  // 4. DATOS MAESTROS DE PRODUCTOS
  // ==========================================================================
  const defaultCatalog = [
    {
      id: 1,
      name: "Clavos de acero 2 pulgadas (1 kg)",
      category: "construccion",
      price: 12.90,
      desc: "Clavos resistentes para trabajos de carpintería, reparaciones y construcción.",
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      name: "Martillo de uña 16 oz",
      category: "herramientas",
      price: 28.50,
      desc: "Martillo con mango ergonómico, ideal para clavar y retirar clavos.",
      img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      name: "Juego de destornilladores (6 piezas)",
      category: "herramientas",
      price: 35.00,
      desc: "Set con puntas planas y Phillips para tareas de instalación y mantenimiento.",
      img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      name: "Taladro percutor 650 W",
      category: "herramientas",
      price: 189.90,
      desc: "Taladro con función percutora para perforar madera, metal y mampostería.",
      img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      name: "Tornillos para madera 2 pulgadas (100 unidades)",
      category: "construccion",
      price: 16.90,
      desc: "Tornillos galvanizados con punta fina para fijaciones firmes en madera.",
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      name: "Cinta métrica profesional 5 m",
      category: "herramientas",
      price: 19.90,
      desc: "Cinta retráctil con seguro y gancho metálico para mediciones precisas.",
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 7,
      name: "Pintura látex blanca (1 galón)",
      category: "pintura",
      price: 59.90,
      desc: "Pintura para interiores de buen rendimiento y acabado uniforme.",
      img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 8,
      name: "Guantes de seguridad reforzados",
      category: "seguridad",
      price: 18.00,
      desc: "Guantes resistentes para proteger las manos durante trabajos de mantenimiento.",
      img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 9,
      name: "Llave inglesa ajustable 10 pulgadas",
      category: "plomeria",
      price: 32.90,
      desc: "Llave ajustable para apretar y aflojar tuercas y conexiones de plomería.",
      img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 10,
      name: "Cable eléctrico calibre 12 (por metro)",
      category: "electricidad",
      price: 4.50,
      desc: "Cable de cobre para instalaciones eléctricas, disponible por metro.",
      img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 11,
      name: "Cemento de uso general (bolsa 42.5 kg)",
      category: "construccion",
      price: 29.90,
      desc: "Cemento para preparar concreto, mortero y realizar trabajos de albañilería.",
      img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 12,
      name: "Cinta aislante negra",
      category: "electricidad",
      price: 4.90,
      desc: "Cinta aislante flexible para trabajos eléctricos y reparaciones generales.",
      img: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80"
    }
  ];

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

  // Persistencia y actualización inteligente del catálogo
  function getCatalogProducts() {
    const raw = localStorage.getItem("ferremax_catalog_v1");
    if (!raw) {
      localStorage.setItem("ferremax_catalog_v1", JSON.stringify(defaultCatalog));
      return defaultCatalog;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultCatalog;
    }
  }

  // Acceso compartido al catálogo para el panel de administración (admin.js)
  window.FerreMaxCatalog = {
    KEY: "ferremax_catalog_v1",
    get: getCatalogProducts,
    reset() {
      localStorage.setItem("ferremax_catalog_v1", JSON.stringify(defaultCatalog));
    }
  };

  // ==========================================================================
  // 5. SISTEMA DEL CARRITO DE COMPRAS
  // ==========================================================================
  const cartBtn = document.getElementById("cartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartBackdrop = document.getElementById("cartBackdrop");
  const cartCloseBtn = document.getElementById("cartCloseBtn");
  const cartBadge = document.getElementById("cartBadge");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartTotalPrice = document.getElementById("cartTotalPrice");
  const btnCheckoutCart = document.getElementById("btnCheckoutCart");
  const btnCheckoutWhatsApp = document.getElementById("btnCheckoutWhatsApp");

  function getCart() {
    try {
      const raw = localStorage.getItem("ferremax_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("ferremax_cart", JSON.stringify(cart));
    renderCartUI();
  }

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add("is-active");
    if (cartBackdrop) cartBackdrop.classList.add("is-active");
    document.body.style.overflow = "hidden";
    renderCartUI();
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove("is-active");
    if (cartBackdrop) cartBackdrop.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        img: item.img || fallbackImg,
        quantity: 1
      });
    }
    saveCart(cart);
    openCart();
  }

  function updateCartQty(id, delta) {
    const cart = getCart();
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      const idx = cart.indexOf(item);
      cart.splice(idx, 1);
    }
    saveCart(cart);
  }

  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(c => c.id !== id);
    saveCart(cart);
  }

  function renderCartUI() {
    const cart = getCart();
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Actualizar badge
    document.querySelectorAll(".cart-badge").forEach(b => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? "flex" : "none";
    });

    if (cartTotalPrice) {
      cartTotalPrice.textContent = `S/. ${totalPrice.toFixed(2)}`;
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <span>🔧</span>
          <h4>Tu carrito está vacío</h4>
          <p>Explora el catálogo y agrega herramientas y materiales.</p>
        </div>
      `;
      return;
    }

    cartItemsList.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-name" title="${item.name}">${item.name}</h4>
          <div class="cart-item-price">S/. ${(item.price * item.quantity).toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="cart-qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Disminuir">-</button>
            <span class="cart-qty-num">${item.quantity}</span>
            <button class="cart-qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Aumentar">+</button>
            <button class="cart-remove-btn btn-item-remove" data-id="${item.id}" title="Eliminar producto">🗑️</button>
          </div>
        </div>
      </div>
    `).join("");

    // Listeners para los botones dentro del carrito
    cartItemsList.querySelectorAll(".btn-qty-minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        updateCartQty(id, -1);
      });
    });

    cartItemsList.querySelectorAll(".btn-qty-plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        updateCartQty(id, 1);
      });
    });

    cartItemsList.querySelectorAll(".btn-item-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        removeFromCart(id);
      });
    });
  }

  // 1. Abrir Pasarela de Pago Segura en Pestaña Aparte (Simulada bajo normas)
  if (btnCheckoutCart) {
    btnCheckoutCart.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Tu carrito de compras está vacío. Agrega al menos un producto.");
        return;
      }
      // Abrir la pasarela de pago en pestaña aparte
      window.open("pasarela.html", "_blank");
    });
  }

  // 2. Opción alternativa: Pedir / Coordinar por WhatsApp directamente
  if (btnCheckoutWhatsApp) {
    btnCheckoutWhatsApp.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Tu carrito de compras está vacío. Agrega al menos un producto.");
        return;
      }

      let message = "🔧 *¡Hola FerreMax! Quiero consultar por estos productos:*%0A%0A";
      let total = 0;

      cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `${index + 1}. *${item.name}* x${item.quantity} - S/. ${subtotal.toFixed(2)}%0A`;
      });

      message += `%0A--------------------------------%0A`;
      message += `*Total estimado:* S/. ${total.toFixed(2)}%0A%0A`;
      message += "¿Me confirman la disponibilidad y el tiempo de entrega, por favor?";

      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
      window.open(waUrl, "_blank");
    });
  }

  // Inicializar estado del carrito al cargar
  renderCartUI();

  // ==========================================================================
  // 6. RENDER CATÁLOGO GENERAL CON BÚSQUEDA Y FILTROS POR CATEGORÍA
  // ==========================================================================
  const catalogGrid = document.getElementById("catalogProductGrid");
  const searchInput = document.getElementById("catalogSearchInput");
  const btnClearSearch = document.getElementById("btnClearSearch");
  const filterChips = document.querySelectorAll(".filter-chip");

  let activeCategory = "todos";
  let searchQuery = "";

  function renderCatalogFiltered() {
    if (!catalogGrid) return;
    const allProducts = getCatalogProducts();

    const filtered = allProducts.filter(prod => {
      const matchCategory = activeCategory === "todos" || prod.category === activeCategory;
      const term = searchQuery.toLowerCase().trim();
      const matchSearch = !term ||
        prod.name.toLowerCase().includes(term) ||
        prod.desc.toLowerCase().includes(term);

      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--color-cream-muted);">
          <span style="font-size: 3rem; display: block; margin-bottom: 12px;">🔍</span>
          <h3 style="color: var(--color-cream-light); margin-bottom: 8px;">No se encontraron productos</h3>
          <p>Prueba con otro término de búsqueda o selecciona otra categoría.</p>
        </div>
      `;
      return;
    }

    catalogGrid.innerHTML = filtered.map(prod => `
      <article class="feature-card product-card">
        <div class="product-image-container">
          <img src="${prod.img || fallbackImg}" alt="${prod.name}" class="product-img" loading="lazy">
        </div>
        <h3>${prod.name}</h3>
        <p>${prod.desc}</p>
        <div class="product-footer">
          <span class="product-price">S/. ${parseFloat(prod.price).toFixed(2)}</span>
          <div class="product-action-btns">
            <button class="btn-add-cart" data-id="${prod.id}" title="Añadir a la canasta">🛒 Agregar</button>
            <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hola%20FerreMax!%20Quiero%20consultar%20por:%20${encodeURIComponent(prod.name)}"
              target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:6px 14px; font-size:0.85rem;">
              Pedir Directo
            </a>
          </div>
        </div>
      </article>
    `).join("");

    // Conectar botones de "Agregar al Carrito"
    catalogGrid.querySelectorAll(".btn-add-cart").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const prod = allProducts.find(p => p.id === id);
        if (prod) addToCart(prod);
      });
    });
  }

  if (catalogGrid) {
    renderCatalogFiltered();

    // Filtros de categoría
    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        activeCategory = chip.getAttribute("data-category") || "todos";
        renderCatalogFiltered();
      });
    });

    // Búsqueda en vivo
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (btnClearSearch) {
          btnClearSearch.style.display = searchQuery ? "block" : "none";
        }
        renderCatalogFiltered();
      });
    }

    if (btnClearSearch) {
      btnClearSearch.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        btnClearSearch.style.display = "none";
        searchInput.focus();
        renderCatalogFiltered();
      });
    }
  }

  // ==========================================================================
  // 7. RENDER OFERTAS ESPECIALES
  // ==========================================================================
  const offersGrid = document.getElementById("offersProductGrid");
  const btnRegenerate = document.getElementById("btnRegenerateDiscounts");

  function renderOffers() {
    if (!offersGrid) return;
    const products = getCatalogProducts();

    offersGrid.innerHTML = products.map(prod => {
      const discountPercent = [15, 20, 25, 30][Math.floor(Math.random() * 4)];
      const originalPrice = parseFloat(prod.price);
      const discountedPrice = originalPrice * (1 - discountPercent / 100);

      return `
        <article class="feature-card product-card" style="position:relative;">
          <span class="badge-discount">-${discountPercent}% OFF</span>
          <div class="product-image-container">
            <img src="${prod.img || fallbackImg}" alt="${prod.name}" class="product-img" loading="lazy">
          </div>
          <h3>${prod.name}</h3>
          <p>${prod.desc}</p>
          <div class="product-footer">
            <div>
              <span class="old-price">S/. ${originalPrice.toFixed(2)}</span>
              <span class="product-price">S/. ${discountedPrice.toFixed(2)}</span>
            </div>
            <div class="product-action-btns">
              <button class="btn-add-cart btn-add-offer"
                data-id="${prod.id}"
                data-name="${prod.name} (-${discountPercent}% OFF)"
                data-price="${discountedPrice.toFixed(2)}"
                data-img="${prod.img}"
                title="Añadir oferta a la canasta">🛒 Agregar</button>
              <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hola%20FerreMax!%20Quiero%20consultar%20por%20la%20oferta%20de:%20${encodeURIComponent(prod.name)}%20con%20descuento%20de%20${discountPercent}%25%20(S/.%20${discountedPrice.toFixed(2)})"
                target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:6px 14px; font-size:0.85rem;">
                Aprovechar
              </a>
            </div>
          </div>
        </article>
      `;
    }).join("");

    offersGrid.querySelectorAll(".btn-add-offer").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const name = btn.getAttribute("data-name");
        const price = parseFloat(btn.getAttribute("data-price"));
        const img = btn.getAttribute("data-img");
        addToCart({ id, name, price, img });
      });
    });
  }

  if (offersGrid) {
    renderOffers();
    if (btnRegenerate) {
      btnRegenerate.addEventListener("click", () => {
        renderOffers();
        btnRegenerate.classList.add("btn-pulsing");
        setTimeout(() => btnRegenerate.classList.remove("btn-pulsing"), 500);
      });
    }
  }

  // ==========================================================================
  // 8. RENDER PRÓXIMOS LANZAMIENTOS
  // ==========================================================================
  const upcomingGrid = document.getElementById("upcomingProductGrid");
  if (upcomingGrid) {
    upcomingGrid.innerHTML = defaultUpcoming.map(prod => `
      <article class="feature-card product-card" style="position:relative;">
        <span class="badge-discount">${prod.badge}</span>
        <div class="product-image-container">
          <img src="${prod.img}" alt="${prod.name}" class="product-img" loading="lazy">
        </div>
        <h3>${prod.name}</h3>
        <p>${prod.desc}</p>
        <div class="product-footer">
          <span class="product-price" style="font-size:0.95rem;">Precio estimado: S/. ${parseFloat(prod.price).toFixed(2)}</span>
          <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hola%20FerreMax!%20Quiero%20consultar%20cuando%20este%20disponible:%20${encodeURIComponent(prod.name)}"
            target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding:6px 14px; font-size:0.85rem;">
            Consultar disponibilidad
          </a>
        </div>
      </article>
    `).join("");
  }

  // ==========================================================================
  // 9. FORMULARIO DE CONTACTO BOUTIQUE
  // ==========================================================================
  const formContactoPage = document.getElementById("formContactoPage");
  const mensajeExito = document.getElementById("mensajeExito");

  if (formContactoPage) {
    formContactoPage.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombre")?.value.trim() || "";
      const telefono = document.getElementById("telefono")?.value.trim() || "";
      const correo = document.getElementById("correo")?.value.trim() || "";
      const motivo = document.getElementById("motivo")?.value || "";
      const mensaje = document.getElementById("mensaje")?.value.trim() || "";

      if (mensajeExito) {
        mensajeExito.style.display = "block";
        mensajeExito.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      formContactoPage.reset();

      // Opción de enviar directamente a WhatsApp tras 1.2 segundos
      setTimeout(() => {
        const confirmSend = confirm("¿Deseas enviar también tu mensaje directamente a nuestro WhatsApp oficial para atención inmediata?");
        if (confirmSend) {
          const waText = `🔧 *Consulta web FerreMax*%0A%0A*Nombre:* ${encodeURIComponent(nombre)}%0A*Teléfono:* ${encodeURIComponent(telefono)}%0A*Correo:* ${encodeURIComponent(correo)}%0A*Motivo:* ${encodeURIComponent(motivo)}%0A*Mensaje:* ${encodeURIComponent(mensaje)}`;
          window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${waText}`, "_blank");
        }
      }, 1200);
    });
  }
});
