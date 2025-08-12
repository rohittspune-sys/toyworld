// Cart and Wishlist utilities using localStorage

const STORAGE_KEYS = {
  cart: 'gxt_cart',
  wishlist: 'gxt_wishlist',
  newsletter: 'gxt_newsletter',
  promotions: 'gxt_promotions'
};

function getStoredArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function setStoredArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

function getCartItems() { return getStoredArray(STORAGE_KEYS.cart); }
function getWishlistItems() { return getStoredArray(STORAGE_KEYS.wishlist); }

function addToCart(productId) {
  const cart = getCartItems();
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.qty += 1; else cart.push({ id: productId, qty: 1 });
  setStoredArray(STORAGE_KEYS.cart, cart);
  updateCartBadge();
}

function removeFromCart(productId) {
  const cart = getCartItems().filter(item => item.id !== productId);
  setStoredArray(STORAGE_KEYS.cart, cart);
  updateCartBadge();
}

function addToWishlist(productId) {
  const list = getWishlistItems();
  if (!list.includes(productId)) {
    list.push(productId);
    setStoredArray(STORAGE_KEYS.wishlist, list);
    updateWishlistBadge();
  }
}

function removeFromWishlist(productId) {
  const list = getWishlistItems().filter(id => id !== productId);
  setStoredArray(STORAGE_KEYS.wishlist, list);
  updateWishlistBadge();
}

function updateCartBadge() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = String(getCartItems().reduce((s, i) => s + i.qty, 0));
}

function updateWishlistBadge() {
  const el = document.getElementById('wishlist-count');
  if (el) el.textContent = String(getWishlistItems().length);
}

function findProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function formatPrice(num) {
  return `$${num.toFixed(2)}`;
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}