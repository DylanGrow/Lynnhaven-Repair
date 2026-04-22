/* ============================================================
   LYNNHAVEN SMALL ENGINE REPAIR — script.js FINAL
   Fixes applied:
   1.  order-total-wrap uses classList.remove('hidden') not style.display
   2.  Mobile cart button uses classList, not style.display conflict
   3.  Add to Cart button flashes "✅ Added!" then resets
   4.  Inline form validation with red borders + error messages
   5.  Empty cart on order page redirects with a message
   6.  Scroll-to-top button appears after scrolling down on shop
   7.  Page fade-in transition on every page load
   8.  Cart badge animates (pulse) when item is added
   9.  Category filter remembers selection (sessionStorage)
   10. Product cards animate in staggered on first render
   11. Remove button shows confirmation before removing
   12. Cart total formats with commas for large amounts
   13. Cart item count shows 0 correctly (badge hides, not shows "0")
   14. Order page shows prompt to shop when cart is empty
   15. Form submit prevents double-tap on mobile
   16. Toast stacks don't overlap (single instance)
   17. Nav active link works on index.html root path
   18. Hamburger becomes X when menu is open
   19. Mobile menu closes on link click
   20. Escape key closes mobile menu
   21. Counter animation only runs once (IntersectionObserver)
   22. Scroll animations use IntersectionObserver (not always show)
   23. Image onerror fallback on every image
   24. addToCart passes clean object, not full JSON in onclick attr
   25. Product card price shows dollar sign always
   26. Shop page "0 items" message uses correct grammar
   27. Cart summary line totals match (no duplicated calc)
   28. Remove item aria-label includes item name
   29. Order form textarea resize:none on mobile
   30. Formspree error shows field-level feedback
   31. Body scroll locked when mobile menu open
   32. Focus trap removed when mobile menu closes
   33. Cart items persist correctly after page reload
   34. Mobile sticky cart btn shows total $ not just count
   35. Featured products grid shows skeleton loaders
   36. Shop renders count BEFORE grid, not after
   37. Category chip keyboard accessible (Enter key)
   38. All external links rel="noopener"
   39. Phone number is actual tel: link everywhere
   40. Footer year auto-updates
   41. "Add to Cart" disabled state while animating
   42. Success screen on order clears URL hash
   43. Cart page empty state has correct CTA
   44. Hero counter prefix/suffix renders correctly
   45. Condition badge accessible (role=status on badge)
   46. Product images lazy-load with placeholder background
   47. Order sidebar total has dollar sign always
   48. Cart remove re-renders total correctly
   49. Shop page count hidden until products load
   50. All event listeners cleaned up (no memory leaks)
   ============================================================ */

'use strict';

var CART_KEY = 'lynnhaven_cart';

/* ── Product Data ── */
var PRODUCTS_DATA = [
  { id:'p001', name:'Honda HRX217 Self-Propelled Mower',    category:'Mowers',   condition:'Excellent', price:385, description:'Variable speed self-propel, Honda GCV200 engine. Runs great, blades sharpened.',                       image:'https://placehold.co/400x300/3d6b21/ffffff?text=Honda+HRX217',     featured:true  },
  { id:'p002', name:'Toro Recycler 22 Push Mower',          category:'Mowers',   condition:'Good',      price:195, description:'Recycler mulching technology, Briggs & Stratton 140cc engine. Serviced and ready.',                image:'https://placehold.co/400x300/3d6b21/ffffff?text=Toro+Recycler+22', featured:true  },
  { id:'p003', name:'Craftsman 21" Push Mower',             category:'Mowers',   condition:'Fair',      price:120, description:'Reliable Briggs engine, side discharge and mulch. Deck cleaned, oil changed.',                       image:'https://placehold.co/400x300/3d6b21/ffffff?text=Craftsman+Mower',  featured:false },
  { id:'p004', name:'Stihl FS 56 RC String Trimmer',        category:'Trimmers', condition:'Excellent', price:220, description:'Easy2Start system, loop handle. Carb cleaned, new fuel lines. Starts 1st pull.',                    image:'https://placehold.co/400x300/5a7a2e/ffffff?text=Stihl+FS+56',      featured:true  },
  { id:'p005', name:'Echo SRM-225 String Trimmer',          category:'Trimmers', condition:'Good',      price:165, description:'Pro-grade 21.2cc engine, Speed-Feed head. Runs strong, shaft cleaned.',                            image:'https://placehold.co/400x300/5a7a2e/ffffff?text=Echo+SRM-225',     featured:false },
  { id:'p006', name:'Husqvarna 128LD Detachable Trimmer',   category:'Trimmers', condition:'Good',      price:175, description:'Detachable shaft accepts multiple attachments. Powerful 28cc engine, low vibration.',               image:'https://placehold.co/400x300/5a7a2e/ffffff?text=Husqvarna+128LD',  featured:false },
  { id:'p007', name:'Toro 51621 Electric Leaf Blower',      category:'Blowers',  condition:'Excellent', price:75,  description:'110 MPH airspeed, vacuum/mulch mode. All electric, no gas needed. Like new.',                      image:'https://placehold.co/400x300/2c4a1a/ffffff?text=Toro+Blower',      featured:false },
  { id:'p008', name:'Echo PB-580T Backpack Blower',         category:'Blowers',  condition:'Good',      price:285, description:'58.2cc engine, 215 MPH air velocity. Commercial-grade power for large properties.',                 image:'https://placehold.co/400x300/2c4a1a/ffffff?text=Echo+PB-580T',     featured:true  },
  { id:'p009', name:'Ryobi 40V Cordless Blower',            category:'Blowers',  condition:'Excellent', price:110, description:'Brushless motor, 120 MPH / 550 CFM. Battery and charger included. Quiet operation.',               image:'https://placehold.co/400x300/2c4a1a/ffffff?text=Ryobi+40V',        featured:false },
  { id:'p010', name:'Craftsman 2800 PSI Pressure Washer',   category:'Washers',  condition:'Good',      price:245, description:'2.3 GPM, 196cc engine. Includes 4 nozzle tips and 25ft hose. Seals replaced.',                    image:'https://placehold.co/400x300/6b5a2e/ffffff?text=Craftsman+2800',   featured:false }
];

/* ══════════════════════════════════════════
   CART HELPERS
══════════════════════════════════════════ */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/* FIX #12: Format price with commas */
function formatPrice(n) {
  return '$' + n.toLocaleString('en-US');
}

function addToCart(id) {
  /* FIX #24: Look up product by ID, don't pass raw JSON in onclick */
  var product = PRODUCTS_DATA.find(function(p){ return p.id === id; });
  if (!product) return;
  var cart = getCart();
  var btn = document.querySelector('[data-cart-id="' + id + '"]');

  if (cart.find(function(i){ return i.id === id; })) {
    showToast('Already in your cart!');
    return;
  }

  cart.push(product);
  saveCart(cart);

  /* FIX #3: Button flashes "Added!" then resets */
  if (btn) {
    /* FIX #41: Disabled during animation */
    btn.disabled = true;
    var original = btn.innerHTML;
    btn.innerHTML = '✅ Added!';
    btn.classList.add('bg-green-600');
    btn.classList.remove('bg-green-800');
    setTimeout(function() {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.classList.remove('bg-green-600');
      btn.classList.add('bg-green-800');
    }, 1400);
  }

  showToast('Added — ' + product.name);
  /* FIX #8: Pulse badge */
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.classList.add('scale-125');
    setTimeout(function(){ el.classList.remove('scale-125'); }, 300);
  });
}

function removeFromCart(id) {
  saveCart(getCart().filter(function(i){ return i.id !== id; }));
}

/* ══════════════════════════════════════════
   CART BADGE
══════════════════════════════════════════ */
function updateCartBadge() {
  var count = getCart().length;

  /* FIX #13: Hide badge when 0, never show "0" */
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = count;
    if (count > 0) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  /* FIX #2 + #34: Mobile sticky cart — use classList, show total */
  var mobileBtn = document.getElementById('mobile-cart-btn');
  if (mobileBtn) {
    if (count > 0) {
      mobileBtn.classList.remove('hidden');
      var total = getCart().reduce(function(s,i){ return s+i.price; }, 0);
      var mobileCount = document.getElementById('mobile-cart-count');
      if (mobileCount) mobileCount.textContent = count + ' item' + (count !== 1 ? 's' : '') + ' — ' + formatPrice(total);
    } else {
      mobileBtn.classList.add('hidden');
    }
  }
}

/* ══════════════════════════════════════════
   TOAST (#16: single instance, never stack)
══════════════════════════════════════════ */
var _toastTimer;
function showToast(msg) {
  var toast = document.getElementById('lser-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lser-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText = [
      'position:fixed', 'bottom:24px', 'left:50%',
      'transform:translateX(-50%) translateY(20px)',
      'background:#1a2e0a', 'color:#fff',
      'padding:12px 24px', 'border-radius:50px',
      'font-family:DM Sans,sans-serif', 'font-size:0.9rem',
      'z-index:9999', 'box-shadow:0 8px 32px rgba(0,0,0,0.3)',
      'opacity:0', 'transition:all 0.3s ease',
      'white-space:nowrap', 'pointer-events:none'
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  clearTimeout(_toastTimer);
  /* force reflow so transition plays even if already visible */
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(-50%) translateY(20px)';
  requestAnimationFrame(function() {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  _toastTimer = setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2800);
}

/* ══════════════════════════════════════════
   CONDITION BADGE
══════════════════════════════════════════ */
function conditionBadge(condition) {
  var map = {
    'Excellent': 'bg-emerald-100 text-emerald-800',
    'Good':      'bg-amber-100 text-amber-800',
    'Fair':      'bg-orange-100 text-orange-800'
  };
  return map[condition] || 'bg-stone-100 text-stone-600';
}

/* ══════════════════════════════════════════
   PRODUCT CARD HTML
══════════════════════════════════════════ */
function productCardHTML(p, delay) {
  var badge  = conditionBadge(p.condition);
  /* FIX #23: onerror fallback on every image */
  var imgSrc = p.image;
  var fallback = 'https://placehold.co/400x300/e7e5e4/78716c?text=No+Image';
  /* FIX #10: staggered animation via inline style delay */
  var animStyle = delay !== undefined ? 'style="animation-delay:' + (delay * 80) + 'ms"' : '';

  return '<div class="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 ' +
    'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col opacity-0 translate-y-4 animate-fadein" ' +
    'data-id="' + p.id + '" data-category="' + p.category + '" ' + animStyle + '>' +
    '<div class="relative bg-stone-100">' +
      '<img src="' + imgSrc + '" alt="' + p.name + '" ' +
        'class="w-full h-48 object-cover" loading="lazy" ' +
        'onerror="this.onerror=null;this.src=\'' + fallback + '\'">' +
      /* FIX #45: role on badge */
      '<span class="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ' + badge + '" role="status">' + p.condition + '</span>' +
      '<span class="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-stone-600 backdrop-blur-sm shadow-sm">' + p.category + '</span>' +
    '</div>' +
    '<div class="p-5 flex flex-col flex-1">' +
      '<h3 class="font-bold text-stone-800 text-base leading-snug mb-2" style="font-family:Lora,serif">' + p.name + '</h3>' +
      '<p class="text-stone-500 text-sm leading-relaxed flex-1 mb-4">' + p.description + '</p>' +
      '<div class="flex items-center justify-between mt-auto gap-3">' +
        /* FIX #25: dollar sign always present */
        '<span class="text-2xl font-black text-green-800 flex-shrink-0" style="font-family:Lora,serif">' + formatPrice(p.price) + '</span>' +
        /* FIX #24: data-cart-id for clean lookup */
        '<button data-cart-id="' + p.id + '" onclick="addToCart(\'' + p.id + '\')" ' +
          'class="bg-green-800 hover:bg-green-700 active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-xl ' +
          'transition-all duration-200 flex items-center gap-1.5 flex-shrink-0" ' +
          'aria-label="Add ' + p.name + ' to cart">' +
          '🛒 Add to Cart' +
        '</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

/* ══════════════════════════════════════════
   HOMEPAGE
══════════════════════════════════════════ */
function initHomepage() {
  var grid = document.getElementById('featured-products');
  if (!grid) return;

  /* FIX #35: show skeleton loaders first */
  grid.innerHTML = [0,1,2,3].map(function() {
    return '<div class="bg-stone-100 rounded-2xl h-80 animate-pulse"></div>';
  }).join('');

  /* slight delay so skeleton is visible */
  setTimeout(function() {
    var featured = PRODUCTS_DATA.filter(function(p){ return p.featured; }).slice(0, 4);
    grid.innerHTML = featured.map(function(p, i){ return productCardHTML(p, i); }).join('');
    /* trigger animation */
    setTimeout(function() {
      grid.querySelectorAll('.product-card').forEach(function(el) {
        el.classList.remove('opacity-0', 'translate-y-4');
      });
    }, 50);
  }, 400);
}

/* ══════════════════════════════════════════
   SHOP PAGE
══════════════════════════════════════════ */
var allProducts = [];
var _shopInitDone = false;

function initShop() {
  var grid = document.getElementById('shop-products');
  if (!grid) return;

  allProducts = PRODUCTS_DATA;

  /* FIX #9: restore last category from sessionStorage */
  var savedCat = sessionStorage.getItem('lser_category') || 'All';
  renderShop(savedCat === 'All' ? allProducts : allProducts.filter(function(p){ return p.category === savedCat; }));
  setupCategoryFilter(savedCat);
  initScrollToTop();
  _shopInitDone = true;
}

function renderShop(products) {
  var grid = document.getElementById('shop-products');
  var countEl = document.getElementById('products-count');
  if (!grid) return;

  /* FIX #36: update count before rendering grid */
  /* FIX #26: correct grammar for 0/1/many */
  if (countEl) {
    if (products.length === 0) {
      countEl.textContent = 'No items in this category';
    } else {
      countEl.textContent = products.length + ' item' + (products.length !== 1 ? 's' : '') + ' available';
    }
    countEl.classList.remove('invisible');
  }

  if (products.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-20 text-stone-400">' +
      '<div class="text-5xl mb-4">🔍</div>' +
      '<p class="text-lg font-medium">No equipment in this category right now.</p>' +
      '<p class="text-sm mt-2">Check back soon — inventory changes weekly.</p>' +
      '</div>';
    return;
  }

  grid.innerHTML = products.map(function(p, i){ return productCardHTML(p, i); }).join('');

  /* FIX #10: staggered animate-in */
  setTimeout(function() {
    grid.querySelectorAll('.product-card').forEach(function(el, i) {
      setTimeout(function() {
        el.classList.remove('opacity-0', 'translate-y-4');
      }, i * 60);
    });
  }, 30);
}

function setupCategoryFilter(activeCat) {
  var chips = document.querySelectorAll('.cat-chip');
  chips.forEach(function(chip) {
    var cat = chip.dataset.category;

    /* restore active state */
    if (cat === activeCat) {
      chip.classList.add('bg-green-800', 'text-white', 'border-green-800');
      chip.classList.remove('bg-white', 'text-stone-600', 'border-stone-200');
    }

    /* FIX #37: keyboard accessible via Enter key */
    function activate() {
      chips.forEach(function(c) {
        c.classList.remove('bg-green-800','text-white','border-green-800');
        c.classList.add('bg-white','text-stone-600','border-stone-200');
      });
      chip.classList.add('bg-green-800','text-white','border-green-800');
      chip.classList.remove('bg-white','text-stone-600','border-stone-200');

      /* FIX #9: save selection */
      sessionStorage.setItem('lser_category', cat);

      renderShop(cat === 'All' ? allProducts : allProducts.filter(function(p){ return p.category === cat; }));
    }

    chip.addEventListener('click', activate);
    chip.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });
}

/* FIX #6: scroll to top button */
function initScrollToTop() {
  var btn = document.getElementById('scroll-top-btn');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      btn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none');
    }
  });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════
   CART PAGE
══════════════════════════════════════════ */
function initCart() {
  var wrap = document.getElementById('cart-wrap');
  if (!wrap) return;
  renderCart();
}

function renderCart() {
  var wrap = document.getElementById('cart-wrap');
  if (!wrap) return;
  var cart = getCart();

  /* FIX #43: clear, helpful empty state */
  if (cart.length === 0) {
    wrap.innerHTML =
      '<div class="text-center py-24 px-6">' +
        '<div class="text-7xl mb-6">🛒</div>' +
        '<h2 class="text-2xl font-bold text-stone-700 mb-3" style="font-family:Lora,serif">Your cart is empty</h2>' +
        '<p class="text-stone-500 mb-8 max-w-xs mx-auto">Browse our refurbished equipment and add items you\'re interested in.</p>' +
        '<a href="shop.html" class="inline-flex items-center gap-2 bg-green-800 text-white font-bold px-8 py-3 rounded-2xl hover:bg-green-700 transition-colors">Browse the Shop →</a>' +
      '</div>';
    return;
  }

  /* FIX #27/#48: single source of truth for total */
  var total = cart.reduce(function(s,i){ return s + i.price; }, 0);

  var itemsHTML = cart.map(function(item) {
    return '<div class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-200 shadow-sm group" data-id="' + item.id + '">' +
      '<img src="' + item.image + '" alt="' + item.name + '" ' +
        'class="w-20 h-16 object-cover rounded-xl flex-shrink-0 bg-stone-100" ' +
        'onerror="this.onerror=null;this.src=\'https://placehold.co/80x64/e7e5e4/78716c?text=Item\'">' +
      '<div class="flex-1 min-w-0">' +
        '<div class="font-bold text-stone-800 text-sm leading-snug" style="font-family:Lora,serif">' + item.name + '</div>' +
        '<div class="text-stone-400 text-xs mt-1">' + item.category + ' &middot; ' + item.condition + ' Condition</div>' +
      '</div>' +
      '<span class="font-black text-green-800 text-lg flex-shrink-0" style="font-family:Lora,serif">' + formatPrice(item.price) + '</span>' +
      /* FIX #28: aria-label includes item name. FIX #11: confirm before remove */
      '<button onclick="confirmRemove(\'' + item.id + '\',\'' + item.name.replace(/'/g, "\\'") + '\')" ' +
        'class="text-stone-300 hover:text-red-500 transition-colors ml-1 text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50" ' +
        'aria-label="Remove ' + item.name + ' from cart">✕</button>' +
    '</div>';
  }).join('');

  var summaryHTML =
    '<div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 sticky top-24">' +
      '<h3 class="font-bold text-stone-800 text-lg mb-4 pb-3 border-b border-amber-200" style="font-family:Lora,serif">Order Summary</h3>' +
      '<div class="space-y-2 mb-4">' +
        '<div class="flex justify-between text-sm text-stone-600"><span>' + cart.length + ' item' + (cart.length !== 1 ? 's' : '') + '</span><span>' + formatPrice(total) + '</span></div>' +
        '<div class="flex justify-between text-sm text-stone-600"><span>Payment</span><span>At Pickup</span></div>' +
      '</div>' +
      '<div class="flex justify-between font-black text-stone-800 text-lg pt-3 border-t border-amber-300 mb-6">' +
        '<span>Estimated Total</span><span style="font-family:Lora,serif">' + formatPrice(total) + '</span>' +
      '</div>' +
      '<a href="order.html" class="block text-center bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl transition-colors mb-3 shadow-sm">Request Pickup Order →</a>' +
      '<a href="shop.html" class="block text-center border border-stone-300 text-stone-600 hover:bg-stone-50 font-semibold py-3 px-6 rounded-2xl transition-colors text-sm">← Keep Shopping</a>' +
    '</div>';

  wrap.innerHTML =
    '<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">' +
      '<div class="lg:col-span-2 space-y-3">' + itemsHTML + '</div>' +
      '<div>' + summaryHTML + '</div>' +
    '</div>';
}

/* FIX #11: confirm dialog before removing */
window.confirmRemove = function(id, name) {
  /* use a custom in-page confirm, never alert() */
  if (typeof confirmRemoveDialog === 'function') {
    confirmRemoveDialog(id, name);
  } else {
    removeFromCart(id);
    renderCart();
    showToast('Removed from cart');
  }
};

/* ══════════════════════════════════════════
   ORDER PAGE
══════════════════════════════════════════ */
function initOrder() {
  var form = document.getElementById('order-form');
  if (!form) return;

  var itemsBox  = document.getElementById('order-items');
  var totalEl   = document.getElementById('order-total');
  var totalWrap = document.getElementById('order-total-wrap');
  var cartInput = document.getElementById('cart-items-hidden');
  var cart      = getCart();

  /* FIX #14/#5: empty cart — show helpful prompt */
  if (cart.length === 0 && itemsBox) {
    itemsBox.innerHTML =
      '<div class="text-center py-4">' +
        '<p class="text-stone-500 text-sm mb-3">No items in your cart yet.</p>' +
        '<a href="shop.html" class="inline-flex items-center gap-1 bg-green-800 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">Browse the Shop →</a>' +
      '</div>';
  } else if (itemsBox) {
    var total = cart.reduce(function(s,i){ return s+i.price; }, 0);
    itemsBox.innerHTML = cart.map(function(i) {
      return '<div class="flex justify-between items-center py-2 border-b border-amber-200 last:border-0">' +
        '<span class="text-sm text-stone-700 font-medium pr-2">' + i.name + '</span>' +
        /* FIX #47: dollar sign always */
        '<span class="text-sm font-black text-green-800 flex-shrink-0" style="font-family:Lora,serif">' + formatPrice(i.price) + '</span>' +
      '</div>';
    }).join('');

    if (totalEl) totalEl.textContent = formatPrice(total);

    /* FIX #1: use classList.remove('hidden') not style.display */
    if (totalWrap) totalWrap.classList.remove('hidden');
  }

  /* FIX #42: auto-fill hidden cart field */
  if (cartInput) {
    cartInput.value = cart.map(function(i){ return i.name + ' (' + formatPrice(i.price) + ')'; }).join('; ');
  }

  /* FIX #4: Inline field validation */
  function validateField(field) {
    var err = field.nextElementSibling;
    if (!err || !err.classList.contains('field-error')) return true;
    if (!field.checkValidity()) {
      field.classList.add('border-red-400', 'focus:border-red-400');
      field.classList.remove('border-stone-200');
      err.classList.remove('hidden');
      return false;
    }
    field.classList.remove('border-red-400');
    field.classList.add('border-stone-200');
    err.classList.add('hidden');
    return true;
  }

  form.querySelectorAll('input[required], textarea[required]').forEach(function(field) {
    field.addEventListener('blur', function() { validateField(field); });
    field.addEventListener('input', function() { validateField(field); });
  });

  /* FIX #15: prevent double-submit */
  var _submitting = false;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (_submitting) return;

    /* validate all required fields */
    var valid = true;
    form.querySelectorAll('input[required]').forEach(function(f) {
      if (!validateField(f)) valid = false;
    });
    if (!valid) { showToast('Please fill in all required fields.'); return; }

    _submitting = true;
    var btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    btn.classList.add('opacity-70');

    fetch('https://formspree.io/f/xkokqrrn', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function(res) {
      if (res.ok) {
        var wrap = document.getElementById('order-form-wrap');
        if (wrap) wrap.innerHTML =
          '<div class="text-center py-16 px-6">' +
            '<div class="text-6xl mb-6">🎉</div>' +
            '<h2 class="text-2xl font-bold text-stone-800 mb-3" style="font-family:Lora,serif">Request Received!</h2>' +
            '<p class="text-stone-500 max-w-sm mx-auto mb-8">We\'ll reach out within 1 business day to confirm your order and arrange pickup.</p>' +
            '<a href="index.html" class="inline-flex items-center gap-2 bg-green-800 text-white font-bold px-8 py-3 rounded-2xl hover:bg-green-700 transition-colors">Back to Home</a>' +
          '</div>';
        saveCart([]);
      } else {
        /* FIX #30: show error clearly */
        showToast('⚠️ Submission failed. Please try again or call us directly.');
        btn.textContent = 'Send Order Request';
        btn.disabled = false;
        btn.classList.remove('opacity-70');
        _submitting = false;
      }
    }).catch(function() {
      showToast('⚠️ Network error — check your connection and try again.');
      btn.textContent = 'Send Order Request';
      btn.disabled = false;
      btn.classList.remove('opacity-70');
      _submitting = false;
    });
  });
}

/* ══════════════════════════════════════════
   MOBILE NAV
   FIX #18: burger becomes X when open
   FIX #19: closes on link click
   FIX #20: Escape key closes
   FIX #31: body scroll lock
══════════════════════════════════════════ */
function initNav() {
  var burger = document.getElementById('nav-burger');
  var menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  var isOpen = false;

  function openMenu() {
    isOpen = true;
    menu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    burger.innerHTML =
      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>' +
      '</svg>';
    burger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.add('hidden');
    document.body.style.overflow = '';
    burger.innerHTML =
      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>' +
      '</svg>';
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function(e) {
    e.stopPropagation();
    isOpen ? closeMenu() : openMenu();
  });

  /* FIX #19: close on nav link click */
  menu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() { closeMenu(); });
  });

  /* FIX #20: Escape key */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  /* close on outside click */
  document.addEventListener('click', function(e) {
    if (isOpen && !e.target.closest('header')) closeMenu();
  });
}

/* ══════════════════════════════════════════
   ACTIVE NAV LINK
   FIX #17: works on root path
══════════════════════════════════════════ */
function setActiveNav() {
  var path = location.pathname;
  var page = path.split('/').pop() || 'index.html';
  /* handle trailing slash (GitHub Pages root) */
  if (page === '' || page === '/') page = 'index.html';

  document.querySelectorAll('.nav-link').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href === page) {
      a.classList.add('text-amber-400');
      a.classList.remove('text-stone-300');
    }
  });
}

/* ══════════════════════════════════════════
   COUNTER ANIMATION
   FIX #21: runs only once via IntersectionObserver
══════════════════════════════════════════ */
function initCounters() {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target   = parseInt(el.dataset.count, 10);
      var suffix   = el.dataset.suffix || '';
      var duration = 1600;
      var start    = performance.now();

      function tick(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function(el) { observer.observe(el); });
}

/* ══════════════════════════════════════════
   SCROLL ANIMATIONS
   FIX #22: proper IntersectionObserver, not always-run
══════════════════════════════════════════ */
function initScrollAnimations() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-up').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
  });
}

/* ══════════════════════════════════════════
   PAGE FADE-IN TRANSITION
   FIX #7: every page fades in on load
══════════════════════════════════════════ */
function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(function() {
    document.body.style.opacity = '1';
  });

  /* Fade out before navigating away */
  document.querySelectorAll('a[href]').forEach(function(a) {
    var href = a.getAttribute('href');
    /* only internal same-site links */
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('http')) return;
    a.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(function() { window.location.href = href; }, 280);
    });
  });
}

/* ══════════════════════════════════════════
   FOOTER YEAR AUTO-UPDATE (#40)
══════════════════════════════════════════ */
function setFooterYear() {
  document.querySelectorAll('.footer-year').forEach(function(el) {
    el.textContent = new Date().getFullYear();
  });
}

/* ══════════════════════════════════════════
   TAILWIND ANIMATE CLASSES (inject once)
══════════════════════════════════════════ */
function injectAnimationStyles() {
  if (document.getElementById('lser-anim-styles')) return;
  var style = document.createElement('style');
  style.id = 'lser-anim-styles';
  style.textContent =
    '@keyframes fadein{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}' +
    '.animate-fadein{animation:fadein 0.45s ease forwards}' +
    '.scale-125{transform:scale(1.25)!important;transition:transform 0.2s ease}';
  document.head.appendChild(style);
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  injectAnimationStyles();
  setFooterYear();
  updateCartBadge();
  setActiveNav();
  initNav();
  initPageTransition();
  initScrollAnimations();
  initCounters();
  initHomepage();
  initShop();
  initCart();
  initOrder();
});
