const products = [
  { id: 1, name: "Bananas", price: 1.99, unit: "1 kg" },
  { id: 2, name: "Milk", price: 2.49, unit: "1 L" },
  { id: 3, name: "Brown Bread", price: 2.99, unit: "1 loaf" },
  { id: 4, name: "Tomatoes", price: 1.69, unit: "500 g" },
  { id: 5, name: "Eggs", price: 3.5, unit: "12 pack" },
  { id: 6, name: "Chicken Breast", price: 6.75, unit: "500 g" },
];

const DELIVERY_FEE = 4.99;
const cart = new Map();

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery-fee");
const totalEl = document.getElementById("total");
const checkoutForm = document.getElementById("checkout-form");
const orderMessage = document.getElementById("order-message");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function renderProducts() {
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product";

    const details = document.createElement("div");
    details.innerHTML = `<h3>${product.name}</h3><p>${product.unit} • ${formatCurrency(product.price)}</p>`;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add";
    addButton.addEventListener("click", () => addToCart(product.id));

    card.append(details, addButton);
    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  const currentQty = cart.get(productId) ?? 0;
  cart.set(productId, currentQty + 1);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach((qty, productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const lineTotal = product.price * qty;
    subtotal += lineTotal;

    const item = document.createElement("li");
    item.innerHTML = `<span>${product.name} × ${qty}</span><strong>${formatCurrency(lineTotal)}</strong>`;
    cartItems.appendChild(item);
  });

  if (cart.size === 0) {
    const emptyState = document.createElement("li");
    emptyState.textContent = "Your cart is empty.";
    cartItems.appendChild(emptyState);
  }

  const total = subtotal + DELIVERY_FEE;
  subtotalEl.textContent = formatCurrency(subtotal);
  deliveryEl.textContent = formatCurrency(DELIVERY_FEE);
  totalEl.textContent = formatCurrency(total);
}

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cart.size === 0) {
    orderMessage.textContent = "Add at least one item to place your order.";
    orderMessage.style.color = "#b33a3a";
    return;
  }

  const formData = new FormData(checkoutForm);
  const name = formData.get("name");
  const window = formData.get("window");
  orderMessage.textContent = `Thanks, ${name}! Your groceries will arrive in the selected ${window} window.`;
  orderMessage.style.color = "#1d7d4d";
  checkoutForm.reset();
  cart.clear();
  renderCart();
});

renderProducts();
renderCart();
