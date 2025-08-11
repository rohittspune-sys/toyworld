const PRODUCTS = [
  {
    id: 'plush-bear',
    name: 'Plush Teddy Bear',
    category: 'Plushies',
    priceCents: 1999,
    imageUrl: 'https://images.unsplash.com/photo-1611583449833-fb46bdf2c2fe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'wood-blocks',
    name: 'Wooden Blocks Set',
    category: 'Learning',
    priceCents: 2499,
    imageUrl: 'https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'toy-car',
    name: 'City Racer Car',
    category: 'Vehicles',
    priceCents: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'dino-kit',
    name: 'Dinosaur Figure Pack',
    category: 'Figures',
    priceCents: 1899,
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a924d4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'color-book',
    name: 'Coloring Book + Crayons',
    category: 'Art & Craft',
    priceCents: 999,
    imageUrl: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'robot-kit',
    name: 'Build-a-Robot Kit',
    category: 'Learning',
    priceCents: 3299,
    imageUrl: 'https://images.unsplash.com/photo-1589739906081-050b3f05ad49?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'doll-friend',
    name: 'Friendship Doll',
    category: 'Dolls',
    priceCents: 2199,
    imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'marble-run',
    name: 'Marble Run Tower',
    category: 'STEM',
    priceCents: 2799,
    imageUrl: 'https://images.unsplash.com/photo-1596464716121-f23d696ad6b1?q=80&w=1200&auto=format&fit=crop',
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

const state = {
  query: '',
  category: 'All',
  sort: 'featured',
  cart: loadCart(),
};

const els = {
  grid: document.getElementById('productGrid'),
  chips: document.getElementById('categoryChips'),
  search: document.getElementById('searchInput'),
  sort: document.getElementById('sortSelect'),
  cartBtn: document.getElementById('cartButton'),
  cartBadge: document.getElementById('cartBadge'),
  cartOverlay: document.getElementById('cartOverlay'),
  cartDrawer: document.getElementById('cartDrawer'),
  closeCart: document.getElementById('closeCart'),
  cartItems: document.getElementById('cartItems'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  checkoutOverlay: document.getElementById('checkoutOverlay'),
  checkoutModal: document.getElementById('checkoutModal'),
  closeCheckout: document.getElementById('closeCheckout'),
  checkoutForm: document.getElementById('checkoutForm'),
  toast: document.getElementById('toast'),
};

function loadCart() {
  try {
    const raw = localStorage.getItem('toyworld.cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem('toyworld.cart', JSON.stringify(state.cart));
}

function formatPrice(cents) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => els.toast.classList.remove('show'), 1800);
}

function renderCategoryChips() {
  els.chips.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.role = 'tab';
    btn.textContent = cat;
    btn.setAttribute('aria-selected', state.category === cat ? 'true' : 'false');
    btn.addEventListener('click', () => {
      state.category = cat;
      renderCategoryChips();
      renderProducts();
    });
    els.chips.appendChild(btn);
  });
}

function filteredProducts() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter(p =>
    (state.category === 'All' || p.category === state.category) &&
    (!q || p.name.toLowerCase().includes(q))
  );
  switch (state.sort) {
    case 'priceAsc': list = list.slice().sort((a,b) => a.priceCents - b.priceCents); break;
    case 'priceDesc': list = list.slice().sort((a,b) => b.priceCents - a.priceCents); break;
    case 'nameAsc': list = list.slice().sort((a,b) => a.name.localeCompare(b.name)); break;
    default: break;
  }
  return list;
}

function renderProducts() {
  const items = filteredProducts();
  els.grid.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.textContent = 'No toys found. Try a different search or category.';
    empty.style.color = 'var(--muted)';
    empty.style.padding = '20px';
    els.grid.appendChild(empty);
    return;
  }

  items.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';

    const media = document.createElement('div');
    media.className = 'media';
    const img = document.createElement('img');
    img.src = p.imageUrl;
    img.alt = p.name;
    media.appendChild(img);

    const body = document.createElement('div');
    body.className = 'body';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = p.name;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = p.category;
    body.appendChild(name);
    body.appendChild(meta);

    const foot = document.createElement('div');
    foot.className = 'foot';
    const price = document.createElement('div');
    price.className = 'price-tag';
    price.textContent = formatPrice(p.priceCents);
    const add = document.createElement('button');
    add.className = 'add-btn';
    add.textContent = 'Add to cart';
    add.addEventListener('click', () => {
      addToCart(p.id);
      showToast('Added to cart');
    });

    foot.appendChild(price);
    foot.appendChild(add);

    card.appendChild(media);
    card.appendChild(body);
    card.appendChild(foot);

    els.grid.appendChild(card);
  });
}

function getCartItem(productId) {
  return state.cart.find(i => i.productId === productId);
}

function addToCart(productId, quantity = 1) {
  const existing = getCartItem(productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({ productId, quantity });
  }
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.productId !== productId);
  saveCart();
  renderCart();
}

function setCartQty(productId, quantity) {
  const item = getCartItem(productId);
  if (!item) return;
  item.quantity = Math.max(1, quantity | 0);
  saveCart();
  renderCart();
}

function cartTotalCents() {
  return state.cart.reduce((sum, i) => {
    const product = PRODUCTS.find(p => p.id === i.productId);
    return sum + (product ? product.priceCents * i.quantity : 0);
  }, 0);
}

function renderCart() {
  els.cartItems.innerHTML = '';
  if (state.cart.length === 0) {
    const empty = document.createElement('div');
    empty.style.color = 'var(--muted)';
    empty.style.padding = '12px';
    empty.textContent = 'Your cart is empty.';
    els.cartItems.appendChild(empty);
  } else {
    const tpl = document.getElementById('cartItemTemplate');
    state.cart.forEach(i => {
      const product = PRODUCTS.find(p => p.id === i.productId);
      if (!product) return;
      const node = tpl.content.firstElementChild.cloneNode(true);
      node.querySelector('.thumb').src = product.imageUrl;
      node.querySelector('.thumb').alt = product.name;
      node.querySelector('.name').textContent = product.name;
      node.querySelector('.price').textContent = formatPrice(product.priceCents);
      const qtyInput = node.querySelector('.qty-input');
      qtyInput.value = String(i.quantity);
      qtyInput.addEventListener('change', (e) => {
        setCartQty(product.id, parseInt(e.target.value, 10) || 1);
      });
      node.querySelector('[data-action="increment"]').addEventListener('click', () => setCartQty(product.id, i.quantity + 1));
      node.querySelector('[data-action="decrement"]').addEventListener('click', () => setCartQty(product.id, i.quantity - 1));
      node.querySelector('.remove').addEventListener('click', () => removeFromCart(product.id));
      els.cartItems.appendChild(node);
    });
  }
  els.cartSubtotal.textContent = formatPrice(cartTotalCents());
  updateCartBadge();
}

function updateCartBadge() {
  const count = state.cart.reduce((n, i) => n + i.quantity, 0);
  els.cartBadge.textContent = String(count);
}

function openCart() {
  els.cartOverlay.hidden = false;
  els.cartDrawer.hidden = false;
}
function closeCart() {
  els.cartOverlay.hidden = true;
  els.cartDrawer.hidden = true;
}

function openCheckout() {
  els.checkoutOverlay.hidden = false;
  els.checkoutModal.hidden = false;
}
function closeCheckout() {
  els.checkoutOverlay.hidden = true;
  els.checkoutModal.hidden = true;
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  if (state.cart.length === 0) {
    showToast('Your cart is empty');
    return;
  }
  const data = new FormData(els.checkoutForm);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const address = (data.get('address') || '').toString().trim();
  const city = (data.get('city') || '').toString().trim();
  const zip = (data.get('zip') || '').toString().trim();
  const card = (data.get('card') || '').toString().replace(/\s+/g, '');
  if (!name || !email || !address || !city || !zip || card.length < 12) {
    showToast('Please fill in all details');
    return;
  }
  const orderId = Math.random().toString(36).slice(2, 10).toUpperCase();
  const total = formatPrice(cartTotalCents());
  state.cart = [];
  saveCart();
  renderCart();
  closeCheckout();
  closeCart();
  showToast(`Order ${orderId} placed! Total ${total}`);
}

function debounce(fn, delay = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function wireEvents() {
  els.search.addEventListener('input', debounce(e => {
    state.query = e.target.value;
    renderProducts();
  }, 200));
  els.sort.addEventListener('change', e => { state.sort = e.target.value; renderProducts(); });
  els.cartBtn.addEventListener('click', openCart);
  els.cartOverlay.addEventListener('click', closeCart);
  els.closeCart.addEventListener('click', closeCart);
  els.checkoutBtn.addEventListener('click', () => { closeCart(); openCheckout(); });
  els.checkoutOverlay.addEventListener('click', closeCheckout);
  els.closeCheckout.addEventListener('click', closeCheckout);
  els.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
}

renderCategoryChips();
renderProducts();
renderCart();
wireEvents();