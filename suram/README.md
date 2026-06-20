# SURAM Crafts & Creations — handmade craft store website

A fast, attractive, mobile-friendly storefront for selling handmade
craft works (diyas, crochet bags) and **customised gifts** (explosion
gift boxes, greeting cards, paper crafts, craft videos). No build step,
no backend — just static files you can host anywhere for free.

## ▶ Run it locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
# then open http://localhost:8000
```

## ⚙ Make it yours — 4 quick edits

Everything you need to personalise is clearly marked. In order of priority:

### 1. Your UPI ID (so payments reach you)
Open **`app.js`** (top of file) and set:
```js
const UPI_CONFIG = {
  vpa: "yourname@upi",        // <-- your real UPI ID, e.g. suram@okhdfcbank
  payeeName: "SURAM Crafts"
};
```
When a customer checks out, the site shows a **UPI QR code + "Open UPI app
to pay" button** for the exact cart amount. Works with GPay, PhonePe,
Paytm, etc. (UPI deep links only work inside India on UPI-enabled phones.)

### 2. Your LinkedIn page
Search the project for `YOUR-LINKEDIN-PAGE` and replace it with your real
LinkedIn URL. It appears in:
- `index.html` footer link
- `index.html` structured-data (`sameAs`) — helps Google connect your brand

### 3. Your real product photos
Drop your photos into the **`images/`** folder, then in **`products.js`**
change each `img:` value to match your filename, e.g.:
```js
img: "images/diya-teal.jpg",
```
The placeholder `.svg` images are just so the site looks complete out of
the box — replace them with your actual product photos and your logo
(save your logo as `images/logo.png` and update references if you like).

### 4. Your domain (for SEO)
Search for `YOUR-DOMAIN.com` and replace it everywhere with your real
domain. It appears in `index.html`, `sitemap.xml` and `robots.txt`.

## 🛒 What's included

| File | What it does |
|------|--------------|
| `index.html` | The whole storefront — hero, shop, customised-gifts corner, about, contact |
| `styles.css` | Warm handmade styling (terracotta / blush / sage, matched to your logo) |
| `products.js` | Edit product names, prices and the customised-gift cards here |
| `app.js` | Cart, checkout and UPI payment logic + your UPI ID |
| `images/` | Logo + product placeholder images (replace with real photos) |
| `robots.txt`, `sitemap.xml` | SEO files for Google |

## 🔍 About "being on top of Google"

The site already includes strong SEO foundations:
- Descriptive title + meta description targeting *"craft works"*,
  *"customised gifts"*, *"handmade gifts"*
- Open Graph / Twitter cards for nice link previews
- Schema.org **structured data** (Store) so Google understands your shop
- `sitemap.xml` + `robots.txt`, fast-loading static pages, mobile-friendly

⚠️ **Honest note:** no website can *guarantee* the #1 Google spot — ranking
depends on competition, your domain's age/reputation, and ongoing activity.
To actually climb the rankings:
1. Buy a domain and host the site (see below).
2. Create a free **Google Business Profile** and submit your site to
   **Google Search Console** (then submit `sitemap.xml`).
3. Keep adding real product photos, reviews and fresh content.
4. Link to the site from your LinkedIn, Instagram and Amazon listings.

## 🚀 Free hosting options
- **GitHub Pages** – push this folder to a repo, enable Pages.
- **Netlify / Cloudflare Pages / Vercel** – drag-and-drop the folder.

## 💳 Payments — how it works
This is a static site, so it uses **UPI deep links + QR** (no payment
gateway, no fees). The customer pays you directly to your UPI ID, then
confirms their order + address via the Contact form or LinkedIn. If you
later want automatic order tracking and card payments, you'd add a backend
or a hosted checkout (Razorpay / Instamojo) — happy to help with that next.
