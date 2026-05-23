// Hentmat demo — tiny client-side app. State lives in localStorage so
// the cart survives navigation between pages.

const STORE_KEY = "hentmat_cart_v1";
const ORDER_KEY = "hentmat_order_v1";

function getCart() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || emptyCart(); }
  catch { return emptyCart(); }
}
function setCart(cart) { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); }
function emptyCart() { return { restaurantId: null, items: {}, slot: null }; }

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatKr(n) { return `${n} kr`; }

// ---- Home: restaurant list -----------------------------------------------

function renderRestaurantList() {
  const list = document.getElementById("restaurant-list");
  list.innerHTML = RESTAURANTS.map(r => `
    <a class="card" href="restaurant.html?id=${r.id}">
      <div class="card-banner" style="background:${r.color}">
        <span class="card-emoji">${r.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-row">
          <h3>${r.name}</h3>
          <span class="rating">★ ${r.rating}</span>
        </div>
        <p class="muted">${r.cuisine}</p>
        <p class="card-blurb">${r.blurb}</p>
        <div class="card-meta">
          <span class="chip">🕒 ${r.prepMins} min</span>
          <span class="chip chip-accent">Pickup</span>
        </div>
      </div>
    </a>
  `).join("");
}

// ---- Restaurant page: menu + cart + slot picker --------------------------

function renderRestaurantPage() {
  const id = getQueryParam("id");
  const r = RESTAURANTS.find(x => x.id === id);
  if (!r) { window.location.href = "index.html"; return; }

  // Reset cart if switching restaurants
  let cart = getCart();
  if (cart.restaurantId !== r.id) {
    cart = emptyCart();
    cart.restaurantId = r.id;
    setCart(cart);
  }

  document.getElementById("restaurant-hero").innerHTML = `
    <div class="r-hero-inner" style="background:${r.color}">
      <div class="r-hero-emoji">${r.emoji}</div>
      <div>
        <h1>${r.name}</h1>
        <p>${r.cuisine} · ★ ${r.rating} · ~${r.prepMins} min prep</p>
        <p class="r-blurb">${r.blurb}</p>
      </div>
    </div>
  `;

  const menuEl = document.getElementById("menu-list");
  menuEl.innerHTML = r.menu.map(item => `
    <div class="menu-item" data-id="${item.id}">
      <div class="menu-item-info">
        <h4>${item.name}</h4>
        <p class="muted">${item.desc}</p>
        <span class="menu-price">${formatKr(item.price)}</span>
      </div>
      <button class="btn-add" data-add="${item.id}">+ Add</button>
    </div>
  `).join("");

  menuEl.addEventListener("click", e => {
    const id = e.target?.dataset?.add;
    if (!id) return;
    const c = getCart();
    c.restaurantId = r.id;
    c.items[id] = (c.items[id] || 0) + 1;
    setCart(c);
    renderCart(r);
  });

  renderSlotPicker(r);
  renderCart(r);

  document.getElementById("checkout-btn").addEventListener("click", () => {
    const c = getCart();
    if (!Object.keys(c.items).length || !c.slot) return;
    completeOrder(r);
  });
}

function renderCart(r) {
  const cart = getCart();
  const itemsEl = document.getElementById("cart-items");
  const ids = Object.keys(cart.items);

  if (!ids.length) {
    itemsEl.innerHTML = `<p class="muted small">No items yet. Add something from the menu.</p>`;
    document.getElementById("cart-total").textContent = "0 kr";
    document.getElementById("checkout-btn").disabled = true;
    return;
  }

  let total = 0;
  itemsEl.innerHTML = ids.map(id => {
    const item = r.menu.find(m => m.id === id);
    const qty = cart.items[id];
    const line = item.price * qty;
    total += line;
    return `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <div class="muted small">${formatKr(item.price)} each</div>
        </div>
        <div class="qty">
          <button data-qty="-" data-id="${id}">−</button>
          <span>${qty}</span>
          <button data-qty="+" data-id="${id}">+</button>
        </div>
        <div class="line-total">${formatKr(line)}</div>
      </div>
    `;
  }).join("");

  itemsEl.onclick = e => {
    const dir = e.target?.dataset?.qty;
    const id = e.target?.dataset?.id;
    if (!dir || !id) return;
    const c = getCart();
    c.items[id] = (c.items[id] || 0) + (dir === "+" ? 1 : -1);
    if (c.items[id] <= 0) delete c.items[id];
    setCart(c);
    renderCart(r);
  };

  document.getElementById("cart-total").textContent = formatKr(total);
  document.getElementById("checkout-btn").disabled = !cart.slot;
}

function renderSlotPicker(r) {
  // Generate slots starting from "now + prep time", in 15-minute steps, for 2 hours.
  const slots = [];
  const now = new Date();
  const start = new Date(now.getTime() + r.prepMins * 60000);
  // Round up to next 5-minute boundary
  const rounded = new Date(Math.ceil(start.getTime() / (5 * 60000)) * (5 * 60000));
  for (let i = 0; i < 9; i++) {
    const t = new Date(rounded.getTime() + i * 15 * 60000);
    const label = t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    slots.push(label);
  }

  const cart = getCart();
  const listEl = document.getElementById("slot-list");
  listEl.innerHTML = slots.map(s => `
    <button class="slot ${cart.slot === s ? "active" : ""}" data-slot="${s}">${s}</button>
  `).join("");

  listEl.addEventListener("click", e => {
    const slot = e.target?.dataset?.slot;
    if (!slot) return;
    const c = getCart();
    c.slot = slot;
    setCart(c);
    renderSlotPicker(r);
    renderCart(r);
  });
}

// ---- Checkout: build confirmation ----------------------------------------

function completeOrder(r) {
  const cart = getCart();
  const items = Object.keys(cart.items).map(id => {
    const m = r.menu.find(x => x.id === id);
    return { id, name: m.name, price: m.price, qty: cart.items[id] };
  });
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const code = generatePickupCode();

  const order = {
    restaurantName: r.name,
    restaurantEmoji: r.emoji,
    slot: cart.slot,
    items,
    total,
    code
  };
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  localStorage.removeItem(STORE_KEY); // clear cart
  window.location.href = "confirm.html";
}

function generatePickupCode() {
  // Four-letter human-readable code, vowels removed to avoid weird words.
  const chars = "BCDFGHJKLMNPQRSTVWXZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// ---- Confirmation page ---------------------------------------------------

function renderConfirmation() {
  const order = JSON.parse(localStorage.getItem(ORDER_KEY) || "null");
  if (!order) { window.location.href = "index.html"; return; }

  document.getElementById("pickup-code").textContent = order.code;
  document.getElementById("confirm-restaurant").textContent = `${order.restaurantEmoji} ${order.restaurantName}`;
  document.getElementById("confirm-slot").textContent = order.slot;
  document.getElementById("confirm-total").textContent = formatKr(order.total);

  document.getElementById("confirm-items").innerHTML = `
    <h3>Order summary</h3>
    ${order.items.map(i => `
      <div class="confirm-row">
        <span>${i.qty}× ${i.name}</span>
        <span>${formatKr(i.price * i.qty)}</span>
      </div>
    `).join("")}
  `;
}
