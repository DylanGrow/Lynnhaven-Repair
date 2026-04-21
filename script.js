/* ============================================================
   LYNNHAVEN SMALL ENGINE REPAIR — script.js
   ============================================================ */

const CART_KEY = 'lynnhaven_cart';

const PRODUCTS_DATA = [
  { "id": "p001", "name": "Honda HRX217 Self-Propelled Mower", "category": "Mowers", "condition": "Excellent", "price": 385, "description": "Variable speed self-propel, Honda GCV200 engine. Runs great, blades sharpened.", "image": "https://placehold.co/400x300/2d5016/ffffff?text=Honda+HRX217", "featured": true },
  { "id": "p002", "name": "Toro Recycler 22 Push Mower", "category": "Mowers", "condition": "Good", "price": 195, "description": "Recycler mulching technology, Briggs & Stratton 140cc engine. Serviced and ready.", "image": "https://placehold.co/400x300/2d5016/ffffff?text=Toro+Recycler+22", "featured": true },
  { "id": "p003", "name": "Craftsman 21\" Push Mower", "category": "Mowers", "condition": "Fair", "price": 120, "description": "Reliable Briggs engine, side discharge and mulch. Deck cleaned, oil changed.", "image": "https://placehold.co/400x300/2d5016/ffffff?text=Craftsman+Push+Mower", "featured": false },
  { "id": "p004", "name": "Stihl FS 56 RC String Trimmer", "category": "Trimmers", "condition": "Excellent", "price": 220, "description": "Easy2Start system, loop handle. Carb cleaned, new fuel lines. Starts 1st pull.", "image": "https://placehold.co/400x300/4a7c24/ffffff?text=Stihl+FS+56+RC", "featured": true },
  { "id": "p005", "name": "Echo SRM-225 String Trimmer", "category": "Trimmers", "condition": "Good", "price": 165, "description": "Pro-grade 21.2cc engine, Speed-Feed head. Runs strong, shaft cleaned.", "image": "https://placehold.co/400x300/4a7c24/ffffff?text=Echo+SRM-225", "featured": false },
  { "id": "p006", "name": "Husqvarna 128LD Detachable Trimmer", "category": "Trimmers", "condition": "Good", "price": 175, "description": "Detachable shaft accepts multiple attachments. Powerful 28cc engine, low vibration.", "image": "https://placehold.co/400x300/4a7c24/ffffff?text=Husqvarna+128LD", "featured": false },
  { "id": "p007", "name": "Toro 51621 Electric Leaf Blower", "category": "Blowers", "condition": "Excellent", "price": 75, "description": "110 MPH airspeed, vacuum/mulch mode. All electric, no gas needed. Like new.", "image": "https://placehold.co/400x300/1a3a0a/ffffff?text=Toro+Leaf+Blower", "featured": false },
  { "id": "p008", "name": "Echo PB-580T Backpack Blower", "category": "Blowers", "condition": "Good", "price": 285, "description": "58.2cc engine, 215 MPH air velocity. Commercial-grade power for large properties.", "image": "https://placehold.co/400x300/1a3a0a/ffffff?text=Echo+PB-580T", "featured": true },
  { "id": "p009", "name": "Ryobi 40V Cordless Blower", "category": "Blowers", "condition": "Excellent", "price": 110, "description": "Brushless motor, 120 MPH / 550 CFM. Battery and charger included. Quiet operation.", "image": "https://placehold.co/400x300/1a3a0a/ffffff?text=Ryobi+40V+Blower", "featured": false },
  { "id": "p010", "name": "Craftsman 2800 PSI Pressure Washer", "category": "Washers", "condition": "Good", "price": 245, "description": "2.3 GPM, 196cc engine. Includes 4 nozzle tips and 25ft hose. Seals replaced.", "image": "https://placehold.co/400x300/5a4a1a/ffffff?text=Craftsman+2800+PSI", "featured": false }
];

/* ── Cart helpers ── */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  var cart = getCart();
  if (!cart.find(function(i) { return i.id === product.id; })) {
    cart.push(product);
    saveCart(cart);
    showToast('✅ ' + product.name + ' added to cart');
  } else {
    showToast('ℹ️ Already in cart');
  }
  updateCartBadge();
}

function removeFromCart(id) {
  var cart = getCart().filter(function(i) { return i.id !== id; });
  saveCart(cart);
}

function updateCartBadge() {
  var count = getCart().length;
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });
}

/* ── Toast ── */
var toastTimer;
function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2800);
}

/* ── Product card ── */
function conditionClass(c) { return c.toLowerCase(); }

function productCardHTML(p) {
  var productJson = JSON.stringify(p).replace(/"/g, '&quot;');
  return '<div class="product-card" data-id="' + p.id + '" data-category="' + p.category + '">' +
    '<img class="product-img" src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
    '<div class="product-body">' +
      '<div class="product-meta">' +
        '<span class="condition-badge ' + conditionClass(p.condition) + '">' + p.condition + '</span>' +
        '<span class="category-tag">' + p.category + '</span>' +
      '</div>' +
      '<h3 class="product-name">' + p.name + '</h3>' +
      '<p class="product-desc">' + p.description + '</p>' +
      '<div class="product-footer">' +
        '<span class="product-price">$' + p.price + '</span>' +
        '<button class="add-to-cart" aria-label="Add ' + p.name + ' to cart" onclick="addToCart(' + productJson + ')">🛒 Add to Cart</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

/* ── Homepage featured products ── */
function initHomepage() {
  var grid = document.getElementById('featured-products');
  if (!grid) return;
  var featured = PRODUCTS_DATA.filter(function(p) { return p.featured; }).slice(0, 4);
  grid.innerHTML = featured.map(productCardHTML).join('');
}

/* ── Shop page ── */
var allProducts = [];

function initShop() {
  var grid = document.getElementById('shop-products');
  if (!grid) return;
  allProducts = PRODUCTS_DATA;
  renderShop(allProducts);
  setupCategoryFilter();
}

function renderShop(products) {
  var grid = document.getElementById('shop-products');
  var count = document.getElementById('products-count');
  if (!grid) return;
  if (count) count.textContent = 'Showing ' + products.length + ' item' + (products.length !== 1 ? 's' : '');
  if (products.length === 0) {
    grid.innerHTML = '<p>No products in this category right now.</p>';
  } else {
    grid.innerHTML = products.map(productCardHTML).join('');
  }
}

function setupCategoryFilter() {
  var chips = document.querySelectorAll('.cat-chip');
  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      chips.forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var cat = chip.dataset.category;
      var filtered = cat === 'All' ? allProducts : allProducts.filter(function(p) { return p.category === cat; });
      renderShop(filtered);
    });
  });
}

/* ── Cart page ── */
function initCart() {
  var wrap = document.getElementById('cart-wrap');
  if (!wrap) return;

  function render() {
    var cart = getCart();
    if (cart.length === 0) {
      wrap.innerHTML = '<div class="empty-cart">' +
        '<div class="empty-icon">🛒</div>' +
        '<h3>Your cart is empty</h3>' +
        '<p>Browse our refurbished equipment and find a great deal.</p>' +
        '<a href="shop.html" class="btn btn-primary">Browse the Shop</a>' +
        '</div>';
      return;
    }

    var total = cart.reduce(function(s, i) { return s + i.price; }, 0);
    var cartLayout = document.createElement('div');
    cartLayout.className = 'cart-layout';

    var itemsHTML = '';
    cart.forEach(function(item) {
      itemsHTML += '<div class="cart-item" data-id="' + item.id + '">' +
        '<img class="cart-item-img" src="' + item.image + '" alt="' + item.name + '">' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-meta">' + item.category + ' &middot; ' + item.condition + ' Condition</div>' +
        '</div>' +
        '<span class="cart-item-price">$' + item.price + '</span>' +
        '<button class="remove-btn" aria-label="Remove ' + item.name + ' from cart" onclick="removeItem(\'' + item.id + '\')">✕</button>' +
        '</div>';
    });

    var itemsCol = document.createElement('div');
    itemsCol.className = 'cart-items';
    itemsCol.innerHTML = itemsHTML;

    var sideCol = document.createElement('div');
    sideCol.className = 'cart-sidebar';
    sideCol.innerHTML = '<div class="cart-summary">' +
      '<h3>Order Summary</h3>' +
      '<div class="summary-line"><span>' + cart.length + ' item' + (cart.length !== 1 ? 's' : '') + '</span><span>$' + total + '</span></div>' +
      '<div class="summary-line"><span>Payment</span><span>In-Store / Pickup</span></div>' +
      '<div class="summary-line total"><span>Estimated Total</span><span>$' + total + '</span></div>' +
      '<div class="cart-actions">' +
        '<a href="order.html" class="btn btn-gold">Request This Order →</a>' +
        '<a href="shop.html" class="btn btn-ghost">← Keep Shopping</a>' +
      '</div>' +
      '</div>';

    cartLayout.appendChild(itemsCol);
    cartLayout.appendChild(sideCol);
    wrap.innerHTML = '';
    wrap.appendChild(cartLayout);
  }

  window.removeItem = function(id) {
    removeFromCart(id);
    render();
    showToast('Item removed from cart');
  };

  render();
}

/* ── Order page ── */
function initOrder() {
  var form = document.getElementById('order-form');
  var itemsBox = document.getElementById('order-items');
  var totalEl = document.getElementById('order-total');
  var totalWrap = document.getElementById('order-total-wrap');
  var cartInput = document.getElementById('cart-items-hidden');
  if (!form) return;

  var cart = getCart();

  if (itemsBox) {
    if (cart.length === 0) {
      itemsBox.innerHTML = '<p style="color:var(--warm-gray);font-size:.9rem">No items in cart. <a href="shop.html">Browse the shop</a>.</p>';
    } else {
      var total = cart.reduce(function(s, i) { return s + i.price; }, 0);
      var html = '';
      cart.forEach(function(i) {
        html += '<div class="order-item">' +
          '<span class="order-item-name">' + i.name + '</span>' +
          '<span class="order-item-price">$' + i.price + '</span>' +
          '</div>';
      });
      itemsBox.innerHTML = html;
      if (totalEl) totalEl.textContent = '$' + total;
      if (totalWrap) totalWrap.style.display = 'flex';
    }
  }

  if (cartInput) {
    cartInput.value = cart.map(function(i) { return i.name + ' ($' + i.price + ')'; }).join('; ');
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    var data = new FormData(form);
    fetch('https://formspree.io/f/xkokqrrn', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function(res) {
      if (res.ok) {
        form.closest('.order-form-wrap').innerHTML =
          '<div class="success-box">' +
            '<div class="success-icon">🎉</div>' +
            '<h2>Request Received!</h2>' +
            '<p>Thanks for reaching out. We\'ll contact you within 1 business day to confirm your order and arrange pickup.</p>' +
            '<a href="index.html" class="btn btn-primary">Back to Home</a>' +
          '</div>';
        saveCart([]);
      } else {
        btn.textContent = 'Send My Order Request →';
        btn.disabled = false;
        showToast('⚠️ Something went wrong. Please try again.');
      }
    }).catch(function() {
      btn.textContent = 'Send My Order Request →';
      btn.disabled = false;
      showToast('⚠️ Network error. Please check your connection.');
    });
  });
}

/* ── Mobile nav ── */
function initNav() {
  var burger = document.querySelector('.hamburger');
  var nav = document.querySelector('.main-nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', function() {
    nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.site-header')) nav.classList.remove('open');
  });
}

/* ── Active nav link ── */
function setActiveNav() {
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function(a) {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  setActiveNav();
  initNav();
  initHomepage();
  initShop();
  initCart();
  initOrder();
});
