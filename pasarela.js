/**
 * FerreMax - Pasarela de Pago Segura Simulada
 * Lógica interactiva: Validación de datos, Tarjeta 3D en tiempo real,
 * Billeteras digitales (Yape/Plin), Integración con WhatsApp y Generación de Voucher
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const WHATSAPP_PHONE = '51984110884';
  const SHIPPING_COST = 15.00;

  // Estado del Checkout
  let appliedDiscount = 0; // en porcentaje (ej 0.10)
  let currentDeliveryMethod = 'pickup'; // 'pickup' o 'delivery'
  let currentPaymentMethod = 'card'; // 'card', 'wallet', 'whatsapp'
  let currentWallet = 'yape'; // 'yape' o 'plin'

  // Elementos del DOM
  const checkoutMainContainer = document.getElementById('checkoutMainContainer');
  const checkoutEmptyState = document.getElementById('checkoutEmptyState');
  const summaryItemsList = document.getElementById('summaryItemsList');
  const subtotalElem = document.getElementById('summarySubtotal');
  const igvElem = document.getElementById('summaryIgv');
  const shippingElem = document.getElementById('summaryShipping');
  const discountRow = document.getElementById('summaryDiscountRow');
  const discountElem = document.getElementById('summaryDiscount');
  const totalElem = document.getElementById('summaryTotal');
  const payBtnAmount = document.getElementById('payBtnAmount');
  const btnProcessPayment = document.getElementById('btnProcessPayment');

  // Tarjeta Virtual Preview
  const cardPreviewNumber = document.getElementById('cardPreviewNumber');
  const cardPreviewName = document.getElementById('cardPreviewName');
  const cardPreviewExp = document.getElementById('cardPreviewExp');
  const cardBrandLogo = document.getElementById('cardBrandLogo');

  // Inputs Tarjeta
  const inputCardNumber = document.getElementById('inputCardNumber');
  const inputCardName = document.getElementById('inputCardName');
  const inputCardExp = document.getElementById('inputCardExp');
  const inputCardCvv = document.getElementById('inputCardCvv');
  const selectInstallments = document.getElementById('selectInstallments');

  // Comprobante
  const radioBoleta = document.getElementById('comprobanteBoleta');
  const radioFactura = document.getElementById('comprobanteFactura');
  const facturaFields = document.getElementById('facturaFields');
  const inputDocType = document.getElementById('inputDocType');
  const inputDocNumber = document.getElementById('inputDocNumber');
  const inputFullName = document.getElementById('inputFullName');
  const inputEmail = document.getElementById('inputEmail');
  const inputPhone = document.getElementById('inputPhone');

  // Entrega
  const radioPickup = document.getElementById('deliveryPickup');
  const radioShipping = document.getElementById('deliveryShipping');
  const deliveryFields = document.getElementById('deliveryFields');
  const inputAddress = document.getElementById('inputAddress');
  const inputCity = document.getElementById('inputCity');
  const inputReference = document.getElementById('inputReference');

  // Cupón
  const inputCoupon = document.getElementById('inputCoupon');
  const btnApplyCoupon = document.getElementById('btnApplyCoupon');
  const couponMsg = document.getElementById('couponMsg');

  // Billeteras
  const btnWalletYape = document.getElementById('btnWalletYape');
  const btnWalletPlin = document.getElementById('btnWalletPlin');
  const walletQrImg = document.getElementById('walletQrImg');
  const walletQrAmount = document.getElementById('walletQrAmount');
  const btnCopyPhone = document.getElementById('btnCopyPhone');
  const inputWalletOpCode = document.getElementById('inputWalletOpCode');

  // WhatsApp Tab
  const btnDirectWhatsApp = document.getElementById('btnDirectWhatsApp');

  // Modal Procesamiento y Voucher
  const processingModal = document.getElementById('processingModal');
  const processingStepLog = document.getElementById('processingStepLog');
  const voucherOverlay = document.getElementById('voucherOverlay');
  const vOrderId = document.getElementById('vOrderId');
  const vDate = document.getElementById('vDate');
  const vClientName = document.getElementById('vClientName');
  const vDocType = document.getElementById('vDocType');
  const vDocNum = document.getElementById('vDocNum');
  const vDelivery = document.getElementById('vDelivery');
  const vMethod = document.getElementById('vMethod');
  const vTotal = document.getElementById('vTotal');
  const vAuthCode = document.getElementById('vAuthCode');
  const btnPrintVoucher = document.getElementById('btnPrintVoucher');
  const btnSendVoucherWhatsApp = document.getElementById('btnSendVoucherWhatsApp');

  // ==========================================================================
  // 1. MANEJO DEL CARRITO (Lectura y sincronización)
  // ==========================================================================
  function getCart() {
    try {
      const raw = localStorage.getItem('ferremax_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('ferremax_cart', JSON.stringify(cart));
    renderCheckout();
  }

  function updateItemQty(id, delta) {
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

  function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(c => c.id !== id);
    saveCart(cart);
  }

  // ==========================================================================
  // 2. CÁLCULO DE TOTALES Y RENDER DEL RESUMEN
  // ==========================================================================
  function calculateTotals(cart) {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountAmount = subtotal * appliedDiscount;
    const discountedSubtotal = subtotal - discountAmount;
    
    // En Perú, los precios exhibidos al consumidor en retail ya incluyen IGV (18%)
    // Desglosamos el IGV para efectos de transparencia fiscal y cumplimiento de normas
    const baseImponible = discountedSubtotal / 1.18;
    const igv = discountedSubtotal - baseImponible;

    const shipping = currentDeliveryMethod === 'delivery' ? SHIPPING_COST : 0.00;
    const total = discountedSubtotal + shipping;

    return {
      subtotal,
      discountAmount,
      igv,
      shipping,
      total
    };
  }

  function renderCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
      if (checkoutMainContainer) checkoutMainContainer.style.display = 'none';
      if (checkoutEmptyState) checkoutEmptyState.style.display = 'block';
      return;
    }

    if (checkoutMainContainer) checkoutMainContainer.style.display = 'grid';
    if (checkoutEmptyState) checkoutEmptyState.style.display = 'none';

    // Renderizar productos en el resumen lateral
    if (summaryItemsList) {
      summaryItemsList.innerHTML = cart.map(item => `
        <div class="summary-item-row">
          <img src="${item.img}" alt="${item.name}" class="summary-item-img">
          <div class="summary-item-info">
            <h4 class="summary-item-name" title="${item.name}">${item.name}</h4>
            <div class="summary-item-qty-price">
              S/. ${item.price.toFixed(2)} x 
              <button class="btn-qty-mini" onclick="window.pasarelaUpdateQty(${item.id}, -1)">-</button>
              <strong>${item.quantity}</strong>
              <button class="btn-qty-mini" onclick="window.pasarelaUpdateQty(${item.id}, 1)">+</button>
              <button class="btn-remove-mini" onclick="window.pasarelaRemove(${item.id})" title="Quitar">🗑️</button>
            </div>
          </div>
          <div class="summary-item-total">S/. ${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('');
    }

    // Totales
    const totals = calculateTotals(cart);

    if (subtotalElem) subtotalElem.textContent = `S/. ${totals.subtotal.toFixed(2)}`;
    if (igvElem) igvElem.textContent = `S/. ${totals.igv.toFixed(2)}`;
    if (shippingElem) {
      shippingElem.textContent = totals.shipping === 0 ? '¡Gratis!' : `S/. ${totals.shipping.toFixed(2)}`;
      shippingElem.style.color = totals.shipping === 0 ? '#2ECC71' : 'var(--color-cream-light)';
    }

    if (discountRow && discountElem) {
      if (totals.discountAmount > 0) {
        discountRow.style.display = 'flex';
        discountElem.textContent = `- S/. ${totals.discountAmount.toFixed(2)} (10%)`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (totalElem) totalElem.textContent = `S/. ${totals.total.toFixed(2)}`;
    if (payBtnAmount) payBtnAmount.textContent = `S/. ${totals.total.toFixed(2)}`;
    if (walletQrAmount) walletQrAmount.textContent = `Total a pagar: S/. ${totals.total.toFixed(2)}`;

    // Actualizar cuotas si está en tarjeta
    updateInstallmentsBreakdown(totals.total);
  }

  // Métodos expuestos globalmente para los botones inline del carrito
  window.pasarelaUpdateQty = (id, delta) => updateItemQty(id, delta);
  window.pasarelaRemove = (id) => removeItem(id);

  // ==========================================================================
  // 3. SELECCIÓN DE COMPROBANTE Y ENTREGA
  // ==========================================================================
  if (radioBoleta && radioFactura && facturaFields) {
    radioBoleta.addEventListener('change', () => {
      facturaFields.style.display = 'none';
      if (inputDocType) inputDocType.value = 'DNI';
      updateOptionLabels('comprobanteType');
    });

    radioFactura.addEventListener('change', () => {
      facturaFields.style.display = 'grid';
      if (inputDocType) inputDocType.value = 'RUC';
      updateOptionLabels('comprobanteType');
    });
  }

  if (radioPickup && radioShipping && deliveryFields) {
    radioPickup.addEventListener('change', () => {
      currentDeliveryMethod = 'pickup';
      deliveryFields.style.display = 'none';
      updateOptionLabels('deliveryMethod');
      renderCheckout();
    });

    radioShipping.addEventListener('change', () => {
      currentDeliveryMethod = 'delivery';
      deliveryFields.style.display = 'grid';
      updateOptionLabels('deliveryMethod');
      renderCheckout();
    });
  }

  function updateOptionLabels(name) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
      const label = input.closest('.option-pill-label');
      if (label) {
        if (input.checked) {
          label.classList.add('is-selected');
        } else {
          label.classList.remove('is-selected');
        }
      }
    });
  }

  // ==========================================================================
  // 4. MÉTODOS DE PAGO: TABS
  // ==========================================================================
  const paymentTabButtons = document.querySelectorAll('.payment-tab-btn');
  const paymentPanels = {
    card: document.getElementById('panelCard'),
    wallet: document.getElementById('panelWallet'),
    whatsapp: document.getElementById('panelWhatsApp')
  };

  paymentTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      paymentTabButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const target = btn.getAttribute('data-tab');
      currentPaymentMethod = target;

      Object.keys(paymentPanels).forEach(key => {
        if (paymentPanels[key]) {
          if (key === target) {
            paymentPanels[key].classList.add('is-active');
          } else {
            paymentPanels[key].classList.remove('is-active');
          }
        }
      });

      // Modificar texto del botón principal si es WhatsApp
      if (btnProcessPayment) {
        if (target === 'whatsapp') {
          btnProcessPayment.innerHTML = `<span>Coordinar Pedido por WhatsApp</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.076-2.029-.475-1.708-.704-2.813-2.457-2.899-2.572-.084-.116-.693-.924-.693-1.762 0-.838.438-1.25.594-1.423.156-.172.342-.216.456-.216.114 0 .228.001.328.006.105.006.246-.04.384.292.144.348.492 1.2.535 1.288.043.088.072.19.014.306-.058.116-.087.189-.173.29-.087.102-.183.228-.261.306-.088.087-.179.182-.077.357.102.174.453.748.972 1.21.669.596 1.233.781 1.408.868.174.088.276.073.379-.044.102-.116.438-.51.554-.685.116-.175.233-.146.39-.088.157.058.995.469 1.167.555.172.086.286.13.329.202.043.073.043.42-.101.825zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.396C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>`;
          btnProcessPayment.style.background = '#25D366';
        } else {
          const cart = getCart();
          const totals = calculateTotals(cart);
          btnProcessPayment.innerHTML = `<span>Pagar S/. <span id="payBtnAmount">${totals.total.toFixed(2)}</span></span> <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`;
          btnProcessPayment.style.background = 'var(--color-primary)';
        }
      }
    });
  });

  // ==========================================================================
  // 5. TARJETA INTERACTIVA 3D Y DETECCIÓN AUTOMÁTICA DE MARCA
  // ==========================================================================
  if (inputCardNumber) {
    inputCardNumber.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      // Formatear en bloques de 4
      let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
      e.target.value = formatted;

      // Actualizar tarjeta virtual
      if (cardPreviewNumber) {
        cardPreviewNumber.textContent = formatted || '•••• •••• •••• ••••';
      }

      // Detección de marca por BIN
      detectCardBrand(val);
    });
  }

  function detectCardBrand(digits) {
    if (!cardBrandLogo) return;
    cardBrandLogo.className = 'card-brand-logo';

    if (digits.startsWith('4')) {
      cardBrandLogo.textContent = 'VISA';
      cardBrandLogo.classList.add('visa');
    } else if (/^(5[1-5]|2[2-7])/.test(digits)) {
      cardBrandLogo.textContent = 'Mastercard';
      cardBrandLogo.classList.add('mastercard');
    } else if (/^(34|37)/.test(digits)) {
      cardBrandLogo.textContent = 'AMEX';
      cardBrandLogo.classList.add('amex');
    } else if (digits.length > 0) {
      cardBrandLogo.textContent = 'Tarjeta';
    } else {
      cardBrandLogo.textContent = 'VISA';
    }
  }

  if (inputCardName) {
    inputCardName.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase();
      e.target.value = val;
      if (cardPreviewName) {
        cardPreviewName.textContent = val || 'NOMBRE TITULAR';
      }
    });
  }

  if (inputCardExp) {
    inputCardExp.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        let month = parseInt(val.substring(0, 2), 10);
        if (month > 12) month = 12;
        if (month === 0) month = 1;
        const mmStr = month < 10 ? '0' + month : '' + month;
        val = mmStr + (val.length > 2 ? '/' + val.substring(2) : '/');
      }
      e.target.value = val;
      if (cardPreviewExp) {
        cardPreviewExp.textContent = val || 'MM/AA';
      }
    });
  }

  if (inputCardCvv) {
    inputCardCvv.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }

  function updateInstallmentsBreakdown(total) {
    if (!selectInstallments) return;
    const count = parseInt(selectInstallments.value) || 1;
    const installmentVal = (total / count).toFixed(2);
    // El select mantiene sus opciones
    const opt1 = selectInstallments.querySelector('option[value="1"]');
    const opt3 = selectInstallments.querySelector('option[value="3"]');
    const opt6 = selectInstallments.querySelector('option[value="6"]');
    const opt12 = selectInstallments.querySelector('option[value="12"]');

    if (opt1) opt1.textContent = `1 cuota de S/. ${total.toFixed(2)} (Sin intereses)`;
    if (opt3) opt3.textContent = `3 cuotas de S/. ${(total / 3).toFixed(2)} (Sin intereses)`;
    if (opt6) opt6.textContent = `6 cuotas de S/. ${(total / 6).toFixed(2)}`;
    if (opt12) opt12.textContent = `12 cuotas de S/. ${(total / 12).toFixed(2)}`;
  }

  if (selectInstallments) {
    selectInstallments.addEventListener('change', () => {
      const cart = getCart();
      const totals = calculateTotals(cart);
      updateInstallmentsBreakdown(totals.total);
    });
  }

  // ==========================================================================
  // 6. BILLETERAS DIGITALES (Yape / Plin)
  // ==========================================================================
  if (btnWalletYape && btnWalletPlin) {
    btnWalletYape.addEventListener('click', () => {
      currentWallet = 'yape';
      btnWalletYape.classList.add('is-active');
      btnWalletPlin.classList.remove('is-active');
      generateWalletQr('Yape');
    });

    btnWalletPlin.addEventListener('click', () => {
      currentWallet = 'plin';
      btnWalletPlin.classList.add('is-active');
      btnWalletYape.classList.remove('is-active');
      generateWalletQr('Plin');
    });
  }

  function generateWalletQr(walletName) {
    if (!walletQrImg) return;
    // Generamos un QR SVG estilizado y dinámico representativo con el logo y colores
    const bgColor = walletName === 'Yape' ? '#742284' : '#00A9E0';
    const fgColor = '#FFFFFF';

    const svgQr = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="170" height="170">
        <rect width="200" height="200" fill="#ffffff" rx="12"/>
        <!-- Patrón QR Simulado de Alta Precisión -->
        <rect x="20" y="20" width="45" height="45" fill="${bgColor}" rx="4"/>
        <rect x="26" y="26" width="33" height="33" fill="#fff" rx="2"/>
        <rect x="32" y="32" width="21" height="21" fill="${bgColor}" rx="2"/>

        <rect x="135" y="20" width="45" height="45" fill="${bgColor}" rx="4"/>
        <rect x="141" y="26" width="33" height="33" fill="#fff" rx="2"/>
        <rect x="147" y="32" width="21" height="21" fill="${bgColor}" rx="2"/>

        <rect x="20" y="135" width="45" height="45" fill="${bgColor}" rx="4"/>
        <rect x="26" y="141" width="33" height="33" fill="#fff" rx="2"/>
        <rect x="32" y="147" width="21" height="21" fill="${bgColor}" rx="2"/>

        <!-- Cuadros de datos QR -->
        <rect x="75" y="25" width="10" height="10" fill="#101820"/>
        <rect x="95" y="25" width="10" height="10" fill="#101820"/>
        <rect x="115" y="25" width="10" height="10" fill="#101820"/>

        <rect x="75" y="45" width="10" height="10" fill="#101820"/>
        <rect x="105" y="45" width="10" height="10" fill="#101820"/>

        <rect x="25" y="75" width="10" height="10" fill="#101820"/>
        <rect x="45" y="75" width="10" height="10" fill="#101820"/>
        <rect x="75" y="75" width="50" height="50" fill="${bgColor}" rx="8"/>
        <text x="100" y="105" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">
          ${walletName}
        </text>

        <rect x="135" y="75" width="10" height="10" fill="#101820"/>
        <rect x="155" y="75" width="10" height="10" fill="#101820"/>

        <rect x="75" y="135" width="10" height="10" fill="#101820"/>
        <rect x="95" y="135" width="10" height="10" fill="#101820"/>
        <rect x="115" y="135" width="10" height="10" fill="#101820"/>

        <rect x="85" y="155" width="10" height="10" fill="#101820"/>
        <rect x="135" y="145" width="10" height="10" fill="#101820"/>
        <rect x="155" y="155" width="10" height="10" fill="#101820"/>
        <rect x="145" y="165" width="10" height="10" fill="#101820"/>
      </svg>
    `;
    walletQrImg.innerHTML = svgQr;
  }

  // Generar QR inicial
  generateWalletQr('Yape');

  if (btnCopyPhone) {
    btnCopyPhone.addEventListener('click', () => {
      navigator.clipboard.writeText('984110884').then(() => {
        const orig = btnCopyPhone.textContent;
        btnCopyPhone.textContent = '¡Copiado!';
        btnCopyPhone.style.color = '#2ECC71';
        setTimeout(() => {
          btnCopyPhone.textContent = orig;
          btnCopyPhone.style.color = '';
        }, 2000);
      }).catch(() => {
        alert('Número para transferir: 984 110 884 (FerreMax S.A.C.)');
      });
    });
  }

  // ==========================================================================
  // 7. CUPÓN DE DESCUENTO
  // ==========================================================================
  if (btnApplyCoupon && inputCoupon) {
    btnApplyCoupon.addEventListener('click', () => {
      const code = inputCoupon.value.trim().toUpperCase();
      if (!code) return;

      if (code === 'FERRE10' || code === 'FERREMAX10' || code === 'BIENVENIDA') {
        appliedDiscount = 0.10; // 10%
        if (couponMsg) {
          couponMsg.textContent = '¡Cupón de 10% aplicado con éxito!';
          couponMsg.style.color = '#2ECC71';
        }
        renderCheckout();
      } else {
        if (couponMsg) {
          couponMsg.textContent = 'Cupón no válido o expirado. Prueba con FERRE10';
          couponMsg.style.color = '#E74C3C';
        }
      }
    });
  }

  // ==========================================================================
  // 8. ACCIÓN DIRECTA WHATSAPP
  // ==========================================================================
  function sendOrderViaWhatsApp() {
    const cart = getCart();
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const totals = calculateTotals(cart);
    const clientName = inputFullName ? inputFullName.value.trim() : '';
    const clientPhone = inputPhone ? inputPhone.value.trim() : '';
    const docType = inputDocType ? inputDocType.value : 'DNI';
    const docNum = inputDocNumber ? inputDocNumber.value.trim() : '';
    const compType = radioFactura && radioFactura.checked ? 'Factura Electrónica' : 'Boleta de Venta';

    let msg = `🛒 *PEDIDO OFICIAL FERREMAX* 🛒%0A%0A`;
    if (clientName) msg += `👤 *Cliente:* ${clientName}%0A`;
    if (clientPhone) msg += `📱 *Teléfono:* ${clientPhone}%0A`;
    if (docNum) msg += `📄 *${docType}:* ${docNum}%0A`;
    msg += `📑 *Comprobante:* ${compType}%0A`;
    msg += `🚚 *Entrega:* ${currentDeliveryMethod === 'delivery' ? 'Envío a Domicilio' : 'Retiro en Tienda'}%0A`;

    if (currentDeliveryMethod === 'delivery' && inputAddress) {
      msg += `📍 *Dirección:* ${inputAddress.value.trim()} - ${inputCity ? inputCity.value.trim() : ''}%0A`;
    }

    msg += `%0A*DETALLE DE PRODUCTOS:*%0A`;
    cart.forEach((item, index) => {
      const sub = item.price * item.quantity;
      msg += `${index + 1}. ${item.name} x${item.quantity} = S/. ${sub.toFixed(2)}%0A`;
    });

    msg += `%0A-------------------------------%0A`;
    msg += `*Subtotal:* S/. ${totals.subtotal.toFixed(2)}%0A`;
    if (totals.discountAmount > 0) msg += `*Descuento (10%):* -S/. ${totals.discountAmount.toFixed(2)}%0A`;
    msg += `*Flete:* ${totals.shipping === 0 ? 'Gratis' : 'S/. ' + totals.shipping.toFixed(2)}%0A`;
    msg += `*TOTAL A PAGAR:* S/. ${totals.total.toFixed(2)}%0A%0A`;
    msg += `Deseo coordinar el pago y la fecha de entrega con un asesor de FerreMax.`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
    window.open(url, '_blank');
  }

  if (btnDirectWhatsApp) {
    btnDirectWhatsApp.addEventListener('click', sendOrderViaWhatsApp);
  }

  // ==========================================================================
  // 9. PROCESAMIENTO Y VALIDACIÓN DEL PAGO SIMULADO
  // ==========================================================================
  if (btnProcessPayment) {
    btnProcessPayment.addEventListener('click', () => {
      if (currentPaymentMethod === 'whatsapp') {
        sendOrderViaWhatsApp();
        return;
      }

      // Validar campos del comprador
      const fullName = inputFullName ? inputFullName.value.trim() : '';
      const email = inputEmail ? inputEmail.value.trim() : '';
      const phone = inputPhone ? inputPhone.value.trim() : '';
      const docNum = inputDocNumber ? inputDocNumber.value.trim() : '';
      const termsAccepted = document.getElementById('acceptTerms')?.checked;

      if (!fullName) {
        alert('Por favor ingresa tus Nombres y Apellidos completos.');
        inputFullName?.focus();
        return;
      }

      if (!docNum || docNum.length < 8) {
        alert('Por favor ingresa un número de documento válido (DNI / RUC).');
        inputDocNumber?.focus();
        return;
      }

      if (!email || !email.includes('@')) {
        alert('Por favor ingresa un correo electrónico válido para enviarte el comprobante.');
        inputEmail?.focus();
        return;
      }

      if (!phone || phone.length < 7) {
        alert('Por favor ingresa un número de teléfono o celular de contacto.');
        inputPhone?.focus();
        return;
      }

      // Si es envío a domicilio, validar dirección
      if (currentDeliveryMethod === 'delivery') {
        const address = inputAddress ? inputAddress.value.trim() : '';
        if (!address) {
          alert('Por favor ingresa la dirección exacta para el despacho de tu pedido.');
          inputAddress?.focus();
          return;
        }
      }

      // Si es Factura, validar Razón Social
      if (radioFactura && radioFactura.checked) {
        const rz = document.getElementById('inputRazonSocial')?.value.trim();
        if (!rz) {
          alert('Por favor ingresa la Razón Social de la empresa para la factura.');
          document.getElementById('inputRazonSocial')?.focus();
          return;
        }
      }

      // Validar Método de Pago
      if (currentPaymentMethod === 'card') {
        const cNum = inputCardNumber?.value.replace(/\s/g, '');
        const cName = inputCardName?.value.trim();
        const cExp = inputCardExp?.value.trim();
        const cCvv = inputCardCvv?.value.trim();

        if (!cNum || cNum.length < 15) {
          alert('Ingresa un número de tarjeta válido de 16 dígitos.');
          inputCardNumber?.focus();
          return;
        }

        if (!cName) {
          alert('Ingresa el nombre del titular tal como figura en la tarjeta.');
          inputCardName?.focus();
          return;
        }

        if (!cExp || cExp.length < 5) {
          alert('Ingresa la fecha de vencimiento en formato MM/AA.');
          inputCardExp?.focus();
          return;
        }

        if (!cCvv || cCvv.length < 3) {
          alert('Ingresa el código de seguridad CVV (3 o 4 dígitos al reverso).');
          inputCardCvv?.focus();
          return;
        }
      } else if (currentPaymentMethod === 'wallet') {
        const opCode = inputWalletOpCode ? inputWalletOpCode.value.trim() : '';
        if (!opCode || opCode.length < 6) {
          alert('Por favor ingresa el número o código de operación de tu transferencia Yape o Plin (mínimo 6 dígitos).');
          inputWalletOpCode?.focus();
          return;
        }
      }

      if (!termsAccepted) {
        alert('Debes aceptar los Términos y Condiciones y la Política de Protección de Datos Personales.');
        return;
      }

      // Iniciar simulación de procesamiento bancario 3D Secure
      runPaymentSimulation();
    });
  }

  function runPaymentSimulation() {
    if (!processingModal) return;
    processingModal.classList.add('is-active');

    const steps = [
      'Iniciando pasarela de pago segura...',
      'Cifrando información con SSL de 256 bits...',
      'Verificando fondos y token bancario...',
      'Autenticación 3D Secure aprobada con éxito ✓',
      'Generando comprobante oficial de compra...'
    ];

    let currentStepIndex = 0;
    if (processingStepLog) processingStepLog.innerHTML = `> ${steps[0]}<br>`;

    const stepInterval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        if (processingStepLog) {
          processingStepLog.innerHTML += `> ${steps[currentStepIndex]}<br>`;
        }
      } else {
        clearInterval(stepInterval);
        setTimeout(() => {
          processingModal.classList.remove('is-active');
          showSuccessVoucher();
        }, 500);
      }
    }, 450);
  }

  function showSuccessVoucher() {
    const cart = getCart();
    const totals = calculateTotals(cart);
    const orderNumber = 'FMX-2026-' + Math.floor(10000 + Math.random() * 90000);
    const authCode = 'AUT-' + Math.floor(100000 + Math.random() * 900000);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (vOrderId) vOrderId.textContent = `#${orderNumber}`;
    if (vDate) vDate.textContent = dateFormatted;
    if (vClientName) vClientName.textContent = inputFullName ? inputFullName.value.trim() : 'Cliente FerreMax';
    if (vDocType) vDocType.textContent = inputDocType ? inputDocType.value : 'DNI';
    if (vDocNum) vDocNum.textContent = inputDocNumber ? inputDocNumber.value.trim() : '00000000';
    if (vDelivery) {
      vDelivery.textContent = currentDeliveryMethod === 'delivery' 
        ? `Envío a domicilio (${inputAddress ? inputAddress.value.trim() : ''})` 
        : 'Retiro en Tienda (Almacén Principal)';
    }
    if (vMethod) {
      if (currentPaymentMethod === 'card') {
        const last4 = inputCardNumber?.value.replace(/\s/g, '').slice(-4) || '4242';
        vMethod.textContent = `Tarjeta Débito/Crédito (•••• ${last4})`;
      } else {
        vMethod.textContent = `Billetera Digital (${currentWallet.toUpperCase()} - Op: ${inputWalletOpCode?.value.trim()})`;
      }
    }
    if (vTotal) vTotal.textContent = `S/. ${totals.total.toFixed(2)}`;
    if (vAuthCode) vAuthCode.textContent = authCode;

    // Configurar acción de envío de voucher a WhatsApp
    if (btnSendVoucherWhatsApp) {
      btnSendVoucherWhatsApp.onclick = () => {
        const voucherMsg = `✅ *COMPROBANTE DE COMPRA FERREMAX* ✅%0A%0A` +
          `*Orden:* #${orderNumber}%0A` +
          `*Cliente:* ${vClientName.textContent}%0A` +
          `*Documento:* ${vDocType.textContent} ${vDocNum.textContent}%0A` +
          `*Total Pagado:* S/. ${totals.total.toFixed(2)}%0A` +
          `*Método:* ${vMethod.textContent}%0A` +
          `*Código de Autorización:* ${authCode}%0A%0A` +
          `Adjunto la constancia de mi compra para programar la entrega/despacho. ¡Gracias!`;
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${voucherMsg}`, '_blank');
      };
    }

    if (btnPrintVoucher) {
      btnPrintVoucher.onclick = () => window.print();
    }

    // Limpiar carrito tras pago exitoso
    localStorage.removeItem('ferremax_cart');

    // Mostrar overlay del Voucher
    if (voucherOverlay) voucherOverlay.classList.add('is-active');
  }

  // Inicializar checkout
  renderCheckout();
});
