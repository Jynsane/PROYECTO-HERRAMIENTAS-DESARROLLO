/**
 * FerreMax - Ferretería y Construcción
 * Panel de Administración: gestión de productos del catálogo y de usuarios
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const auth = window.FerreAuth;
  const catalog = window.FerreMaxCatalog;
  if (!auth.isAdmin() || !catalog) return;

  const CATEGORY_LABELS = {
    herramientas: 'Herramientas',
    construccion: 'Construcción',
    electricidad: 'Electricidad',
    plomeria: 'Plomería',
    pintura: 'Pintura',
    seguridad: 'Seguridad'
  };
  const DEFAULT_IMG = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80';

  const alertBox = document.getElementById('adminAlert');
  const form = document.getElementById('formProducto');
  const fields = {
    id: document.getElementById('prodId'),
    name: document.getElementById('prodNombre'),
    category: document.getElementById('prodCategoria'),
    price: document.getElementById('prodPrecio'),
    img: document.getElementById('prodImagen'),
    desc: document.getElementById('prodDescripcion')
  };
  const btnGuardar = document.getElementById('btnGuardarProducto');
  const btnCancelar = document.getElementById('btnCancelarEdicion');

  document.getElementById('adminNombre').textContent = auth.getSession().name.split(' ')[0];

  function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  let alertTimer;
  function showAlert(message, type = 'success') {
    alertBox.textContent = message;
    alertBox.className = 'auth-alert auth-alert-' + type;
    alertBox.hidden = false;
    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => { alertBox.hidden = true; }, 3500);
  }

  function saveProducts(products) {
    localStorage.setItem(catalog.KEY, JSON.stringify(products));
  }

  // ==========================================================================
  // RESUMEN
  // ==========================================================================
  function renderStats() {
    const products = catalog.get();
    const users = auth.listUsers();
    document.getElementById('statProductos').textContent = products.length;
    document.getElementById('statCategorias').textContent = new Set(products.map(p => p.category)).size;
    document.getElementById('statUsuarios').textContent = users.length;
    document.getElementById('statAdmins').textContent = users.filter(u => u.role === auth.ROLES.ADMIN).length;
  }

  // ==========================================================================
  // PRODUCTOS
  // ==========================================================================
  function renderProducts() {
    const tbody = document.getElementById('tablaProductos');
    tbody.innerHTML = catalog.get().map(p => `
      <tr>
        <td>
          <div class="admin-product">
            <img src="${escapeHTML(p.img || DEFAULT_IMG)}" alt="" loading="lazy">
            <div>
              <strong>${escapeHTML(p.name)}</strong>
              <span>${escapeHTML(p.desc || '')}</span>
            </div>
          </div>
        </td>
        <td><span class="category-pill">${escapeHTML(CATEGORY_LABELS[p.category] || p.category)}</span></td>
        <td class="admin-price">S/. ${Number(p.price).toFixed(2)}</td>
        <td class="admin-actions">
          <button type="button" class="admin-btn" data-edit="${p.id}">Editar</button>
          <button type="button" class="admin-btn admin-btn-danger" data-delete="${p.id}">Eliminar</button>
        </td>
      </tr>`).join('');
  }

  function resetForm() {
    form.reset();
    fields.id.value = '';
    btnGuardar.textContent = 'Agregar producto';
    btnCancelar.hidden = true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const price = parseFloat(fields.price.value);
    const name = fields.name.value.trim();
    const desc = fields.desc.value.trim();

    if (!name || !desc || !(price > 0)) {
      showAlert('Completa nombre, descripción y un precio mayor a 0.', 'error');
      return;
    }

    const products = catalog.get();
    const data = {
      name,
      category: fields.category.value,
      price: Math.round(price * 100) / 100,
      desc,
      img: fields.img.value.trim() || DEFAULT_IMG
    };

    if (fields.id.value) {
      const product = products.find(p => String(p.id) === fields.id.value);
      if (product) Object.assign(product, data);
      showAlert(`Producto "${name}" actualizado.`);
    } else {
      const nextId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
      products.push({ id: nextId, ...data });
      showAlert(`Producto "${name}" agregado al catálogo.`);
    }

    saveProducts(products);
    resetForm();
    renderProducts();
    renderStats();
  });

  btnCancelar.addEventListener('click', resetForm);

  document.getElementById('tablaProductos').addEventListener('click', (e) => {
    const editId = e.target.dataset.edit;
    const deleteId = e.target.dataset.delete;
    const products = catalog.get();

    if (editId) {
      const p = products.find(item => String(item.id) === editId);
      if (!p) return;
      fields.id.value = p.id;
      fields.name.value = p.name;
      fields.category.value = p.category;
      fields.price.value = p.price;
      fields.img.value = p.img || '';
      fields.desc.value = p.desc || '';
      btnGuardar.textContent = 'Guardar cambios';
      btnCancelar.hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (deleteId) {
      const p = products.find(item => String(item.id) === deleteId);
      if (!p || !confirm(`¿Eliminar "${p.name}" del catálogo?`)) return;
      saveProducts(products.filter(item => String(item.id) !== deleteId));
      showAlert(`Producto "${p.name}" eliminado.`);
      renderProducts();
      renderStats();
    }
  });

  document.getElementById('btnRestaurarCatalogo').addEventListener('click', () => {
    if (!confirm('¿Restaurar el catálogo original? Se perderán los cambios realizados.')) return;
    catalog.reset();
    resetForm();
    renderProducts();
    renderStats();
    showAlert('Catálogo restaurado.');
  });

  // ==========================================================================
  // USUARIOS
  // ==========================================================================
  function renderUsers() {
    const current = auth.getSession().email;
    document.getElementById('tablaUsuarios').innerHTML = auth.listUsers().map(u => `
      <tr>
        <td><strong>${escapeHTML(u.name)}</strong>${u.email === current ? ' <span class="you-tag">(tú)</span>' : ''}</td>
        <td>${escapeHTML(u.email)}</td>
        <td>
          <select class="styled-select admin-role-select" data-email="${escapeHTML(u.email)}">
            <option value="cliente" ${u.role === 'cliente' ? 'selected' : ''}>Cliente</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Administrador</option>
          </select>
        </td>
        <td class="admin-actions">
          ${u.email === current ? '' : `<button type="button" class="admin-btn admin-btn-danger" data-user-delete="${escapeHTML(u.email)}">Eliminar</button>`}
        </td>
      </tr>`).join('');
  }

  const tablaUsuarios = document.getElementById('tablaUsuarios');

  tablaUsuarios.addEventListener('change', (e) => {
    if (!e.target.matches('.admin-role-select')) return;
    const result = auth.setRole(e.target.dataset.email, e.target.value);
    showAlert(result.ok ? 'Rol actualizado.' : result.error, result.ok ? 'success' : 'error');

    // Si el admin se quitó su propio rol, ya no puede seguir en el panel
    if (result.ok && !auth.isAdmin()) {
      location.replace('index.html');
      return;
    }
    renderUsers();
    renderStats();
  });

  tablaUsuarios.addEventListener('click', (e) => {
    const email = e.target.dataset.userDelete;
    if (!email || !confirm(`¿Eliminar la cuenta ${email}?`)) return;
    const result = auth.deleteUser(email);
    showAlert(result.ok ? 'Usuario eliminado.' : result.error, result.ok ? 'success' : 'error');
    renderUsers();
    renderStats();
  });

  renderProducts();
  renderUsers();
  renderStats();
});
