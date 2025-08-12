# Gen X Toybox (Frontend)

A modern, responsive e-commerce frontend built with HTML, CSS, and JavaScript.

## Run locally

- Use any static server, for example:

```bash
# Python 3
python3 -m http.server 8080 --bind 0.0.0.0
# or Node
npx serve . -l 8080 --single
```

Then open `http://localhost:8080`.

## Notes
- Data is mocked in `assets/js/data.js`.
- Cart and wishlist persist in localStorage.
- Filters are on `shop.html`.
- Product details open via `product.html?id=<productId>`.
- Admin dashboard (`admin.html`) shows mock inventory, orders, and a sales chart via Chart.js CDN.
- Payment buttons are placeholders (Stripe/PayPal logos only).
