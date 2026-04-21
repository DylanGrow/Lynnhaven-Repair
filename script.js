/* ============================================================
   LYNNHAVEN SMALL ENGINE REPAIR — script.js
   ============================================================ */

const PRODUCTS_URL = 'products.json';
const CART_KEY = 'lynnhaven_cart';

/* ── Cart helpers ── */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  if (!cart.find(i => i.id === product.id)) {
    cart.push(product);
    saveCart(cart);
    showToast(`✅ ${product.name} added to cart`);
  } else {
    showToast(`ℹ️ Already in cart`);
  }
  updateCartBadge();
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function updateCartBadge() {
  const count = getCart().length;
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });
}

/* ── Toast ── */
let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── Condition badge class ── */
function conditionClass(c) {
  return c.toLowerCase();
}

/* ── Render a single product card ── */
function productCardHTML(p) {
  return `
    <div class="product-card" data-id="${p.id}" data-category="${p.category}">
      <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-body">
        <div class="product-meta">
          <span class="condition-badge ${conditionClass(p.condition)}">${p.condition}</span>
          <span class="category-tag">${p.category}</span>
        </div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <span class="product-price">$${p.price}</span>
          <button
            class="add-to-cart"
            aria-label="Add ${p.name} to cart"
            onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>`;
}

/* ── Load & render products ── */
async function loadProducts() {
  const response = await fetch(PRODUCTS_URL);
  if (!response.ok) throw new Error('Could not load products.');
  return await response.json();
}

/* ── Homepage: featured products ── */
async function initHomepage() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;
  try {
    const products = await loadProducts();
    const featured = products.filter(p => p.featured).slice(0, 4);
    grid.innerHTML = featured.map(productCardHTML).join('');
  } catch (e) {
    if (grid) grid.innerHTML = '<p>Unable to load products right now.</p>';
  }
}

/* ── Shop page ── */
let allProducts = [];

async function initShop() {
  const grid = document.getElementById('shop-products');
  if (!grid) return;

  try {
    allProducts = await loadProducts();
    renderShop(allProducts);
    setupCategoryFilter();
  } catch (e) {
    grid.innerHTML = '<p>Unable to load products. Please try again later.</p>';
  }
}

function renderShop(products) {
  const grid = document.getElementById('shop-products');
  const count = document.getElementById('products-count');
  if (!grid) return;
  if (count) count.textContent = `Showing ${products.length} item${products.length !== 1 ? 's' : ''}`;
  grid.innerHTML = products.length
    ? products.map(productCardHTML).join('')
    : '<p class="empty-state">No products in this category right now. Check back soon!</p>';
}

function setupCategoryFilter() {
  const chips = document.querySelectorAll('.cat-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.dataset.category;
      const filtered = cat === 'All'
        ? allProducts
        : allProducts.filter(p => p.category === cat);
      renderShop(filtered);
    });
  });
}

/* ── Cart page ── */
function initCart() {
  const wrap = document.getElementById('cart-wrap');
  if (!wrap) return;

  function render() {
    const cart = getCart();
    if (cart.length === 0) {
      wrap.innerHTML = `
        <div class="empty-cart">
          <div class="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Browse our refurbished equipment and find a great deal.</p>
          <a href="shop.html" class="btn btn-primary">Browse the Shop</a>
        </div>`;
      return;
    }

    const total = cart.reduce((s, i) => s + i.price, 0);
    const cartLayout = document.createElement('div');
    cartLayout.className = 'cart-layout';

    const itemsCol = document.createElement('div');
    itemsCol.className = 'cart-items';
    itemsCol.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">${item.category} · ${item.condition} Condition</div>
        </div>
        <span class="cart-item-price">$${item.price}</span>
        <button class="remove-btn" aria-label="Remove ${item.name} from cart" onclick="removeItem('${item.id}')">✕</button>
      </div>`).join('');

    const sideCol = document.createElement('div');
    sideCol.className = 'cart-sidebar';
    sideCol.innerHTML = `
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-line"><span>${cart.length} item${cart.length !== 1 ? 's' : ''}</span><span>$${total}</span></div>
        <div class="summary-line"><span>Payment</span><span>In-Store / Pickup</span></div>
        <div class="summary-line total"><span>Estimated Total</span><span>$${total}</span></div>
        <div class="cart-actions">
          <a href="order.html" class="btn btn-gold">Request This Order →</a>
          <a href="shop.html" class="btn btn-ghost">← Keep Shopping</a>
        </div>
      </div>`;

    cartLayout.appendChild(itemsCol);
    cartLayout.appendChild(sideCol);
    wrap.innerHTML = '';
    wrap.appendChild(cartLayout);
  }

  window.removeItem = (id) => {
    removeFromCart(id);
    render();
    showToast('Item removed from cart');
  };

  render();
}

/* ── Order page ── */
function initOrder() {
  const form = document.getElementById('order-form');
  const itemsBox = document.getElementById('order-items');
  const totalEl = document.getElementById('order-total');
  const cartInput = document.getElementById('cart-items-hidden');
  const nameInput = document.getElementById('name');
  
  if (!form) return;

  const cart = getCart();

  // 1. Populate visual summary
  if (itemsBox) {
    if (cart.length === 0) {
      itemsBox.innerHTML = '<p style="color:var(--warm-gray);font-size:.9rem">No items in cart.</p>';
    } else {
      const total = cart.reduce((s, i) => s + i.price, 0);
      itemsBox.innerHTML = cart.map(i => `
        <div class="order-item">
          <span class="order-item-name">${i.name}</span>
          <span class="order-item-price">$${i.price}</span>
        </div>`).join('');
      if (totalEl) totalEl.textContent = `$${total}`;
    }
  }

  // 2. Map cart data to hidden Google Form field
  if (cartInput) {
    cartInput.value = cart.map(i => `${i.name} ($${i.price})`).join('; ');
  }

  // 3. Handle submission via hidden iframe (No fetch/CORS issues)
  form.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]');
    const customerName = nameInput ? nameInput.value : 'neighbor';
    
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Wait 1.5s to allow the POST to the iframe to complete
    setTimeout(() => {
      const wrap = document.querySelector('.order-form-wrap');
      if (wrap) {
        wrap.innerHTML = `
          <div class="success-box" style="text-align:center; padding: 40px 20px;">
            <div style="font-size: 3.5rem; margin-bottom: 20px;">🎉</div>
            <h2 style="color:var(--green-dark); margin-bottom:10px;">Request Received!</h2>
            <p>Thanks for reaching out, ${customerName}. We'll contact you within 1 business day to confirm your order.</p>
            <a href="index.html" class="btn btn-gold" style="display:inline-block; margin-top:25px;">Back to Home</a>
          </div>`;
      }
      saveCart([]); // Clear cart
    }, 1500);
  });
}

/* ── Hamburger menu ── */
function initNav() {
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-header')) nav.classList.remove('open');
  });
}

/* ── Active nav link ── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  setActiveNav();
  initNav();
  initHomepage();
  initShop();
  initCart();
  initOrder();
});
