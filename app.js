// Hentmat demo — client-side app. Cart state lives in localStorage so
// it survives navigation between pages.

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

function findMenuItem(restaurant, itemId) {
  for (const cat of restaurant.menu) {
    const hit = cat.items.find(i => i.id === itemId);
    if (hit) return hit;
  }
  return null;
}

function countItemsInRestaurant(restaurant) {
  return restaurant.menu.reduce((s, c) => s + c.items.length, 0);
}

// ---- Home: restaurant list -----------------------------------------------

function renderRestaurantList() {
  const list = document.getElementById("restaurant-list");
  list.innerHTML = RESTAURANTS.map(r => {
    const itemCount = countItemsInRestaurant(r);
    const statusChip = r.open
      ? `<span class="chip chip-accent">Pickup · ~${r.prepMins} min</span>`
      : `<span class="chip chip-muted">Kommer snart</span>`;
    const href = r.open ? `restaurant.html?id=${r.id}` : "#";
    const cls = r.open ? "card" : "card card-closed";
    return `
      <a class="${cls}" href="${href}" ${r.open ? "" : "onclick=\"return false\""}>
        <div class="card-banner" style="background:${r.color}">
          <span class="card-emoji">${r.emoji}</span>
          ${r.open ? "" : `<span class="card-overlay">Kommer snart</span>`}
        </div>
        <div class="card-body">
          <div class="card-row">
            <h3>${r.name}</h3>
            <span class="rating">★ ${r.rating}</span>
          </div>
          <p class="muted small">${r.cuisine} · ${r.address}</p>
          <p class="card-blurb">${r.blurb}</p>
          <div class="card-meta">
            ${statusChip}
            ${itemCount ? `<span class="chip">${itemCount} retter</span>` : ""}
          </div>
        </div>
      </a>
    `;
  }).join("");
}

// ---- Restaurant page: menu + cart + slot picker --------------------------

function renderRestaurantPage() {
  const id = getQueryParam("id");
  const r = RESTAURANTS.find(x => x.id === id);
  if (!r) { window.location.href = "index.html"; return; }

  let cart = getCart();
  if (cart.restaurantId !== r.id) {
    cart = emptyCart();
    cart.restaurantId = r.id;
    setCart(cart);
  }

  document.getElementById("restaurant-hero").innerHTML = `
    <div class="r-hero-inner" style="background:${r.color}">
      <div class="r-hero-emoji">${r.emoji}</div>
      <div class="r-hero-text">
        <h1>${r.name}</h1>
        <p>${r.cuisine} · ★ ${r.rating} · ${r.address}</p>
        <p class="r-blurb">${r.blurb}</p>
        <div class="r-hero-meta">
          <span class="hero-chip">🕒 ~${r.prepMins} min klargjøring</span>
          <span class="hero-chip">Take-away priser</span>
        </div>
      </div>
    </div>
  `;

  const menuEl = document.getElementById("menu-list");
  menuEl.innerHTML = r.menu.map(cat => `
    <section class="menu-section">
      <h3 class="menu-section-title">${cat.category}</h3>
      ${cat.items.map(item => `
        <div class="menu-item" data-id="${item.id}">
          <div class="menu-item-info">
            <h4>${item.number ? `<span class="menu-num">${item.number}</span> ` : ""}${item.name}</h4>
            ${item.desc ? `<p class="muted small">${item.desc}</p>` : ""}
            <div class="menu-row">
              <span class="menu-price">${formatKr(item.price)}</span>
              ${item.allergens ? `<span class="allergen">⚠ ${item.allergens}</span>` : ""}
            </div>
          </div>
          <button class="btn-add" data-add="${item.id}">+ Legg til</button>
        </div>
      `).join("")}
    </section>
  `).join("");

  if (r.allergenLegend) {
    menuEl.insertAdjacentHTML("beforeend", `
      <p class="muted small allergen-legend">${r.allergenLegend}</p>
    `);
  }

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
    itemsEl.innerHTML = `<p class="muted small">Ingen retter ennå. Legg til noe fra menyen.</p>`;
    document.getElementById("cart-total").textContent = "0 kr";
    document.getElementById("checkout-btn").disabled = true;
    return;
  }

  let total = 0;
  itemsEl.innerHTML = ids.map(id => {
    const item = findMenuItem(r, id);
    if (!item) return "";
    const qty = cart.items[id];
    const line = item.price * qty;
    total += line;
    return `
      <div class="cart-row">
        <div class="cart-row-name">
          <strong>${item.name}</strong>
          <div class="muted small">${formatKr(item.price)} per stk</div>
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
  const slots = [];
  const now = new Date();
  const start = new Date(now.getTime() + r.prepMins * 60000);
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
    const m = findMenuItem(r, id);
    return { id, name: m.name, price: m.price, qty: cart.items[id] };
  });
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const code = generatePickupCode();

  const order = {
    restaurantName: r.name,
    restaurantEmoji: r.emoji,
    restaurantAddress: r.address,
    slot: cart.slot,
    items,
    total,
    code
  };
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  localStorage.removeItem(STORE_KEY);
  window.location.href = "confirm.html";
}

function generatePickupCode() {
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

  const addrEl = document.getElementById("confirm-address");
  if (addrEl && order.restaurantAddress) addrEl.textContent = order.restaurantAddress;

  document.getElementById("confirm-items").innerHTML = `
    <h3>Bestilling</h3>
    ${order.items.map(i => `
      <div class="confirm-row">
        <span>${i.qty}× ${i.name}</span>
        <span>${formatKr(i.price * i.qty)}</span>
      </div>
    `).join("")}
  `;
}
