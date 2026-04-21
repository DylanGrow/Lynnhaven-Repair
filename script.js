let cart = JSON.parse(localStorage.getItem('lawnmower-cart') || localStorage.getItem('lawnhavn-cart') || '[]');
let products = [];

async function loadProducts() {
  const res = await fetch('products.json');
  products = await res.json();
  renderProducts();
  renderFeatured();
}

function saveCart() {
  localStorage.setItem('lawnmower-cart', JSON.stringify(cart));
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = cart.length;
}

function cardHtml(p) {
  return `<article class="product-card">
    <div>
      <p class="eyebrow">${p.condition}</p>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p class="price">$${p.price}</p>
    </div>
    <button type="button" onclick="addToCart(${p.id})">Add to cart</button>
  </article>`;
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = products.map(cardHtml).join('');
}

function renderFeatured() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;
  grid.innerHTML = products.slice(0, 3).map(cardHtml).join('');
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;
  cart.push(item);
  saveCart();
  updateCartCount();
}

function renderCart() {
  const list = document.getElementById('cart-list');
  const total = document.getElementById('total-price');
  const checkout = document.getElementById('checkout-btn');
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = '<li class="card">Your cart is empty. Visit the shop to add equipment.</li>';
    if (total) total.textContent = '0.00';
    if (checkout) checkout.setAttribute('aria-disabled', 'true');
    return;
  }

  let sum = 0;
  list.innerHTML = cart.map((item, i) => {
    sum += Number(item.price);
    return `<li class="card" style="display:flex;justify-content:space-between;gap:12px;align-items:center; margin-bottom:12px;">
      <div><strong>${item.name}</strong><div>$${item.price}</div></div>
      <button type="button" class="btn btn-secondary" onclick="removeFromCart(${i})">Remove</button>
    </li>`;
  }).join('');

  if (total) total.textContent = sum.toFixed(2);
  if (checkout) checkout.removeAttribute('aria-disabled');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartCount();
}

function fillOrder() {
  const el = document.getElementById('order-items');
  if (!el) return;
  el.value = cart.length ? cart.map(i => `${i.name} - $${i.price}`).join('\n') : 'No items selected yet.';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if (document.getElementById('product-grid') || document.getElementById('featured-products')) loadProducts();
  if (document.getElementById('cart-list')) renderCart();
  if (document.getElementById('order-form')) fillOrder();
});
