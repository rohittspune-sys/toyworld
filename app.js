// Gen X Toybox SPA
// Data models
const PRODUCTS = [
  {
    id: 'retro-console',
    name: 'Retro Pocket Console',
    type: 'Retro',
    brand: 'Hasbro',
    focus: 'Problem Solving',
    age: '9+',
    priceCents: 6999,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1603484477859-abe6a73f9368?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'lego-stem-bot',
    name: 'LEGO STEM Robot Kit',
    type: 'STEM',
    brand: 'LEGO',
    focus: 'STEM',
    age: '9+',
    priceCents: 8999,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a566?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'plush-buddy',
    name: 'Plush Buddy Bear',
    type: 'Plush',
    brand: 'Fisher-Price',
    focus: 'Fine Motor',
    age: '3+',
    priceCents: 1999,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1611583449833-fb46bdf2c2fe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'diecast-racer',
    name: 'Diecast City Racer',
    type: 'Vehicles',
    brand: 'Mattel',
    focus: 'Creativity',
    age: '6+',
    priceCents: 1499,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'retro-board',
    name: 'Retro Board Game Classics',
    type: 'Games',
    brand: 'Hasbro',
    focus: 'Problem Solving',
    age: '9+',
    priceCents: 3499,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'dino-figures',
    name: 'Dinosaur Figure Set',
    type: 'Figures',
    brand: 'Mattel',
    focus: 'Creativity',
    age: '6+',
    priceCents: 2599,
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a924d4?q=80&w=1200&auto=format&fit=crop',
  },
];

const CATEGORIES = ['All', 'Retro', 'STEM', 'Plush', 'Vehicles', 'Games', 'Figures'];

const state = {
  query: '',
  category: 'All',
  filters: { age: '', type: '', brand: '', price: '', focus: '' },
  sort: 'featured',
  cart: loadJson('gxt.cart', []),
  wishlist: loadJson('gxt.wishlist', []),
  promos: loadJson('gxt.promos', ['WELCOME10']),
  orders: loadJson('gxt.orders', [
    { id: 'GX' + Math.random().toString(36).slice(2, 7).toUpperCase(), status: 'Shipped', eta: '2 days' },
  ]),
  reviews: loadJson('gxt.reviews', {}),
  currentProductId: null,
};

const els = {
  grid: document.getElementById('productGrid'),
  chips: document.getElementById('categoryChips'),
  search: document.getElementById('searchInput'),
  sort: document.getElementById('sortSelect'),
  wishlistBtn: document.getElementById('wishlistButton'),
  wishlistBadge: document.getElementById('wishlistBadge'),
  wishlistOverlay: document.getElementById('wishlistOverlay'),
  wishlistDrawer: document.getElementById('wishlistDrawer'),
  closeWishlist: document.getElementById('closeWishlist'),
  wishlistItems: document.getElementById('wishlistItems'),
  cartBtn: document.getElementById('cartButton'),
  cartBadge: document.getElementById('cartBadge'),
  cartOverlay: document.getElementById('cartOverlay'),
  cartDrawer: document.getElementById('cartDrawer'),
  closeCart: document.getElementById('closeCart'),
  cartItems: document.getElementById('cartItems'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  paypalBtn: document.getElementById('paypalBtn'),
  stripeBtn: document.getElementById('stripeBtn'),
  checkoutOverlay: document.getElementById('checkoutOverlay'),
  checkoutModal: document.getElementById('checkoutModal'),
  closeCheckout: document.getElementById('closeCheckout'),
  checkoutForm: document.getElementById('checkoutForm'),
  toast: document.getElementById('toast'),
  blogGrid: document.getElementById('blogGrid'),
  newsletterForm: document.getElementById('newsletterForm'),
  contactForm: document.getElementById('contactForm'),
  trackForm: document.getElementById('trackForm'),
  trackResult: document.getElementById('trackResult'),
  inventoryList: document.getElementById('inventoryList'),
  ordersList: document.getElementById('ordersList'),
  promoForm: document.getElementById('promoForm'),
  promoList: document.getElementById('promoList'),
  salesChart: document.getElementById('salesChart'),
};

function loadJson(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function formatPrice(cents) { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(cents / 100); }

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => els.toast.classList.remove('show'), 1800);
}

// Filters
function renderCategoryChips() {
  els.chips.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.role = 'tab';
    btn.textContent = cat;
    btn.setAttribute('aria-selected', state.category === cat ? 'true' : 'false');
    btn.addEventListener('click', () => { state.category = cat; renderCategoryChips(); renderProducts(); });
    els.chips.appendChild(btn);
  });
}

function productMatchesFilters(p) {
  const q = state.query.trim().toLowerCase();
  if (q && !p.name.toLowerCase().includes(q)) return false;
  if (state.category !== 'All' && p.type !== state.category) return false;
  const { age, type, brand, price, focus } = state.filters;
  if (age && p.age !== age) return false;
  if (type && p.type !== type) return false;
  if (brand && p.brand !== brand) return false;
  if (focus && p.focus !== focus) return false;
  if (price) {
    const [min, max] = price.split('-');
    const dollars = p.priceCents / 100;
    if (min && max && (dollars < +min || dollars > +max)) return false;
    if (min && !max && dollars < +min) return false;
    if (!min && max && dollars > +max) return false;
  }
  return true;
}

function sortProducts(list) {
  switch (state.sort) {
    case 'priceAsc': return list.slice().sort((a,b) => a.priceCents - b.priceCents);
    case 'priceDesc': return list.slice().sort((a,b) => b.priceCents - a.priceCents);
    case 'nameAsc': return list.slice().sort((a,b) => a.name.localeCompare(b.name));
    case 'ratingDesc': return list.slice().sort((a,b) => b.rating - a.rating);
    default: return list;
  }
}

function renderProducts() {
  const items = sortProducts(PRODUCTS.filter(productMatchesFilters));
  els.grid.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.textContent = 'No toys found. Try different filters or search.';
    empty.style.color = 'var(--muted)';
    empty.style.padding = '20px';
    els.grid.appendChild(empty);
    return;
  }
  const tpl = document.getElementById('productCardTemplate');
  items.forEach(p => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const img = node.querySelector('img');
    img.src = p.imageUrl; img.alt = p.name; img.loading = 'lazy';
    node.querySelector('.name').textContent = p.name;
    node.querySelector('.meta').textContent = `${p.brand} • ${p.type} • ${p.age} • ★ ${p.rating.toFixed(1)}`;
    node.querySelector('.price-tag').textContent = formatPrice(p.priceCents);
    node.querySelector('.add-btn').addEventListener('click', () => { addToCart(p.id); showToast('Added to cart'); });
    node.querySelector('.wish-btn').addEventListener('click', () => { addToWishlist(p.id); showToast('Saved to wishlist'); });
    node.querySelector('.media').addEventListener('click', () => openProduct(p.id));
    node.querySelector('.name').addEventListener('click', () => openProduct(p.id));
    els.grid.appendChild(node);
  });
}

// Cart
function getCartItem(productId) { return state.cart.find(i => i.productId === productId); }
function addToCart(productId, quantity = 1) {
  const existing = getCartItem(productId);
  if (existing) existing.quantity += quantity; else state.cart.push({ productId, quantity });
  saveJson('gxt.cart', state.cart);
  renderCart();
}
function removeFromCart(productId) { state.cart = state.cart.filter(i => i.productId !== productId); saveJson('gxt.cart', state.cart); renderCart(); }
function setCartQty(productId, quantity) { const item = getCartItem(productId); if (!item) return; item.quantity = Math.max(1, quantity | 0); saveJson('gxt.cart', state.cart); renderCart(); }
function cartTotalCents() { return state.cart.reduce((sum, i) => { const p = PRODUCTS.find(p => p.id === i.productId); return sum + (p ? p.priceCents * i.quantity : 0); }, 0); }
function renderCart() {
  els.cartItems.innerHTML = '';
  if (state.cart.length === 0) {
    const empty = document.createElement('div');
    empty.style.color = 'var(--muted)'; empty.style.padding = '12px'; empty.textContent = 'Your cart is empty.'; els.cartItems.appendChild(empty);
  } else {
    const tpl = document.getElementById('cartItemTemplate');
    state.cart.forEach(i => {
      const product = PRODUCTS.find(p => p.id === i.productId); if (!product) return;
      const node = tpl.content.firstElementChild.cloneNode(true);
      node.querySelector('.thumb').src = product.imageUrl;
      node.querySelector('.thumb').alt = product.name;
      node.querySelector('.name').textContent = product.name;
      node.querySelector('.price').textContent = formatPrice(product.priceCents);
      const qtyInput = node.querySelector('.qty-input');
      qtyInput.value = String(i.quantity);
      qtyInput.addEventListener('change', e => setCartQty(product.id, parseInt(e.target.value, 10) || 1));
      node.querySelector('[data-action="increment"]').addEventListener('click', () => setCartQty(product.id, i.quantity + 1));
      node.querySelector('[data-action="decrement"]').addEventListener('click', () => setCartQty(product.id, i.quantity - 1));
      node.querySelector('.remove').addEventListener('click', () => removeFromCart(product.id));
      node.querySelector('.wish').addEventListener('click', () => addToWishlist(product.id));
      els.cartItems.appendChild(node);
    });
  }
  els.cartSubtotal.textContent = formatPrice(cartTotalCents());
  updateBadges();
}

// Wishlist
function addToWishlist(productId) { if (!state.wishlist.includes(productId)) state.wishlist.push(productId); saveJson('gxt.wishlist', state.wishlist); renderWishlist(); updateBadges(); }
function removeFromWishlist(productId) { state.wishlist = state.wishlist.filter(id => id !== productId); saveJson('gxt.wishlist', state.wishlist); renderWishlist(); updateBadges(); }
function renderWishlist() {
  els.wishlistItems.innerHTML = '';
  if (state.wishlist.length === 0) {
    const empty = document.createElement('div'); empty.style.color = 'var(--muted)'; empty.style.padding = '12px'; empty.textContent = 'Your wishlist is empty.'; els.wishlistItems.appendChild(empty); return;
  }
  const tpl = document.getElementById('wishlistItemTemplate');
  state.wishlist.forEach(id => {
    const p = PRODUCTS.find(p => p.id === id); if (!p) return;
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector('.thumb').src = p.imageUrl; node.querySelector('.thumb').alt = p.name;
    node.querySelector('.name').textContent = p.name; node.querySelector('.price').textContent = formatPrice(p.priceCents);
    node.querySelector('.add').addEventListener('click', () => addToCart(p.id));
    node.querySelector('.remove').addEventListener('click', () => removeFromWishlist(p.id));
    els.wishlistItems.appendChild(node);
  });
}

function updateBadges() {
  const cartCount = state.cart.reduce((n, i) => n + i.quantity, 0);
  els.cartBadge.textContent = String(cartCount);
  els.wishlistBadge.textContent = String(state.wishlist.length);
}

// Checkout and payments (placeholders)
function openCart() { els.cartOverlay.hidden = false; els.cartDrawer.hidden = false; }
function closeCart() { els.cartOverlay.hidden = true; els.cartDrawer.hidden = true; }
function openWishlist() { els.wishlistOverlay.hidden = false; els.wishlistDrawer.hidden = false; }
function closeWishlist() { els.wishlistOverlay.hidden = true; els.wishlistDrawer.hidden = true; }
function openCheckout() { els.checkoutOverlay.hidden = false; els.checkoutModal.hidden = false; }
function closeCheckout() { els.checkoutOverlay.hidden = true; els.checkoutModal.hidden = true; }

function handleCheckoutSubmit(e) {
  e.preventDefault();
  if (state.cart.length === 0) { showToast('Your cart is empty'); return; }
  const data = new FormData(els.checkoutForm);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const address = (data.get('address') || '').toString().trim();
  const city = (data.get('city') || '').toString().trim();
  const zip = (data.get('zip') || '').toString().trim();
  const card = (data.get('card') || '').toString().replace(/\s+/g, '');
  if (!name || !email || !address || !city || !zip || card.length < 12) { showToast('Please fill in all details'); return; }
  const orderId = 'GX' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const total = formatPrice(cartTotalCents());
  state.orders.unshift({ id: orderId, status: 'Processing', eta: '3–5 days' });
  saveJson('gxt.orders', state.orders);
  state.cart = []; saveJson('gxt.cart', state.cart); renderCart();
  closeCheckout(); closeCart();
  showToast(`Order ${orderId} placed! Total ${total}`);
}

function mockPay(provider) { if (state.cart.length === 0) { showToast('Your cart is empty'); return; } showToast(`${provider} checkout (demo)`); openCheckout(); }

// Blog
const BLOG_POSTS = [
  { id: 'trend-90s', title: 'Top 5 90s Toys Making a Comeback', date: '2025-05-18', excerpt: 'From tamagotchis to board games, nostalgia is back in play.', image: '', url: '#' },
  { id: 'stem-learning', title: 'How STEM Toys Boost Critical Thinking', date: '2025-04-22', excerpt: 'Hands-on kits that turn curiosity into skills.', image: '', url: '#' },
  { id: 'care-plush', title: 'Caring for Plush Toys: A Quick Guide', date: '2025-03-12', excerpt: 'Keep plush friends cozy and clean with simple steps.', image: '', url: '#' },
];

function renderBlog() {
  els.blogGrid.innerHTML = '';
  BLOG_POSTS.forEach(p => {
    const card = document.createElement('article'); card.className = 'post-card';
    const media = document.createElement('div'); media.className = 'media';
    const body = document.createElement('div'); body.className = 'body';
    const h3 = document.createElement('h3'); h3.textContent = p.title;
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = new Date(p.date).toLocaleDateString();
    const pEl = document.createElement('p'); pEl.textContent = p.excerpt;
    body.appendChild(h3); body.appendChild(meta); body.appendChild(pEl);
    card.appendChild(media); card.appendChild(body);
    els.blogGrid.appendChild(card);
  });
}

// Contact
function handleContactSubmit(e) {
  e.preventDefault();
  const data = new FormData(els.contactForm);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const message = (data.get('message') || '').toString().trim();
  if (!name || !email || !message) { showToast('Please complete the form'); return; }
  showToast('Thanks! We will be in touch.');
  els.contactForm.reset();
}

// Newsletter
function handleNewsletterSubmit(e) { e.preventDefault(); showToast('Subscribed! Welcome to Gen X Toybox.'); e.target.reset(); }

// Tracking
function handleTrackSubmit(e) {
  e.preventDefault();
  const id = (new FormData(els.trackForm).get('orderId') || '').toString().trim().toUpperCase();
  if (!id) { els.trackResult.textContent = 'Enter a valid order ID.'; return; }
  const order = state.orders.find(o => o.id.toUpperCase() === id);
  els.trackResult.textContent = order ? `Order ${order.id}: ${order.status} • ETA ${order.eta}` : 'Order not found.';
}

// Admin
function renderInventory() {
  els.inventoryList.innerHTML = '';
  PRODUCTS.forEach(p => {
    const row = document.createElement('div');
    row.textContent = `${p.name} — ${p.brand} — ${p.type} — ${formatPrice(p.priceCents)}`;
    els.inventoryList.appendChild(row);
  });
}
function renderOrders() {
  els.ordersList.innerHTML = '';
  state.orders.forEach(o => { const row = document.createElement('div'); row.textContent = `${o.id} — ${o.status} — ETA ${o.eta}`; els.ordersList.appendChild(row); });
}
function renderPromos() { els.promoList.innerHTML = ''; state.promos.forEach(code => { const li = document.createElement('li'); li.textContent = code; els.promoList.appendChild(li); }); }
function handlePromoSubmit(e) { e.preventDefault(); const code = (new FormData(els.promoForm).get('code') || '').toString().trim(); if (!code) return; state.promos.unshift(code.toUpperCase()); saveJson('gxt.promos', state.promos); renderPromos(); els.promoForm.reset(); showToast('Promotion added'); }

function renderChart() {
  if (!els.salesChart) return;
  const ctx = els.salesChart.getContext('2d');
  // eslint-disable-next-line no-undef
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ label: 'Sales', data: [12, 19, 16, 22, 28, 34], borderColor: '#ff3e6c', backgroundColor: 'rgba(255,62,108,0.15)', fill: true, tension: 0.35 }],
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { precision: 0 } } } },
  });
}

function getBenefitsText(p) {
  const benefitsByType = {
    Retro: ['Nostalgic design', 'Family-friendly fun'],
    STEM: ['Hands-on learning', 'Builds critical thinking'],
    Plush: ['Soft and safe', 'Comfort friend'],
    Vehicles: ['Imaginative play', 'Durable build'],
    Games: ['Problem solving', 'Social play'],
    Figures: ['Collectible quality', 'Creative storytelling'],
  };
  const benefits = benefitsByType[p.type] || ['Quality materials', 'Great gift'];
  return 'Benefits: ' + benefits.join(' • ');
}

function getReviews(productId) { return state.reviews[productId] || []; }
function saveReviews() { saveJson('gxt.reviews', state.reviews); }

function renderReviews() {
  if (!state.currentProductId) return;
  const list = getReviews(state.currentProductId);
  const container = document.getElementById('reviewList');
  const tpl = document.getElementById('reviewItemTemplate');
  container.innerHTML = '';
  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.textContent = 'No reviews yet.';
    empty.className = 'muted';
    container.appendChild(empty);
    return;
  }
  list.forEach(r => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector('.review-name').textContent = r.name;
    node.querySelector('.review-rating').textContent = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    node.querySelector('.review-text').textContent = r.comment;
    container.appendChild(node);
  });
}

function handleReviewSubmit(e) {
  e.preventDefault();
  if (!state.currentProductId) return;
  const form = document.getElementById('reviewForm');
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const rating = parseInt((data.get('rating') || '5').toString(), 10) || 5;
  const comment = (data.get('comment') || '').toString().trim();
  if (!name || !comment) { showToast('Please add your name and comment'); return; }
  const arr = getReviews(state.currentProductId).slice();
  arr.unshift({ name, rating, comment, at: Date.now() });
  state.reviews[state.currentProductId] = arr;
  saveReviews();
  form.reset();
  renderReviews();
  showToast('Thanks for your review!');
}

function openProduct(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  state.currentProductId = productId;
  const titleEl = document.getElementById('productTitle');
  const imgEl = document.getElementById('productImage');
  const metaEl = document.getElementById('productMeta');
  const benEl = document.getElementById('productBenefits');
  const addCart = document.getElementById('productAddCart');
  const addWish = document.getElementById('productAddWish');
  titleEl.textContent = p.name;
  imgEl.src = p.imageUrl; imgEl.alt = p.name;
  metaEl.textContent = `${p.brand} • ${p.type} • ${p.age} • ${formatPrice(p.priceCents)} • ★ ${p.rating.toFixed(1)}`;
  benEl.textContent = getBenefitsText(p);
  addCart.onclick = () => addToCart(p.id);
  addWish.onclick = () => addToWishlist(p.id);
  renderReviews();
  const overlay = document.getElementById('productOverlay');
  const modal = document.getElementById('productModal');
  overlay.hidden = false; modal.hidden = false;
  const form = document.getElementById('reviewForm');
  form.onsubmit = handleReviewSubmit;
}

function closeProduct() {
  const overlay = document.getElementById('productOverlay');
  const modal = document.getElementById('productModal');
  overlay.hidden = true; modal.hidden = true;
}

// Utilities
function debounce(fn, delay = 250) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; }

function wireEvents() {
  document.getElementById('year').textContent = String(new Date().getFullYear());
  // Search and sort
  els.search.addEventListener('input', debounce(e => { state.query = e.target.value; renderProducts(); }, 200));
  els.sort.addEventListener('change', e => { state.sort = e.target.value; renderProducts(); });
  // Filters
  const filterIds = ['filterAge','filterType','filterBrand','filterPrice','filterFocus'];
  filterIds.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('change', () => { const k = id.replace('filter','').toLowerCase(); state.filters[k] = el.value; renderProducts(); });
  });
  // Carousel
  const track = document.getElementById('collectionTrack');
  document.querySelectorAll('.carousel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.getAttribute('data-dir');
      track.scrollBy({ left: dir === 'next' ? 360 : -360, behavior: 'smooth' });
    });
  });
  track.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-collection');
      const map = { retro: 'Retro', modern: 'STEM', collectors: 'Figures' };
      state.category = map[key] || 'All';
      renderCategoryChips();
      renderProducts();
      location.hash = '#shop';
    });
  });
  // Cart
  els.cartBtn.addEventListener('click', openCart);
  els.cartOverlay.addEventListener('click', closeCart);
  els.closeCart.addEventListener('click', closeCart);
  els.checkoutBtn.addEventListener('click', () => { closeCart(); openCheckout(); });
  els.checkoutOverlay.addEventListener('click', closeCheckout);
  els.closeCheckout.addEventListener('click', closeCheckout);
  els.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  // Wishlist
  els.wishlistBtn.addEventListener('click', openWishlist);
  els.wishlistOverlay.addEventListener('click', closeWishlist);
  els.closeWishlist.addEventListener('click', closeWishlist);
  // Product modal
  document.getElementById('productOverlay').addEventListener('click', closeProduct);
  document.getElementById('closeProduct').addEventListener('click', closeProduct);
  // Payments
  els.paypalBtn.addEventListener('click', () => mockPay('PayPal'));
  els.stripeBtn.addEventListener('click', () => mockPay('Stripe'));
  // Forms
  els.newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  els.contactForm.addEventListener('submit', handleContactSubmit);
  els.trackForm.addEventListener('submit', handleTrackSubmit);
}

// Init
renderCategoryChips();
renderProducts();
renderCart();
renderWishlist();
renderBlog();
renderInventory();
renderOrders();
renderPromos();
renderChart();
wireEvents();