# Lynnhaven Small Engine Repair

A clean, modern, mobile-responsive static website for a small engine repair shop in Lynnhaven, Virginia. Built for GitHub Pages.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Homepage with hero, services, featured products, contact |
| `shop.html` | Full inventory with category filter |
| `cart.html` | Cart review page |
| `order.html` | Order request form (no payment) |
| `404.html` | Custom 404 page |

## Files

- `style.css` — All styles (Playfair Display + Source Sans 3)
- `script.js` — Cart logic, product rendering, form handling
- `products.json` — Product inventory data
- `sitemap.xml` — SEO sitemap
- `robots.txt` — Crawler instructions
- `.nojekyll` — Disables Jekyll processing on GitHub Pages
- `images/favicon.png` — Replace with your actual favicon

## Setup

1. Upload all files to a GitHub repository
2. Enable GitHub Pages (Settings → Pages → Deploy from branch `main`)
3. Replace `(757) 123-4567` and the email/address with real contact info
4. Add real product photos to the `images/` folder and update `products.json`
5. Replace `lynnhavenenginerepair.com` in `sitemap.xml` with your actual domain

## Cart Behavior

- Cart is stored in `localStorage` — persists across sessions
- Add items on the Shop page
- Review and remove items on the Cart page
- Cart auto-fills into the Order form
- Order form submission is simulated (no backend) — wire to Formspree, Netlify Forms, or similar for real submissions

## Customization

- Colors: Edit CSS variables at the top of `style.css`
- Products: Edit `products.json` — changes reflect everywhere automatically
- Fonts: Loaded from Google Fonts in `style.css` `@import`
