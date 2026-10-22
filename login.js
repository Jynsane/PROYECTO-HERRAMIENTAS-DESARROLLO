/**
 * FerreMax - Ferretería y Construcción
 * Página de Login: inicio de sesión, registro de clientes y redirección según el rol
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const auth = window.FerreAuth;
  const params = new URLSearchParams(location.search);

  const tabLogin = document.getElementById('tabLogin');
  const tabRegistro = document.getElementById('tabRegistro');
  const formLogin = document.getElementById('formLogin');
  const formRegistro = document.getElementById('formRegistro');
  const alertBox = document.getElementById('authAlert');

  // Solo se permite redirigir a páginas internas del sitio
  function getRedirect(role) {
    const target = params.get('redirect') || '';
    if (/^[A-Za-z_]+\.html$/.test(target)) {
      if (target === 'Admin.html' && role !== auth.ROLES.ADMIN) return 'index.html';
      return target;
    }
    return role === auth.ROLES.ADMIN ? 'Admin.html' : 'index.html';
  }

  function showAlert(message, type = 'error') {
    alertBox.textContent = message;
    alertBox.className = 'auth-alert auth-alert-' + type;
    alertBox.hidden = false;
  }

  function switchTab(showLogin) {
    tabLogin.classList.toggle('active', showLogin);
    tabRegistro.classList.toggle('active', !showLogin);
    tabLogin.setAttribute('aria-selected', String(showLogin));
    tabRegistro.setAttribute('aria-selected', String(!showLogin));
    formLogin.hidden = !showLogin;
    formRegistro.hidden = showLogin;
    alertBox.hidden = true;
  }

  tabLogin.addEventListener('click', () => switchTab(true));
  tabRegistro.addEventListener('click', () => switchTab(false));

  // Si ya hay una sesión activa, no tiene sentido volver a ingresar
  const session = auth.getSession();
  if (params.get('denegado')) {
    showAlert('Tu cuenta no tiene permisos de administrador. Ingresa con una cuenta autorizada.');
  } else if (params.get('redirect')) {
    showAlert('Inicia sesión para continuar.', 'info');
  } else if (session) {
    location.replace(getRedirect(session.role));
    return;
  }

  // Mostrar / ocultar contraseña
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      btn.setAttribute('aria-label', visible ? 'Mostrar contraseña' : 'Ocultar contraseña');
    });
  });

  // Autocompletar cuentas de prueba
  document.querySelectorAll('.auth-demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(true);
      document.getElementById('loginEmail').value = btn.dataset.email;
      document.getElementById('loginPassword').value = btn.dataset.pass;
    });
  });

  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showAlert('Completa tu correo y contraseña.');
      return;
    }

    const result = await auth.login(email, password);
    if (!result.ok) {
      showAlert(result.error);
      return;
    }
    showAlert(`¡Bienvenido, ${result.user.name}! Redirigiendo...`, 'success');
    setTimeout(() => location.assign(getRedirect(result.user.role)), 700);
  });

  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('regPassword').value;

    if (password !== document.getElementById('regPassword2').value) {
      showAlert('Las contraseñas no coinciden.');
      return;
    }

    const result = await auth.register({
      name: document.getElementById('regNombre').value,
      email: document.getElementById('regEmail').value,
      password
    });
    if (!result.ok) {
      showAlert(result.error);
      return;
    }
    showAlert('¡Cuenta creada! Ya puedes comprar en FerreMax.', 'success');
    setTimeout(() => location.assign(getRedirect(result.user.role)), 900);
  });
});
