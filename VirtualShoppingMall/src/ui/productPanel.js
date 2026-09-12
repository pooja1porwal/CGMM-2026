import { getProductById } from '../products/productData.js';
import { addToCart } from './cart.js';

let activeProductId = null;

export function initProductPanel(controls) {
  const panel = document.getElementById('product-panel');
  const btnClose = document.getElementById('btn-close-card');
  const btnAddCart = document.getElementById('btn-add-cart');

  btnClose.addEventListener('click', () => {
    closePanel(controls);
  });
  
  // Hook up Add to Cart
  btnAddCart.addEventListener('click', () => {
    if (activeProductId) {
      addToCart(activeProductId);
    }
  });
}

export function openProductPanel(productId, controls) {
  const data = getProductById(productId);
  if (!data) return;

  activeProductId = productId;

  document.getElementById('panel-name').textContent = data.name;
  document.getElementById('panel-category').textContent = data.category;
  document.getElementById('panel-brand').textContent = data.brand;
  document.getElementById('panel-rating-val').textContent = data.rating;
  
  // Set badge (mock SKU)
  const badge = 'VSM-' + data.category.substring(0,3).toUpperCase();
  document.getElementById('panel-badge').textContent = badge;
  
  // Set icon based on category
  let icon = '👕';
  if (data.category.toLowerCase().includes('electronic')) icon = '💻';
  if (data.category.toLowerCase().includes('sport')) icon = '🏆';
  if (data.category.toLowerCase().includes('home')) icon = '🏠';
  document.getElementById('preview-icon').textContent = icon;
  
  // Format price in Indian Rupees as per requirement example
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(data.price);
  document.getElementById('panel-price').textContent = formattedPrice;
  
  document.getElementById('panel-desc').textContent = data.description;

  const panel = document.getElementById('product-panel');
  panel.classList.remove('hidden');

  // Trigger floating toast
  const toast = document.getElementById('selected-product-toast');
  document.getElementById('selected-product-name').textContent = data.name;
  toast.classList.remove('hidden');
  
  // Auto-hide the selected product toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);

  // Unlock the pointer so the user can interact with the panel
  if (controls.isLocked) {
    controls.unlock();
  }
}

export function closePanel(controls) {
  const panel = document.getElementById('product-panel');
  panel.classList.add('hidden');
  activeProductId = null;
}
