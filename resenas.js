(function (root) {
  'use strict';

  const REVIEWS_KEY = 'ferremax_reviews_v1';

  function createReviewStore(storage) {
    function list() {
      const raw = storage.getItem(REVIEWS_KEY);
      if (!raw) return [];
      const reviews = JSON.parse(raw);
      if (!Array.isArray(reviews)) throw new Error('El almacenamiento de reseñas no tiene un formato válido.');
      return reviews;
    }

    function add(review) {
      if (!review || typeof review.author !== 'string' || typeof review.productName !== 'string' ||
        typeof review.message !== 'string' || typeof review.createdAt !== 'string') {
        throw new TypeError('La reseña no tiene los datos requeridos.');
      }

      const reviews = list();
      reviews.unshift(review);
      storage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
      return reviews;
    }

    return { list, add };
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createReviewStore, escapeHTML, REVIEWS_KEY };
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const auth = root.FerreAuth;
    const catalog = root.FerreMaxCatalog;
    const formSection = document.getElementById('reviewFormSection');
    const loginPrompt = document.getElementById('reviewLoginPrompt');
    const form = document.getElementById('reviewForm');
    const productField = document.getElementById('reviewProduct');
    const messageField = document.getElementById('reviewMessage');
    const characterCount = document.getElementById('reviewCharacterCount');
    const imageField = document.getElementById('reviewImage');
    const imagePreview = document.getElementById('reviewImagePreview');
    const imagePreviewImg = document.getElementById('reviewImagePreviewImg');
    const removeImageButton = document.getElementById('removeReviewImage');
    const alertBox = document.getElementById('reviewAlert');
    const reviewList = document.getElementById('reviewList');
    const reviewCount = document.getElementById('reviewCount');
    const store = createReviewStore(root.localStorage);
    const session = auth && auth.getSession();
    const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    const maxImageBytes = 5 * 1024 * 1024;
    const maxImageDimension = 1000;
    const maxStoredImageLength = 500000;
    let selectedImage = null;

    if (session) {
      formSection.hidden = false;
      loginPrompt.hidden = true;
    }

    function showAlert(message, type) {
      alertBox.textContent = message;
      alertBox.className = 'auth-alert auth-alert-' + type;
      alertBox.hidden = false;
    }

    function isSafeImage(dataUrl) {
      return typeof dataUrl === 'string' && /^data:image\/(?:webp|jpeg|png);base64,/i.test(dataUrl);
    }

    function formatDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
      return date.toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
    }

    function renderReviews() {
      let reviews;
      try {
        reviews = store.list();
      } catch {
        reviewList.innerHTML = '<p class="review-empty">No se pudieron leer las reseñas guardadas en este navegador.</p>';
        reviewCount.textContent = 'Reseñas no disponibles';
        return;
      }

      reviewCount.textContent = reviews.length + (reviews.length === 1 ? ' reseña' : ' reseñas');
      if (reviews.length === 0) {
        reviewList.innerHTML = '<p class="review-empty">Todavía no hay reseñas. ¡Sé la primera persona en compartir su experiencia!</p>';
        return;
      }

      reviews.sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
      reviewList.innerHTML = reviews.map(review => {
        const image = isSafeImage(review.image)
          ? `<img class="review-card-image" src="${escapeHTML(review.image)}" alt="Imagen adjunta a la reseña de ${escapeHTML(review.productName)}" loading="lazy">`
          : '';
        const message = escapeHTML(review.message).replace(/\r?\n/g, '<br>');
        return `
          <article class="review-card">
            <div class="review-card-heading">
              <div>
                <strong>${escapeHTML(review.author || 'Cliente FerreMax')}</strong>
                <span class="review-product-tag">${escapeHTML(review.productName || 'Producto')}</span>
              </div>
              <time datetime="${escapeHTML(review.createdAt || '')}">${escapeHTML(formatDate(review.createdAt))}</time>
            </div>
            <p class="review-card-message">${message}</p>
            ${image}
          </article>`;
      }).join('');
    }

    function loadProducts() {
      if (!catalog || !productField) {
        showAlert('No fue posible cargar el catálogo de productos.', 'error');
        return;
      }

      const products = catalog.get();
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = String(product.id);
        option.textContent = product.name;
        productField.appendChild(option);
      });

      if (products.length === 0) {
        productField.disabled = true;
        showAlert('No hay productos disponibles para reseñar.', 'info');
      }
    }

    function clearSelectedImage() {
      selectedImage = null;
      imageField.value = '';
      imagePreviewImg.removeAttribute('src');
      imagePreview.hidden = true;
    }

    function optimizeImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error('El archivo seleccionado no es una imagen válida.'));
          image.onload = () => {
            const scale = Math.min(1, maxImageDimension / Math.max(image.width, image.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            const context = canvas.getContext('2d');
            if (!context) {
              reject(new Error('No se pudo procesar la imagen en este navegador.'));
              return;
            }

            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            let dataUrl = canvas.toDataURL('image/webp', 0.75);
            if (!dataUrl.startsWith('data:image/webp,')) {
              dataUrl = canvas.toDataURL('image/jpeg', 0.75);
            }
            if (dataUrl.length > maxStoredImageLength) {
              reject(new Error('La imagen sigue siendo demasiado pesada. Elige otra imagen más pequeña.'));
              return;
            }
            resolve(dataUrl);
          };
          image.src = String(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }

    messageField.addEventListener('input', () => {
      characterCount.textContent = String(messageField.value.length);
    });

    imageField.addEventListener('change', async () => {
      const file = imageField.files[0];
      if (!file) return;

      if (!allowedImageTypes.has(file.type)) {
        clearSelectedImage();
        showAlert('Selecciona una imagen JPG, PNG o WebP.', 'error');
        return;
      }
      if (file.size > maxImageBytes) {
        clearSelectedImage();
        showAlert('La imagen debe pesar 5 MB o menos.', 'error');
        return;
      }

      try {
        selectedImage = await optimizeImage(file);
        imagePreviewImg.src = selectedImage;
        imagePreview.hidden = false;
        alertBox.hidden = true;
      } catch (error) {
        clearSelectedImage();
        showAlert(error.message, 'error');
      }
    });

    removeImageButton.addEventListener('click', clearSelectedImage);

    form.addEventListener('submit', event => {
      event.preventDefault();
      const activeSession = auth && auth.getSession();
      if (!activeSession) {
        showAlert('Inicia sesión para publicar una reseña.', 'error');
        loginPrompt.hidden = false;
        formSection.hidden = true;
        return;
      }

      const product = catalog.get().find(item => String(item.id) === productField.value);
      const message = messageField.value.trim();
      if (!product) {
        showAlert('Selecciona un producto del catálogo.', 'error');
        return;
      }
      if (message.length < 10) {
        showAlert('La reseña debe tener al menos 10 caracteres.', 'error');
        messageField.focus();
        return;
      }

      const review = {
        id: Date.now() + '-' + Math.random().toString(36).slice(2),
        author: activeSession.name,
        productId: product.id,
        productName: product.name,
        message,
        image: selectedImage,
        createdAt: new Date().toISOString()
      };

      try {
        store.add(review);
        renderReviews();
        form.reset();
        characterCount.textContent = '0';
        clearSelectedImage();
        showAlert('Tu reseña se publicó en este navegador.', 'success');
      } catch (error) {
        const quotaExceeded = error && (
          error.name === 'QuotaExceededError' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        );
        showAlert(
          quotaExceeded
            ? 'El almacenamiento del navegador está lleno. Quita una imagen o reseña antes de volver a publicar.'
            : 'No se pudo guardar la reseña: ' + (error.message || 'error de almacenamiento.'),
          'error'
        );
      }
    });

    loadProducts();
    renderReviews();
  });
})(typeof window !== 'undefined' ? window : globalThis);
