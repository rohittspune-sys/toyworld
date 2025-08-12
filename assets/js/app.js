// Main JS for Gen X Toybox

(function() {
  document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    updateCartBadge();
    updateWishlistBadge();
    document.getElementById('year')?.appendChild(document.createTextNode(String(new Date().getFullYear())));

    const page = document.body.getAttribute('data-page');
    if (page === 'home') initHome();
    if (page === 'shop') initShop();
    if (page === 'product') initProduct();
    if (page === 'contact') initContact();
    if (page === 'tracking') initTracking();
    if (page === 'blog') initBlog();
    if (page === 'wishlist') initWishlist();
    if (page === 'admin') initAdmin();
  });

  function setupNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
      const opened = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(opened));
    });
  }

  // HOME
  function initHome() {
    renderCollectionsCarousel();
    renderTestimonials();
    setupNewsletter();
  }

  function slideTemplate({ title, copy, image, link }) {
    const div = document.createElement('div');
    div.className = 'slide';
    div.innerHTML = `
      <div class="copy">
        <h3>${title}</h3>
        <p>${copy}</p>
        <div>
          <a class="btn btn-primary" href="${link}">Shop Now</a>
        </div>
      </div>
      <img src="${image}" alt="${title}" />
    `;
    return div;
  }

  function renderCollectionsCarousel() {
    const el = document.getElementById('collections-carousel');
    if (!el) return;
    const slides = [
      {
        title: 'Retro Classics',
        copy: 'Timeless favorites that bring back the magic.',
        image: 'https://images.unsplash.com/photo-1580717204790-9f1b9b3be8d0?w=1200&q=80&auto=format&fit=crop',
        link: '/shop.html?type=Retro%20Classics'
      },
      {
        title: 'Modern Learning',
        copy: 'STEM and creative play for curious minds.',
        image: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=1200&q=80&auto=format&fit=crop',
        link: '/shop.html?type=Modern%20Learning'
      },
      {
        title: 'For Collectors',
        copy: 'Premium pieces with display-worthy details.',
        image: 'https://images.unsplash.com/photo-1557321558-66c4e26f99d4?w=1200&q=80&auto=format&fit=crop',
        link: '/shop.html?type=For%20Collectors'
      }
    ];
    slides.forEach(s => el.appendChild(slideTemplate(s)));

    const prev = document.querySelector('.carousel-prev');
    const next = document.querySelector('.carousel-next');
    prev?.addEventListener('click', () => el.scrollBy({ left: -el.clientWidth * 0.9, behavior: 'smooth' }));
    next?.addEventListener('click', () => el.scrollBy({ left: el.clientWidth * 0.9, behavior: 'smooth' }));
  }

  function renderTestimonials() {
    const wrap = document.getElementById('testimonials');
    if (!wrap) return;
    TESTIMONIALS.forEach(t => {
      const div = document.createElement('div');
      div.className = 'testimonial';
      div.innerHTML = `
        <p>“${t.quote}”</p>
        <div class="who"><span>⭐️⭐️⭐️⭐️⭐️</span> <span>${t.name}</span></div>
      `;
      wrap.appendChild(div);
    });
  }

  function setupNewsletter() {
    const form = document.getElementById('newsletter-form');
    const email = document.getElementById('newsletter-email');
    const help = document.getElementById('newsletter-help');
    if (!form || !email || !help) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = email.value.trim();
      if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        help.textContent = 'Please enter a valid email address.';
        return;
      }
      const saved = getStoredArray(STORAGE_KEYS.newsletter);
      if (!saved.includes(val)) {
        saved.push(val);
        setStoredArray(STORAGE_KEYS.newsletter, saved);
      }
      help.textContent = 'Thanks! You are subscribed.';
      email.value = '';
    });
  }

  // SHOP
  function initShop() {
    populateBrandFilter();
    hydrateShopFromQueryParams();
    document.getElementById('apply-filters')?.addEventListener('click', applyShopFilters);
    document.getElementById('clear-filters')?.addEventListener('click', () => {
      ['search','age','type','brand','focus','price'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      renderProducts(PRODUCTS);
      history.replaceState({}, '', '/shop.html');
    });
  }

  function populateBrandFilter() {
    const brandSel = document.getElementById('brand');
    if (!brandSel) return;
    const brands = Array.from(new Set(PRODUCTS.map(p => p.brand))).sort();
    brands.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b; opt.textContent = b; brandSel.appendChild(opt);
    });
  }

  function hydrateShopFromQueryParams() {
    const url = new URL(location.href);
    const params = Object.fromEntries(url.searchParams.entries());
    Object.entries(params).forEach(([k, v]) => {
      const el = document.getElementById(k);
      if (el) el.value = v;
    });
    applyShopFilters();
  }

  function applyShopFilters() {
    const search = document.getElementById('search')?.value.trim().toLowerCase() || '';
    const age = document.getElementById('age')?.value || '';
    const type = document.getElementById('type')?.value || '';
    const brand = document.getElementById('brand')?.value || '';
    const focus = document.getElementById('focus')?.value || '';
    const priceMax = parseFloat(document.getElementById('price')?.value || 'NaN');

    let filtered = PRODUCTS.filter(p => {
      const matchesSearch = !search || [p.name, p.brand, p.category, p.type, p.educationalFocus].join(' ').toLowerCase().includes(search);
      const matchesAge = !age || inAgeRange(p, age);
      const matchesType = !type || p.category === type;
      const matchesBrand = !brand || p.brand === brand;
      const matchesFocus = !focus || p.educationalFocus === focus;
      const matchesPrice = Number.isNaN(priceMax) || p.price <= priceMax;
      return matchesSearch && matchesAge && matchesType && matchesBrand && matchesFocus && matchesPrice;
    });

    renderProducts(filtered);

    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (search) params.set('search', search);
    if (age) params.set('age', age);
    if (brand) params.set('brand', brand);
    if (focus) params.set('focus', focus);
    if (!Number.isNaN(priceMax)) params.set('price', String(priceMax));
    const query = params.toString();
    history.replaceState({}, '', '/shop.html' + (query ? `?${query}` : ''));
  }

  function inAgeRange(p, ageStr) {
    if (ageStr === '15+') return p.ageMax >= 15;
    const [min, max] = ageStr.split('-').map(Number);
    return p.ageMin <= max && p.ageMax >= min;
  }

  function renderProducts(list) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (list.length === 0) {
      grid.innerHTML = '<p>No products match your filters.</p>';
      return;
    }
    list.forEach(p => grid.appendChild(productCard(p)));
  }

  function productCard(p) {
    const div = document.createElement('div');
    div.className = 'card';
    const img = (p.images && p.images[0]) || '';
    div.innerHTML = `
      <a class="media" href="/product.html?id=${p.id}">
        <img src="${img}" alt="${p.name}" />
      </a>
      <div class="info">
        <a href="/product.html?id=${p.id}"><strong>${p.name}</strong></a>
        <div class="meta">${p.brand} • ${p.category}</div>
        <div class="rating">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))} <small>(${p.rating.toFixed(1)})</small></div>
        <div class="price">${formatPrice(p.price)}</div>
        <div class="actions">
          <button class="btn btn-ghost" data-wishlist="${p.id}">♡ Wishlist</button>
          <button class="btn btn-primary" data-cart="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
    div.querySelector('[data-cart]')?.addEventListener('click', () => addToCart(p.id));
    div.querySelector('[data-wishlist]')?.addEventListener('click', () => addToWishlist(p.id));
    return div;
  }

  // PRODUCT
  function initProduct() {
    const productId = getQueryParam('id');
    const product = findProductById(productId);
    if (!product) return;

    renderBreadcrumbs(product);
    renderProductDetail(product);
    renderReviews(product);
    renderRelated(product);
  }

  function renderBreadcrumbs(p) {
    const el = document.getElementById('product-breadcrumbs');
    if (!el) return;
    el.innerHTML = `<a href="/shop.html">Shop</a> / <a href="/shop.html?type=${encodeURIComponent(p.category)}">${p.category}</a> / ${p.name}`;
  }

  function renderProductDetail(p) {
    const wrap = document.getElementById('product-content');
    if (!wrap) return;

    const gallery = document.createElement('div');
    gallery.className = 'gallery';
    const mainImg = document.createElement('div');
    mainImg.className = 'main';
    const main = document.createElement('img');
    main.src = p.images[0]; main.alt = p.name; mainImg.appendChild(main);
    const thumbs = document.createElement('div');
    thumbs.className = 'thumbs';
    p.images.forEach((src, i) => {
      const t = document.createElement('img');
      t.src = src; t.alt = `${p.name} image ${i+1}`; if (i === 0) t.classList.add('active');
      t.addEventListener('click', () => {
        main.src = src;
        thumbs.querySelectorAll('img').forEach(img => img.classList.remove('active'));
        t.classList.add('active');
      });
      thumbs.appendChild(t);
    });
    gallery.appendChild(mainImg);
    gallery.appendChild(thumbs);

    const info = document.createElement('div');
    info.className = 'product-info';
    info.innerHTML = `
      <h1>${p.name}</h1>
      <div class="meta">Brand: <strong>${p.brand}</strong> • Age: ${p.ageMin}–${p.ageMax} • Focus: ${p.educationalFocus}</div>
      <div class="rating">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))} <small>(${p.rating.toFixed(1)})</small></div>
      <div class="price" style="font-size:22px; margin-top:6px;">${formatPrice(p.price)}</div>
      <div class="badges" style="margin:8px 0;">
        ${p.benefits.map(b => `<span class='badge-chip'>${b}</span>`).join('')}
      </div>
      <div class="actions" style="display:flex; gap:8px; margin-top:10px;">
        <button class="btn btn-primary" id="btn-add-cart">Add to Cart</button>
        <button class="btn btn-ghost" id="btn-add-wish">♡ Add to Wishlist</button>
      </div>
      <div class="pay-logos" style="margin-top:10px;">
        <small class="muted">Checkout options:</small><br />
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style="height:18px; margin-right:10px;" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" style="height:18px;" />
      </div>
    `;
    info.querySelector('#btn-add-cart')?.addEventListener('click', () => addToCart(p.id));
    info.querySelector('#btn-add-wish')?.addEventListener('click', () => addToWishlist(p.id));

    const layout = document.createElement('div');
    layout.className = 'product-layout';
    layout.appendChild(gallery);
    layout.appendChild(info);

    wrap.replaceChildren(layout);
  }

  function renderReviews(p) {
    const wrap = document.getElementById('reviews-list');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (!p.reviews || p.reviews.length === 0) {
      wrap.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
      return;
    }
    p.reviews.forEach(r => {
      const div = document.createElement('div');
      div.className = 'review';
      div.innerHTML = `<div class="rating">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div><p>${r.comment}</p><div class="muted">— ${r.name}</div>`;
      wrap.appendChild(div);
    });
  }

  function renderRelated(p) {
    const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    const grid = document.getElementById('related-products');
    if (!grid) return;
    related.forEach(x => grid.appendChild(productCard(x)));
  }

  // CONTACT
  function initContact() {
    const form = document.getElementById('contact-form');
    const help = document.getElementById('contact-help');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
        help.textContent = 'Please provide your name, a valid email, and a message (10+ chars).';
        return;
        }
      help.textContent = 'Thanks! We will get back to you shortly.';
      (document.getElementById('contact-form')).reset();
    });
  }

  // TRACKING
  function initTracking() {
    const form = document.getElementById('tracking-form');
    const help = document.getElementById('tracking-help');
    const result = document.getElementById('tracking-result');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('orderId').value.trim();
      if (!id) { help.textContent = 'Enter your order number (e.g., GX-1042).'; return; }
      const order = ORDERS.find(o => o.id.toLowerCase() === id.toLowerCase());
      if (!order) { result.innerHTML = '<p>No order found. Please check your number.</p>'; return; }
      result.innerHTML = `
        <div class="table">
          <table>
            <tr><th>Order</th><td>${order.id}</td></tr>
            <tr><th>Status</th><td><span class="status-badge">${order.status}</span></td></tr>
            <tr><th>ETA</th><td>${order.eta}</td></tr>
            <tr><th>Items</th><td>${order.items.map(pid => findProductById(pid)?.name || pid).join(', ')}</td></tr>
          </table>
        </div>`;
    });
  }

  // BLOG
  function initBlog() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    BLOG_POSTS.forEach(p => {
      const div = document.createElement('div');
      div.className = 'post';
      div.innerHTML = `
        <div class="media"><img src="${p.image}" alt="${p.title}"></div>
        <div class="info">
          <h3>${p.title}</h3>
          <div class="meta">${new Date(p.date).toLocaleDateString()} • ${p.author}</div>
          <p>${p.excerpt}</p>
          <a class="btn btn-ghost" href="#">Read More</a>
        </div>`;
      grid.appendChild(div);
    });
  }

  // WISHLIST
  function initWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return;
    const list = getWishlistItems();
    if (list.length === 0) { grid.innerHTML = '<p>Your wishlist is empty.</p>'; return; }
    list.map(id => findProductById(id)).filter(Boolean).forEach(p => {
      const card = productCard(p);
      const wishBtn = card.querySelector('[data-wishlist]');
      if (wishBtn) {
        wishBtn.textContent = 'Remove';
        wishBtn.addEventListener('click', () => {
          removeFromWishlist(p.id);
          card.remove();
        });
      }
      grid.appendChild(card);
    });
  }

  // ADMIN
  function initAdmin() {
    renderInventory();
    renderOrders();
    setupPromotions();
    renderChart();
  }

  function renderInventory() {
    const wrap = document.getElementById('inventory-table');
    if (!wrap) return;
    const table = document.createElement('table');
    table.innerHTML = `
      <thead><tr><th>Product</th><th>Brand</th><th>Category</th><th>Stock</th><th>Price</th></tr></thead>
      <tbody>
        ${PRODUCTS.map(p => `<tr><td>${p.name}</td><td>${p.brand}</td><td>${p.category}</td><td>${p.stock}</td><td>${formatPrice(p.price)}</td></tr>`).join('')}
      </tbody>`;
    wrap.replaceChildren(table);
  }

  function renderOrders() {
    const wrap = document.getElementById('orders-table');
    if (!wrap) return;
    const table = document.createElement('table');
    table.innerHTML = `
      <thead><tr><th>Order</th><th>Status</th><th>ETA</th><th>Items</th></tr></thead>
      <tbody>
        ${ORDERS.map(o => `<tr><td>${o.id}</td><td>${o.status}</td><td>${o.eta}</td><td>${o.items.map(pid => findProductById(pid)?.name || pid).join(', ')}</td></tr>`).join('')}
      </tbody>`;
    wrap.replaceChildren(table);
  }

  function setupPromotions() {
    const form = document.getElementById('promo-form');
    const help = document.getElementById('promo-help');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('promo-name').value.trim();
      const discount = parseFloat(document.getElementById('promo-discount').value);
      if (!name || !(discount >= 0 && discount <= 90)) { help.textContent = 'Enter a name and 0–90% discount.'; return; }
      const promos = getStoredArray(STORAGE_KEYS.promotions);
      promos.push({ name, discount, createdAt: new Date().toISOString() });
      setStoredArray(STORAGE_KEYS.promotions, promos);
      help.textContent = 'Promotion saved!';
      (document.getElementById('promo-form')).reset();
    });
  }

  function renderChart() {
    const ctx = document.getElementById('sales-chart');
    if (!ctx || !window.Chart) return;
    const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
    const data = [12, 19, 13, 15, 22, 18, 25, 29];
    new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Sales', data, borderColor: '#ff4757', backgroundColor: 'rgba(255,71,87,0.15)', tension: 0.35, fill: true }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { stepSize: 5 } } } }
    });
  }
})();