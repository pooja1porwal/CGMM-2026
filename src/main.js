import * as THREE from 'three';
import { createMall } from './scene/mall.js';
import { initControls, updateControls } from './interaction/controls.js';
import { initRaycaster, updateRaycaster } from './interaction/raycaster.js';
import { initProductPanel } from './ui/productPanel.js';
import { initCart } from './ui/cart.js';
import { allProducts } from './products/productManager.js';
import { updateMinimap } from './ui/minimap.js';
import { initAudio } from './scene/audio.js';
import { initStoreLabels, updateStoreLabels } from './ui/storeLabels.js';

// 1. Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background
scene.fog = new THREE.Fog(0x87ceeb, 50, 300); // Basic fog for depth, pushed back so mall is visible

// 2. Camera Setup (Perspective Projection)
// Demonstrates perspective projection appropriate for a realistic shopping environment
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
// Position camera at the exterior parking lot looking at the mall
camera.position.set(0, 1.6, 110);


// 3. Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize pixel ratio
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.getElementById('app').appendChild(renderer.domElement);

// 4. Lighting Setup
// HemisphereLight for realistic indoor ambient bounce (sky color, ground color, intensity)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

// Directional light for shadows (like a sun shining through the central atrium skylight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(15, 40, 20);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -40;
directionalLight.shadow.camera.right = 40;
directionalLight.shadow.camera.top = 40;
directionalLight.shadow.camera.bottom = -40;
directionalLight.shadow.bias = -0.0005; // Prevent shadow acne
scene.add(directionalLight);

import { createExterior } from './scene/exterior.js';
import { createPeople } from './scene/people.js';

// 5. Build the Mall Environment (Stages 3 & 4)
const mall = createMall(scene);
createExterior(scene);
createPeople(scene);

// 6. Setup Controls (Stage 9)
const controls = initControls(camera, renderer);

// 6.5. Setup Raycasting & UI & Audio (Stages 11 & 12 & 13 & 15 & 16)
initProductPanel(controls);
initCart(controls);
initRaycaster(camera, scene, controls);
initAudio(camera);
initStoreLabels();

// Click canvas to resume exploring (if they press ESC)
renderer.domElement.addEventListener('click', () => {
  if (!controls.isLocked) {
    const productPanel = document.getElementById('product-panel');
    const cartPanel = document.getElementById('cart-panel');
    const welcomeScreen = document.getElementById('welcome-screen');
    
    // Only lock if we are actually in the mall (welcome screen hidden)
    // and no UI panels are open.
    if (welcomeScreen.style.display === 'none' && 
        productPanel.classList.contains('hidden') && 
        cartPanel.classList.contains('hidden')) {
      controls.lock();
    }
  }
});

// Handle ESC to close panels (Requirement 14)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !controls.isLocked) {
    const productPanel = document.getElementById('product-panel');
    const cartPanel = document.getElementById('cart-panel');
    
    // If panels are open, close them but DO NOT lock controls
    if (!productPanel.classList.contains('hidden')) {
      productPanel.classList.add('hidden');
    }
    if (!cartPanel.classList.contains('hidden')) {
      cartPanel.classList.add('hidden');
    }
  }
});

// 7. Responsive Window Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 8. Render Loop (Animation loop)
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  updateControls(delta);
  
  // Update Minimap (Stage 15)
  updateMinimap(camera);
  
  // Update Store Discovery Labels
  updateStoreLabels(camera);

  // Only raycast if controls are active to save performance
  if (controls.isLocked) {
    updateRaycaster(camera, scene);
  }
  
  // Stage 14: Animations
  // Rotate products
  allProducts.forEach(product => {
    product.rotation.y += 0.5 * delta;
  });

  // Automatic Sliding Doors (Open when camera is near Z=40)
  if (mall.userData.doors) {
    const doors = mall.userData.doors;
    const distanceToDoors = camera.position.distanceTo(doors.position);
    const targetY = distanceToDoors < 15 ? mall.userData.entranceHeight + 2 : mall.userData.entranceHeight / 2;
    // Lerp (smoothly interpolate) door position
    doors.position.y += (targetY - doors.position.y) * 2 * delta;
  }
  
  // Animate Escalator Steps
  if (mall.userData.escalatorSteps) {
    const instanced = mall.userData.escalatorSteps;
    const dummy = new THREE.Object3D();
    const stepCount = 40;
    
    // Animate a phase between 0 and 1
    if (!mall.userData.escPhase) mall.userData.escPhase = 0;
    mall.userData.escPhase += delta * 0.2; // Speed
    if (mall.userData.escPhase > 1) mall.userData.escPhase -= 1;
    
    for (let i = 0; i < stepCount; i++) {
      // Offset the progress by the animation phase
      let progress = (i / stepCount) + (mall.userData.escPhase / stepCount);
      if (progress > 1) progress -= 1; // loop back to bottom
      
      const stepZ = -5 - (15 * progress);
      const stepY = 8 * progress;
      
      dummy.position.set(0, stepY, stepZ);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;
  }
  
  // Animate People (Idle Breathing)
  if (scene.userData.people) {
    const time = clock.getElapsedTime();
    scene.userData.people.forEach((person, index) => {
      // Offset each person's breathing cycle based on their index
      const breathe = Math.sin(time * 2 + index) * 0.02;
      person.scale.y = 1 + breathe;
    });
  }
  
  renderer.render(scene, camera);
}

animate();
