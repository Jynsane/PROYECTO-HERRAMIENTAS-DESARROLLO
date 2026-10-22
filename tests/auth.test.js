/**
 * Pruebas automáticas del módulo de autenticación (auth.js)
 * Se ejecutan con: node --test tests/*.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { createAuth, ROLES, isValidEmail, isValidPassword } = require('../auth.js');

// Simula el localStorage del navegador
function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key)
  };
}

test('crea las cuentas demo sin guardar contraseñas en texto plano', async () => {
  const storage = memoryStorage();
  const auth = createAuth(storage);
  await auth.ensureSeed();

  const raw = storage.getItem('ferremax_users');
  assert.ok(raw.includes('admin@ferremax.pe'));
  assert.ok(!raw.includes('Admin123'));
});

test('el administrador demo inicia sesión con rol admin', async () => {
  const auth = createAuth(memoryStorage());
  const result = await auth.login('ADMIN@ferremax.pe ', 'Admin123');

  assert.equal(result.ok, true);
  assert.equal(result.user.role, ROLES.ADMIN);
  assert.equal(auth.isAdmin(), true);
});

test('rechaza una contraseña incorrecta', async () => {
  const auth = createAuth(memoryStorage());
  const result = await auth.login('cliente@ferremax.pe', 'otraClave1');

  assert.equal(result.ok, false);
  assert.equal(auth.getSession(), null);
});

test('el registro público siempre crea clientes', async () => {
  const auth = createAuth(memoryStorage());
  const result = await auth.register({ name: 'Carlos Ramírez', email: 'carlos@correo.com', password: 'Obra2026' });

  assert.equal(result.ok, true);
  assert.equal(result.user.role, ROLES.CLIENTE);
  assert.equal(auth.isAdmin(), false);
});

test('no permite registrar un correo repetido', async () => {
  const auth = createAuth(memoryStorage());
  const result = await auth.register({ name: 'Otro Admin', email: 'admin@ferremax.pe', password: 'Clave123' });

  assert.equal(result.ok, false);
});

test('un cliente no puede gestionar usuarios', async () => {
  const auth = createAuth(memoryStorage());
  await auth.login('cliente@ferremax.pe', 'Cliente123');

  assert.deepEqual(auth.listUsers(), []);
  assert.equal(auth.setRole('cliente@ferremax.pe', ROLES.ADMIN).ok, false);
  assert.equal(auth.deleteUser('admin@ferremax.pe').ok, false);
});

test('el admin puede promover clientes pero no quitar el último administrador', async () => {
  const auth = createAuth(memoryStorage());
  await auth.login('admin@ferremax.pe', 'Admin123');

  assert.equal(auth.setRole('admin@ferremax.pe', ROLES.CLIENTE).ok, false);
  assert.equal(auth.setRole('cliente@ferremax.pe', ROLES.ADMIN).ok, true);
  assert.equal(auth.listUsers().filter(u => u.role === ROLES.ADMIN).length, 2);
});

test('el admin no puede eliminar su propia cuenta', async () => {
  const auth = createAuth(memoryStorage());
  await auth.login('admin@ferremax.pe', 'Admin123');

  assert.equal(auth.deleteUser('admin@ferremax.pe').ok, false);
  assert.equal(auth.deleteUser('cliente@ferremax.pe').ok, true);
});

test('cerrar sesión elimina la sesión activa', async () => {
  const auth = createAuth(memoryStorage());
  await auth.login('cliente@ferremax.pe', 'Cliente123');
  auth.logout();

  assert.equal(auth.getSession(), null);
});

test('valida formato de correo y contraseña', () => {
  assert.equal(isValidEmail('ventas@ferremax.pe'), true);
  assert.equal(isValidEmail('ventas@ferremax'), false);
  assert.equal(isValidPassword('Martillo1'), true);
  assert.equal(isValidPassword('martillo'), false);
  assert.equal(isValidPassword('12345'), false);
});
