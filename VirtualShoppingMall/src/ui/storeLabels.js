import * as THREE from 'three';

const stores = [
  { id: 'fashion', title: 'FASHION', desc: 'Clothing & Shoes', pos: new THREE.Vector3(-15, 3, 15) },
  { id: 'electronics', title: 'ELECTRONICS', desc: 'Devices & Accessories', pos: new THREE.Vector3(15, 3, 15) },
  { id: 'sports', title: 'SPORTS', desc: 'Fitness & Outdoor', pos: new THREE.Vector3(-15, 3, -15) },
  { id: 'home', title: 'HOME & LIVING', desc: 'Furniture & Decor', pos: new THREE.Vector3(15, 3, -15) },
  { id: 'food', title: 'FOOD COURT', desc: 'Meals & Snacks', pos: new THREE.Vector3(0, 11, -32) },
  { id: 'book', title: 'BOOK & STATIONERY', desc: 'Books & Supplies', pos: new THREE.Vector3(-25, 11, -5) },
  { id: 'beauty', title: 'BEAUTY & COSMETICS', desc: 'Makeup & Fragrance', pos: new THREE.Vector3(25, 11, -5) }
];

let labels = {};
let container;

export function initStoreLabels() {
  container = document.getElementById('store-labels-container');
  if (!container) return;
  
  stores.forEach(store => {
    const el = document.createElement('div');
    el.className = 'store-label';
    el.id = `label-${store.id}`;
    
    el.innerHTML = `
      <div class="store-label-box">
        <div class="store-label-title">${store.title}</div>
        <div class="store-label-desc">${store.desc}</div>
      </div>
      <div class="store-label-line"></div>
      <div class="store-label-dot"></div>
    `;
    
    container.appendChild(el);
    labels[store.id] = { element: el, data: store };
  });
}

export function updateStoreLabels(camera) {
  if (!container) return;
  
  const cameraPos = camera.position;
  const tempVec = new THREE.Vector3();
  
  // Need width/height for projection
  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;
  
  stores.forEach(store => {
    const label = labels[store.id];
    if (!label) return;
    
    // Calculate distance
    const dist = cameraPos.distanceTo(store.pos);
    
    // If we are close enough (e.g. within 25 units) show it
    if (dist < 25) {
      tempVec.copy(store.pos);
      tempVec.project(camera);
      
      // Check if it's behind the camera
      if (tempVec.z > 1) {
        label.element.classList.remove('visible');
        return;
      }
      
      // Convert NDC to screen coordinates
      const x = (tempVec.x * widthHalf) + widthHalf;
      const y = -(tempVec.y * heightHalf) + heightHalf;
      
      label.element.style.left = `${x}px`;
      label.element.style.top = `${y}px`;
      
      label.element.classList.add('visible');
    } else {
      label.element.classList.remove('visible');
    }
  });
}
