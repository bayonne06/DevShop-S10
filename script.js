// ---- DevShop : Niveaux 1, 2 et 3 ----

const API_URL = "https://fakestoreapi.com/products";
const STORAGE_KEY = "devshop_cart";

const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");
const noResults = document.getElementById("no-results");
const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const categoryFilters = document.getElementById("category-filters");
const searchInput = document.getElementById("search-input");

const cartToggle = document.getElementById("cart-toggle");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalValue = document.getElementById("cart-total-value");

let products = [];
let currentCategory = "all";
let currentSearch = "";
let cart = loadCart();

// ---------- Niveau 1 : chargement des produits ----------

async function fetchProducts() {
  showLoader();

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    products = data;
    buildCategoryFilters(products);
    applyFilters();
  } catch (error) {
    console.error("Erreur lors du chargement des produits :", error);
    showError();
  } finally {
    hideLoader();
  }
}

function showLoader() {
  loader.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  productGrid.innerHTML = "";
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showError() {
  errorMessage.classList.remove("hidden");
}

// ---------- Niveau 2 : filtrage par catégorie ----------

function buildCategoryFilters(list) {
  const categories = [...new Set(list.map((p) => p.category))];

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = category;
    btn.dataset.category = category;
    categoryFilters.appendChild(btn);
  });
}

categoryFilters.addEventListener("click", (event) => {
  const btn = event.target.closest(".filter-btn");
  if (!btn) return;

  currentCategory = btn.dataset.category;

  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  applyFilters();
});

// ---------- Niveau 2 : barre de recherche ----------

searchInput.addEventListener("input", (event) => {
  currentSearch = event.target.value.trim().toLowerCase();
  applyFilters();
});

function applyFilters() {
  let filtered = products;

  if (currentCategory !== "all") {
    filtered = filtered.filter((p) => p.category === currentCategory);
  }

  if (currentSearch) {
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(currentSearch)
    );
  }

  renderProducts(filtered);
}

// ---------- Affichage des produits ----------

function renderProducts(list) {
  productGrid.innerHTML = "";

  if (list.length === 0) {
    noResults.classList.remove("hidden");
    return;
  }
  noResults.classList.add("hidden");

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-card__image-wrap">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <span class="product-card__category">${product.category}</span>
      <h2 class="product-card__title">${product.title}</h2>
      <div class="product-card__footer">
        <span class="product-card__price">${product.price.toFixed(2)} $</span>
        <button class="product-card__add" data-id="${product.id}">Ajouter</button>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

productGrid.addEventListener("click", (event) => {
  const btn = event.target.closest(".product-card__add");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  addToCart(id);
});

// ---------- Niveau 2 : panier ----------

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function updateQuantity(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = total;
}

// ---------- Niveau 3 : tiroir off-canvas ----------

function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Ton panier est vide.</p>';
    cartTotalValue.textContent = "0.00 $";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item__info">
        <p class="cart-item__title">${item.title}</p>
        <p class="cart-item__price">${item.price.toFixed(2)} $</p>
        <div class="cart-item__qty">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="cart-item__remove" data-action="remove" data-id="${item.id}">✕</button>
    `;

    cartItemsEl.appendChild(row);
  });

  cartTotalValue.textContent = `${total.toFixed(2)} $`;
}

cartItemsEl.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;

  if (action === "increase") updateQuantity(id, 1);
  if (action === "decrease") updateQuantity(id, -1);
  if (action === "remove") removeFromCart(id);
});

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.remove("hidden");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.add("hidden");
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ---------- Niveau 3 : persistance localStorage ----------

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ---------- Lancement ----------

renderCart();
updateCartCount();
fetchProducts();
