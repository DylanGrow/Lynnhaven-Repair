const CART_KEY = 'lawnmower-cart';
let cart = [];
let products = [];

function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(cart)) cart = [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = cart.length;
}

function productImageHtml(product) {
  const src = product.image ? product.image : 'images/placeholder-product.jpg';
  const alt = product.name ? `${product.name} photo` : 'Product photo';
  return `<img class="product-image" src="${src}" alt="${alt}" loading="lazy">`;
}

function cardHtml(product) {
  return `
    <article class="product-card">
      ${productImageHtml(product)}
      <div>
        <p class="eyebrow">${product.condition || 'Available'}</p>
        <h3>${product.name || 'Product'}</h3>
        <p>${product.description || ''}</p>
        <p class="price">$${Number(product.price || 0).toFixed(2)}</p>
      </div>
      <button type="button" aria-label="Add ${product.name} to cart" onclick="addToCart(${product.id})">
        Add to cart
      </button>
    </article>
  `;
}

async function loadProducts() {
  try {
    const res = await fetch('products.json');
    products = await res.json();
    if (!Array.isArray(products)) products = [];
    renderProducts();
    renderFeatured();
  } catch (err) {
    console.error('Could not load products:', err);
  }
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
  const item = products.find(p => Number(p.id) === Number(id));
  if (!item) return;
  cart.push(item);
  saveCart();
  updateCartCount();
  pulseCartButton();
}

function pulseCartButton() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  el.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
    { duration: 220, easing: 'ease-out' }
  );
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartCount();
}

function renderCart() {
  const list = document.getElementById('cart-list');
  const total = document.getElementById('total-price');
  const checkout = document.getElementById('checkout-btn');
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = `
      <li class="card">
        <h3>Your cart is empty</h3>
        <p>Visit the shop to add refurbished equipment.</p>
        <a class="btn btn-primary" href="shop.html">Go to shop</a>
      </li>
    `;
    if (total) total.textContent = '0.00';
    if (checkout) checkout.setAttribute('aria-disabled', 'true');
    return;
  }

  let sum = 0;
  list.innerHTML = cart.map((item, index) => {
    const price = Number(item.price || 0);
    sum += price;
    return `
      <li class="card" style="display:flex;justify-content:space-between;gap:12px;align-items:center; margin-bottom:12px;">
        <div>
          <strong>${item.name}</strong>
          <div>$${price.toFixed(2)}</div>
        </div>
        <button type="button" class="btn btn-secondary" aria-label="Remove ${item.name}" onclick="removeFromCart(${index})">
          Remove
        </button>
      </li>
    `;
  }).join('');

  if (total) total.textContent = sum.toFixed(2);
  if (checkout) checkout.removeAttribute('aria-disabled');
}

function fillOrder() {
  const el = document.getElementById('order-items');
  if (!el) return;

  if (!cart.length) {
    el.value = 'No items selected yet.';
    return;
  }

  el.value = cart
    .map(item => `${item.name} - $${Number(item.price || 0).toFixed(2)}`)
    .join('\n');
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartCount();

  const hasProducts = document.getElementById('product-grid') || document.getElementById('featured-products');
  if (hasProducts) loadProducts();

  if (document.getElementById('cart-list')) renderCart();
  if (document.getElementById('order-form')) fillOrder();
});
.product-image {
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 10px;
  background: #eef2ea;
}
