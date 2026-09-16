/**
 * SUPKEIKS - Pastelería Boutique & Repostería Fina
 * Script Principal: Carrusel, Navegación Móvil, Catálogo con Filtros, Carrito de Compras y Contacto
 * Vanilla JavaScript (Sin dependencias externas)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURACIÓN GLOBAL Y TELÉFONO DE ATENCIÓN
  // ==========================================================================
  const WHATSAPP_PHONE = '51984110884';
  const fallbackImg = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';

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
      name: "Torta de Chocolate & Frutas Frescas",
      category: "tortas",
      price: 45.00,
      desc: "Bizcocho húmedo de chocolate al 70%, relleno de fudge artesanal y coronado con fresas y arándanos frescos.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsldGvLLzi6-UunPavJsr1TSlk1dJNXZ2jXr5cWkpoeWRUAphWoixQzVA&s=10"
    },
    {
      id: 2,
      name: "Torta Clásica de Manjar Blanco",
      category: "tortas",
      price: 65.00,
      desc: "Esponjoso bizcochuelo de vainilla bañado en almíbar, con generosas capas de manjar blanco de olla tradicional.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2PnaVRDyi5g0pVp0Lly2yWxzvOwEOEPohEdPfDygopVyJnVSj6VXLie0&s=10"
    },
    {
      id: 3,
      name: "Cheesecake Horneado de Fresa",
      category: "cheesecakes",
      price: 45.00,
      desc: "Base crocante de galletas de mantequilla, crema de queso suave horneada y coulis natural de fresas silvestres.",
      img: "https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/7f9ebeaceea909a80306da27f0495c59.jpg"
    },
    {
      id: 4,
      name: "Torta Tres Leches Tradicional",
      category: "tortas",
      price: 50.00,
      desc: "Bizcocho súper húmedo infusionado en nuestra mezcla secreta de tres leches y canela, con merengue suizo flameado.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJi2FjNiekEyNyDn_JvSCY0GBciybCspPMBFqIdEA-OHqq9CklTrJjnv5D&s=10"
    },
    {
      id: 5,
      name: "Torta de Zanahoria, Nueces & Canela",
      category: "tortas",
      price: 40.00,
      desc: "Textura tierna y especiada con zanahorias ralladas, nueces crocantes y suave cobertura de frosting de queso crema.",
      img: "https://peopleenespanol.com/thmb/yy2sl47SGlJH0dIZGZqADJ3FggQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pastel-de-zanahoria-con-nuez-2000-41c58bf044c0418d8694ffb720d29e85.jpg"
    },
    {
      id: 6,
      name: "Pie de Limón Artesanal",
      category: "tartas",
      price: 50.00,
      desc: "Masa quebrada crujiente con crema cítrica de limones peruanos seleccionados y copete de merengue dorado.",
      img: "https://www.recetasnestle.com.pe/sites/default/files/srh_recipes/048eaabd06e27a57624b5ed079537b08.jpg"
    },
    {
      id: 7,
      name: "Cupcakes de Vainilla Francesa (x6)",
      category: "cupcakes",
      price: 42.00,
      desc: "Masa esponjosa con extracto de vainilla pura de Madagascar, frosting sedoso de buttercream y perlas dulces.",
      img: "https://www.clarin.com/2021/04/29/9lAb2baoa_1200x0__1.jpg"
    },
    {
      id: 8,
      name: "Cupcakes de Choco-Avellana (x6)",
      category: "cupcakes",
      price: 55.00,
      desc: "Bizcocho intenso de chocolate belga relleno de crema de avellanas y coronado con rosetón de chocolate.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs8eAG0-q6jIK9aTfb2Robeq0ATqIIgd7rdvEi0kawgZXk9dABl791AZM&s=10"
    },
    {
      id: 9,
      name: "Torta Selva Negra Gourmet",
      category: "tortas",
      price: 48.00,
      desc: "Capas de bizcocho de cacao fino, crema chantilly fresca, cerezas maceradas en licor y virutas de chocolate amargo.",
      img: "https://www.infobae.com/resizer/v2/WYA2IKFGGJH3VJNMLKDHP57EKI.jpg?auth=d4158258757a240a168e3dd66a230ff2faf0316f2e9f2a13cbc0c18afdba1ba0&smart=true&width=1200&height=900&quality=85"
    },
    {
      id: 10,
      name: "Tarta de Frutas de Estación",
      category: "tartas",
      price: 35.00,
      desc: "Crocante masa sablée rellena de suave crema pastelera perfumada con vainilla y abundante fruta fresca glaseada.",
      img: "https://cocinerosargentinos.com/content/recipes/500x500/recipes.20239.jpg"
    },
    {
      id: 11,
      name: "Torta Mousse de Maracuyá",
      category: "cheesecakes",
      price: 60.00,
      desc: "Textura aireada y refrescante con reducción natural de maracuyá sobre fina base húmeda de bizcochuelo.",
      img: "https://cheesecakeoriginal.com/wp-content/uploads/2025/01/Mousse-Maracuya-mediano-delivery.webp"
    },
    {
      id: 12,
      name: "Brownie con Fudge & Pecanas",
      category: "individuales",
      price: 25.00,
      desc: "Porción generosa de brownie chocolatoso de centro melcochudo, bañado con fudge de olla caliente y pecanas tostadas.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf-Yeqn7GtHDYfCN8a_8uoAQvpDxKNyESpUe2mGui_1CzZ356Wb1vXggY&s=10"
    }
  ];

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

  // Persistencia y actualización inteligente del catálogo
  function getCatalogProducts() {
    const raw = localStorage.getItem("supkeiks_catalog_v2");
    if (!raw) {
      localStorage.setItem("supkeiks_catalog_v2", JSON.stringify(defaultCatalog));
      return defaultCatalog;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultCatalog;
    }
  }

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

  function getCart() {
    try {
      const raw = localStorage.getItem("supkeiks_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("supkeiks_cart", JSON.stringify(cart));
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
          <span>🧁</span>
          <h4>Tu carrito está vacío</h4>
          <p>Explora nuestro catálogo y agrega tus dulces favoritos.</p>
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

  // Finalizar pedido por WhatsApp con mensaje consolidado
  if (btnCheckoutCart) {
    btnCheckoutCart.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Tu carrito de compras está vacío. Agrega al menos un producto.");
        return;
      }

      let message = "🧁 *¡Hola SUPKEIKS! Deseo realizar el siguiente pedido:*%0A%0A";
      let total = 0;

      cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `${index + 1}. *${item.name}* x${item.quantity} - S/. ${subtotal.toFixed(2)}%0A`;
      });

      message += `%0A--------------------------------%0A`;
      message += `*Total estimado:* S/. ${total.toFixed(2)}%0A%0A`;
      message += "¿Me confirman la disponibilidad y el tiempo de entrega/delivery por favor?";

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
            <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hola%20SUPKEIKS!%20Deseo%20comprar:%20${encodeURIComponent(prod.name)}"
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
              <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hola%20SUPKEIKS!%20Deseo%20la%20oferta%20de%20${encodeURIComponent(prod.name)}%20con%20descuento%20de%20${discountPercent}%25%20(S/.%20${discountedPrice.toFixed(2)})"
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
        <span class="badge-discount" style="background:#D4A373; color:#140E0C; font-weight:700;">${prod.badge}</span>
        <div class="product-image-container">
          <img src="${prod.img}" alt="${prod.name}" class="product-img" loading="lazy">
        </div>
        <h3>${prod.name}</h3>
        <p>${prod.desc}</p>
        <div class="product-footer">
          <span class="product-price" style="font-size:0.95rem;">Precio Est.: S/. ${parseFloat(prod.price).toFixed(2)}</span>
          <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hola%20SUPKEIKS!%20Deseo%20que%20me%20notifiquen%20cuando%20se%20lance:%20${encodeURIComponent(prod.name)}"
            target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding:6px 14px; font-size:0.85rem;">
            Notificarme 🔔
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
          const waText = `🧁 *Consulta Web SUPKEIKS*%0A%0A*Nombre:* ${encodeURIComponent(nombre)}%0A*Teléfono:* ${encodeURIComponent(telefono)}%0A*Correo:* ${encodeURIComponent(correo)}%0A*Motivo:* ${encodeURIComponent(motivo)}%0A*Mensaje:* ${encodeURIComponent(mensaje)}`;
          window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${waText}`, "_blank");
        }
      }, 1200);
    });
  }
});
