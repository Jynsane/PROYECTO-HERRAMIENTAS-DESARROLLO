const test = require('node:test');
const assert = require('node:assert/strict');
const { createReviewStore, escapeHTML, REVIEWS_KEY } = require('../resenas.js');

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value))
  };
}

test('guarda y recupera reseñas en orden de publicación', () => {
  const storage = memoryStorage();
  const store = createReviewStore(storage);
  const firstReview = {
    author: 'Ana',
    productName: 'Martillo de uña 16 oz',
    message: 'Funciona muy bien.',
    createdAt: '2026-11-18T12:00:00.000Z'
  };
  const secondReview = {
    author: 'Luis',
    productName: 'Taladro percutor 650 W',
    message: 'Buena potencia.',
    createdAt: '2026-11-18T13:00:00.000Z'
  };

  store.add(firstReview);
  store.add(secondReview);

  assert.deepEqual(store.list(), [secondReview, firstReview]);
  assert.equal(JSON.parse(storage.getItem(REVIEWS_KEY)).length, 2);
});

test('informa si el contenido guardado no es una lista de reseñas válida', () => {
  const storage = memoryStorage();
  storage.setItem(REVIEWS_KEY, JSON.stringify({ message: 'invalid' }));

  assert.throws(() => createReviewStore(storage).list(), /formato válido/);
});

test('escapa contenido de reseñas antes de insertarlo en la página', () => {
  assert.equal(escapeHTML('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
});
