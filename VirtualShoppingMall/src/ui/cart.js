import { getProductById } from '../products/productData.js';
import { showNotification } from './notifications.js';

let cart = []; // Array of { id, quantity }

export function initCart(controls) {
  const btnOpenCart = document.getElementById('btn-open-cart');
  const btnCloseCart = document.getElementById('btn-close-cart-x');
  const btnClearCart = document.getElementById('btn-clear-cart');
  const btnCheckout = document.getElementById('btn-checkout');
  const btnContinue = document.getElementById('btn-continue-exploring');
  const btnReturn = document.getElementById('btn-return-mall');

  btnOpenCart.addEventListener('click', () => {
    openCart(controls);
  });

  btnCloseCart.addEventListener('click', () => {
    closeCart(controls);
  });

  btnClearCart.addEventListener('click', () => {
    cart = [];
    updateCartUI();
    showNotification('✓ Cart cleared');
  });

  btnCheckout.addEventListener('click', () => {
    if (cart.length > 0) {
      document.getElementById('checkout-success').classList.remove('hidden');
    }
  });

  btnReturn.addEventListener('click', () => {
    cart = [];
    updateCartUI();
    document.getElementById('checkout-success').classList.add('hidden');
    closeCart(controls);
    showNotification('✓ Order simulated successfully');
  });

  btnContinue.addEventListener('click', () => {
    closeCart(controls);
  });
}

export function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  const product = getProductById(productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  updateCartUI();
  if (product) {
    showNotification(`✓ ${product.name} added to cart`);
  }
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  showNotification('✓ Product removed from cart');
}

export function changeQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
    }
  }
}

function updateCartUI() {
  const container = document.getElementById('cart-items-container');
  const totalValueEl = document.getElementById('cart-total-value');
  const cartCountEl = document.getElementById('cart-count');
  
  const emptyState = document.getElementById('empty-cart-state');
  const fullState = document.getElementById('full-cart-state');

  container.innerHTML = '';
  let total = 0;
  let itemCount = 0;

  if (cart.length === 0) {
    emptyState.classList.remove('hidden');
    fullState.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    fullState.classList.remove('hidden');
  }

  const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 });

  cart.forEach(item => {
    const product = getProductById(item.id);
    if (!product) return;

    const subtotal = product.price * item.quantity;
    total += subtotal;
    itemCount += item.quantity;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-category">${product.category}</div>
        <div class="cart-item-price">${currencyFormatter.format(product.price)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-btn btn-dec" data-id="${item.id}">-</button>
        <span class="cart-item-qty">${item.quantity}</span>
        <button class="cart-btn btn-inc" data-id="${item.id}">+</button>
        <button class="cart-item-remove" data-id="${item.id}">✖</button>
      </div>
    `;
    container.appendChild(itemEl);
  });

  // Attach event listeners to the new buttons
  container.querySelectorAll('.btn-dec').forEach(btn => {
    btn.addEventListener('click', (e) => changeQuantity(e.target.dataset.id, -1));
  });
  container.querySelectorAll('.btn-inc').forEach(btn => {
    btn.addEventListener('click', (e) => changeQuantity(e.target.dataset.id, 1));
  });
  container.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', (e) => removeFromCart(e.target.dataset.id));
  });

  totalValueEl.textContent = currencyFormatter.format(total);
  cartCountEl.textContent = itemCount;
}

export function openCart(controls) {
  const cartPanel = document.getElementById('cart-panel');
  cartPanel.classList.remove('hidden');
  if (controls && controls.isLocked) {
    controls.unlock();
  }
}

export function closeCart(controls) {
  const cartPanel = document.getElementById('cart-panel');
  cartPanel.classList.add('hidden');
}
