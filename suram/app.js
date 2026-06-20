/* ============================================================
   SURAM storefront — cart + UPI checkout (no backend needed)
   ============================================================ */

/* ----- 1. SET YOUR PAYMENT DETAILS HERE ----- */
const UPI_CONFIG = {
  vpa: "yourname@upi",        // <-- your UPI ID (e.g. suram@okhdfcbank)
  payeeName: "SURAM Crafts"   // shown in the customer's UPI app
};
/* -------------------------------------------- */

const money = n => "₹" + n.toLocaleString("en-IN");
const store = {
  get cart() { return JSON.parse(localStorage.getItem("suram-cart") || "{}"); },
  set cart(c) { localStorage.setItem("suram-cart", JSON.stringify(c)); }
};

/* ---------- render products ---------- */
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = PRODUCTS.map(p => {
    const off = Math.round((1 - p.price / p.mrp) * 100);
    return `
      <article class="card">
        ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ""}
        <div class="card-img"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="card-tag">${p.tagline}</p>
          <div class="card-price">
            <strong>${money(p.price)}</strong>
            <span class="mrp">${money(p.mrp)}</span>
            <span class="off">-${off}%</span>
          </div>
          <button class="btn btn-primary btn-block" data-add="${p.id}">Add to bag</button>
        </div>
      </article>`;
  }).join("");
}

/* ---------- render customised gifts ---------- */
function renderCustom() {
  document.getElementById("custom-grid").innerHTML = CUSTOM_GIFTS.map(g => `
    <article class="custom-card">
      <div class="custom-icon">${g.icon}</div>
      <h3>${g.title}</h3>
      <p>${g.desc}</p>
    </article>`).join("");
}

/* ---------- cart logic ---------- */
function addToCart(id) {
  const c = store.cart;
  c[id] = (c[id] || 0) + 1;
  store.cart = c;
  updateCartUI();
  openDrawer();
}
function setQty(id, qty) {
  const c = store.cart;
  if (qty <= 0) delete c[id]; else c[id] = qty;
  store.cart = c;
  updateCartUI();
}
function cartTotal() {
  const c = store.cart;
  return Object.entries(c).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}
function cartCount() {
  return Object.values(store.cart).reduce((a, b) => a + b, 0);
}

function updateCartUI() {
  document.getElementById("cart-count").textContent = cartCount();
  const wrap = document.getElementById("cart-items");
  const c = store.cart;
  const ids = Object.keys(c);
  if (!ids.length) {
    wrap.innerHTML = `<p class="cart-empty">Your bag is empty.<br/>Add something handmade ✨</p>`;
  } else {
    wrap.innerHTML = ids.map(id => {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return "";
      return `
        <div class="cart-row">
          <img src="${p.img}" alt="" />
          <div class="cart-row-info">
            <span class="cart-row-name">${p.name}</span>
            <span class="cart-row-price">${money(p.price)}</span>
          </div>
          <div class="qty">
            <button data-dec="${id}" aria-label="Decrease">−</button>
            <span>${c[id]}</span>
            <button data-inc="${id}" aria-label="Increase">+</button>
          </div>
        </div>`;
    }).join("");
  }
  document.getElementById("cart-total").textContent = money(cartTotal());
}

/* ---------- drawer + modal open/close ---------- */
const overlay = document.getElementById("overlay");
const drawer = document.getElementById("cart-drawer");
function openDrawer() { drawer.classList.add("open"); overlay.classList.add("show"); }
function closeDrawer() { drawer.classList.remove("open"); overlay.classList.remove("show"); }

const upiOverlay = document.getElementById("upi-overlay");
function closeUpi() { upiOverlay.classList.remove("show"); }

/* ---------- UPI checkout ---------- */
function startCheckout() {
  const amount = cartTotal();
  if (amount <= 0) return;
  const orderId = "SURAM" + Date.now().toString().slice(-6);
  const note = "Order " + orderId;

  // Standard UPI deep link — works with every UPI app on mobile
  const upiUrl =
    "upi://pay?pa=" + encodeURIComponent(UPI_CONFIG.vpa) +
    "&pn=" + encodeURIComponent(UPI_CONFIG.payeeName) +
    "&am=" + amount.toFixed(2) +
    "&cu=INR" +
    "&tn=" + encodeURIComponent(note);

  // QR image rendered from the same UPI string (free, no key)
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" +
    encodeURIComponent(upiUrl);

  document.getElementById("upi-amount").textContent = amount.toLocaleString("en-IN");
  document.getElementById("upi-qr").src = qrUrl;
  document.getElementById("upi-link").href = upiUrl;
  document.getElementById("upi-vpa-display").textContent = UPI_CONFIG.vpa;
  upiOverlay.classList.add("show");
}

/* ---------- contact form (mailto, no backend) ---------- */
function handleContact(e) {
  e.preventDefault();
  const f = e.target;
  const subject = encodeURIComponent("Custom gift request from " + f.name.value);
  const body = encodeURIComponent(
    "Name: " + f.name.value +
    "\nContact: " + f.contact.value +
    "\n\nIdea:\n" + f.idea.value
  );
  window.location.href = `mailto:hello@suram.example?subject=${subject}&body=${body}`;
}

/* ---------- wire everything up ---------- */
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  if (add) addToCart(add.dataset.add);
  if (inc) setQty(inc.dataset.inc, (store.cart[inc.dataset.inc] || 0) + 1);
  if (dec) setQty(dec.dataset.dec, (store.cart[dec.dataset.dec] || 0) - 1);
});
document.getElementById("cart-btn").addEventListener("click", openDrawer);
document.getElementById("cart-close").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
document.getElementById("checkout-btn").addEventListener("click", startCheckout);
document.getElementById("upi-close").addEventListener("click", closeUpi);
upiOverlay.addEventListener("click", e => { if (e.target === upiOverlay) closeUpi(); });
document.getElementById("contact-form").addEventListener("submit", handleContact);

renderProducts();
renderCustom();
updateCartUI();
