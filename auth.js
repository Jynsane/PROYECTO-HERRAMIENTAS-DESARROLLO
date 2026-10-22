/**
 * FerreMax - Ferretería y Construcción
 * Módulo de Autenticación: inicio de sesión, registro y roles (cliente / administrador)
 * Vanilla JavaScript (Sin dependencias externas)
 *
 * Nota: el proyecto no tiene backend, por lo que los usuarios y la sesión se guardan
 * en localStorage. Las contraseñas se almacenan como hash SHA-256, nunca en texto plano.
 */

(function (root) {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURACIÓN
  // ==========================================================================
  const USERS_KEY = 'ferremax_users';
  const SESSION_KEY = 'ferremax_session';

  const ROLES = {
    ADMIN: 'admin',
    CLIENTE: 'cliente'
  };

  // Cuentas de demostración para la revisión del proyecto
  const DEMO_USERS = [
    { name: 'Administrador FerreMax', email: 'admin@ferremax.pe', password: 'Admin123', role: ROLES.ADMIN },
    { name: 'Cliente FerreMax', email: 'cliente@ferremax.pe', password: 'Cliente123', role: ROLES.CLIENTE }
  ];

  // ==========================================================================
  // 2. UTILIDADES
  // ==========================================================================
  async function hashPassword(password) {
    const data = new TextEncoder().encode(String(password));
    const buffer = await root.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  // Mínimo 6 caracteres, con al menos una letra y un número
  function isValidPassword(password) {
    return typeof password === 'string' &&
      password.length >= 6 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password);
  }

  // ==========================================================================
  // 3. NÚCLEO DE AUTENTICACIÓN (independiente del navegador para poder probarlo)
  // ==========================================================================
  function createAuth(storage) {

    function readUsers() {
      try {
        const users = JSON.parse(storage.getItem(USERS_KEY));
        return Array.isArray(users) ? users : [];
      } catch {
        return [];
      }
    }

    function saveUsers(users) {
      storage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Crea las cuentas demo la primera vez que se usa el sistema
    async function ensureSeed() {
      if (readUsers().length > 0) return;
      const users = [];
      for (const demo of DEMO_USERS) {
        users.push({
          name: demo.name,
          email: demo.email,
          role: demo.role,
          passwordHash: await hashPassword(demo.password),
          createdAt: new Date().toISOString()
        });
      }
      saveUsers(users);
    }

    function publicUser(user) {
      return { name: user.name, email: user.email, role: user.role };
    }

    function startSession(user) {
      const session = { ...publicUser(user), since: new Date().toISOString() };
      storage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    }

    async function register({ name, email, password }) {
      await ensureSeed();
      const cleanName = String(name || '').trim();
      const cleanEmail = normalizeEmail(email);

      if (cleanName.length < 3) return { ok: false, error: 'Ingresa tu nombre completo.' };
      if (!isValidEmail(cleanEmail)) return { ok: false, error: 'El correo no es válido.' };
      if (!isValidPassword(password)) {
        return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres, letras y números.' };
      }

      const users = readUsers();
      if (users.some(u => u.email === cleanEmail)) {
        return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
      }

      // Todo registro público es de tipo cliente; solo un admin puede promover a otro usuario
      const user = {
        name: cleanName,
        email: cleanEmail,
        role: ROLES.CLIENTE,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveUsers(users);
      return { ok: true, user: startSession(user) };
    }

    async function login(email, password) {
      await ensureSeed();
      const cleanEmail = normalizeEmail(email);
      const user = readUsers().find(u => u.email === cleanEmail);
      const hash = await hashPassword(password);

      if (!user || user.passwordHash !== hash) {
        return { ok: false, error: 'Correo o contraseña incorrectos.' };
      }
      return { ok: true, user: startSession(user) };
    }

    function logout() {
      storage.removeItem(SESSION_KEY);
    }

    // La sesión solo es válida si el usuario sigue existiendo (y con su rol actual)
    function getSession() {
      try {
        const session = JSON.parse(storage.getItem(SESSION_KEY));
        if (!session || !session.email) return null;
        const user = readUsers().find(u => u.email === session.email);
        if (!user) return null;
        return { ...session, name: user.name, role: user.role };
      } catch {
        return null;
      }
    }

    function isAdmin() {
      const session = getSession();
      return !!session && session.role === ROLES.ADMIN;
    }

    // ---------- Gestión de usuarios (solo administradores) ----------
    function requireAdmin() {
      if (!isAdmin()) return { ok: false, error: 'Acción permitida solo para administradores.' };
      return null;
    }

    function listUsers() {
      if (!isAdmin()) return [];
      return readUsers().map(u => ({ ...publicUser(u), createdAt: u.createdAt }));
    }

    function setRole(email, role) {
      const denied = requireAdmin();
      if (denied) return denied;
      if (role !== ROLES.ADMIN && role !== ROLES.CLIENTE) return { ok: false, error: 'Rol no válido.' };

      const users = readUsers();
      const user = users.find(u => u.email === normalizeEmail(email));
      if (!user) return { ok: false, error: 'Usuario no encontrado.' };

      const admins = users.filter(u => u.role === ROLES.ADMIN);
      if (user.role === ROLES.ADMIN && role !== ROLES.ADMIN && admins.length === 1) {
        return { ok: false, error: 'Debe existir al menos un administrador.' };
      }

      user.role = role;
      saveUsers(users);
      return { ok: true };
    }

    function deleteUser(email) {
      const denied = requireAdmin();
      if (denied) return denied;

      const cleanEmail = normalizeEmail(email);
      if (cleanEmail === getSession().email) {
        return { ok: false, error: 'No puedes eliminar tu propia cuenta.' };
      }

      const users = readUsers();
      if (!users.some(u => u.email === cleanEmail)) return { ok: false, error: 'Usuario no encontrado.' };
      saveUsers(users.filter(u => u.email !== cleanEmail));
      return { ok: true };
    }

    return { ROLES, ensureSeed, register, login, logout, getSession, isAdmin, listUsers, setRole, deleteUser };
  }

  // Exportación para pruebas automáticas en Node (GitHub Actions)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createAuth, ROLES, DEMO_USERS, isValidEmail, isValidPassword };
    return;
  }

  // ==========================================================================
  // 4. INTEGRACIÓN CON LAS PÁGINAS (solo navegador)
  // ==========================================================================
  const auth = createAuth(root.localStorage);
  root.FerreAuth = auth;

  function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // Protege páginas marcadas con <body data-requiere-rol="admin">
  function guardPage() {
    const requiredRole = document.body.dataset.requiereRol;
    if (!requiredRole) return true;

    const session = auth.getSession();
    if (!session || (requiredRole === ROLES.ADMIN && session.role !== ROLES.ADMIN)) {
      const page = location.pathname.split('/').pop() || 'index.html';
      location.replace('Login.html?redirect=' + encodeURIComponent(page) + (session ? '&denegado=1' : ''));
      return false;
    }
    document.body.classList.add('auth-ok');
    return true;
  }

  // Botón de usuario en el header: "Ingresar" o menú con la cuenta activa
  function renderHeaderUser() {
    const actions = document.querySelector('.header-actions');
    if (!actions) return;

    const container = document.createElement('div');
    container.className = 'user-menu';
    const session = auth.getSession();

    if (!session) {
      container.innerHTML = `
        <a href="Login.html" class="user-login-link" aria-label="Iniciar sesión">
          <span class="user-login-icon" aria-hidden="true">👤</span>
          <span class="user-login-text">Ingresar</span>
        </a>`;
    } else {
      const isAdmin = session.role === ROLES.ADMIN;
      container.innerHTML = `
        <button class="user-chip" id="userChipBtn" aria-haspopup="true" aria-expanded="false"
          title="${escapeHTML(session.name)}">
          <span class="user-avatar ${isAdmin ? 'is-admin' : ''}">${escapeHTML(session.name.charAt(0).toUpperCase())}</span>
          <span class="user-chip-name">${escapeHTML(session.name.split(' ')[0])}</span>
        </button>
        <div class="user-dropdown" id="userDropdown" role="menu">
          <div class="user-dropdown-header">
            <strong>${escapeHTML(session.name)}</strong>
            <span>${escapeHTML(session.email)}</span>
            <span class="role-badge role-${session.role}">${isAdmin ? 'Administrador' : 'Cliente'}</span>
          </div>
          ${isAdmin ? '<a href="Admin.html" class="user-dropdown-link" role="menuitem">🛠️ Panel de administración</a>' : ''}
          <a href="Catalogo.html" class="user-dropdown-link" role="menuitem">🧰 Ver catálogo</a>
          <button class="user-dropdown-link user-logout" id="userLogoutBtn" role="menuitem">🚪 Cerrar sesión</button>
        </div>`;
    }

    actions.insertBefore(container, actions.firstChild);

    const chip = container.querySelector('#userChipBtn');
    if (!chip) return;

    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = container.classList.toggle('is-open');
      chip.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', () => {
      container.classList.remove('is-open');
      chip.setAttribute('aria-expanded', 'false');
    });
    container.querySelector('#userLogoutBtn').addEventListener('click', () => {
      auth.logout();
      location.href = 'index.html';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    auth.ensureSeed();
    if (guardPage()) renderHeaderUser();
  });
})(typeof window !== 'undefined' ? window : globalThis);
