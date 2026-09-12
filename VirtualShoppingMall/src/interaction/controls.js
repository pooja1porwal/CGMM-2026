import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const speed = 20.0; // Movement speed

export function initControls(camera, renderer) {
  controls = new PointerLockControls(camera, renderer.domElement);
  
  const welcomeScreen = document.getElementById('welcome-screen');
  const enterBtn = document.getElementById('enter-btn');
  
  enterBtn.addEventListener('click', () => {
    controls.lock();
  });
  
  controls.addEventListener('lock', () => {
    welcomeScreen.style.display = 'none';
    document.body.classList.add('in-mall');
  });
  
  controls.addEventListener('unlock', () => {
    document.body.classList.remove('in-mall');
    // Only show the welcome screen (as a pause menu) if no other UI panels are actively open
    const productPanel = document.getElementById('product-panel');
    const cartPanel = document.getElementById('cart-panel');
    if (productPanel.classList.contains('hidden') && cartPanel.classList.contains('hidden')) {
      welcomeScreen.style.display = 'flex';
      // Update welcome text to act as a Pause menu
      welcomeScreen.querySelector('h1').innerHTML = 'Paused';
      document.getElementById('enter-btn').innerHTML = 'Resume &rarr;';
    }
  });
  
  const onKeyDown = function (event) {
    switch (event.code) {
      case 'KeyW': moveForward = true; break;
      case 'KeyA': moveLeft = true; break;
      case 'KeyS': moveBackward = true; break;
      case 'KeyD': moveRight = true; break;
    }
  };
  
  const onKeyUp = function (event) {
    switch (event.code) {
      case 'KeyW': moveForward = false; break;
      case 'KeyA': moveLeft = false; break;
      case 'KeyS': moveBackward = false; break;
      case 'KeyD': moveRight = false; break;
    }
  };
  
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  
  return controls;
}

export function updateControls(delta) {
  if (!controls || !controls.isLocked) return;
  
  // Apply friction
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  
  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize(); // consistent speed in all directions
  
  if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;
  
  controls.moveRight(-velocity.x);
  controls.moveForward(-velocity.z);
  
  // Basic collision/boundary detection
  const pos = controls.getObject().position;
  
  // Mall bounds + Exterior Parking Bounds
  if (pos.z <= 45) {
    // Inside mall bounds
    if (pos.x < -29) pos.x = -29;
    if (pos.x > 29) pos.x = 29;
    if (pos.z < -39) pos.z = -39;
  } else {
    // Exterior parking bounds
    if (pos.x < -60) pos.x = -60;
    if (pos.x > 60) pos.x = 60;
    if (pos.z > 120) pos.z = 120;
    
    // Prevent walking back into the mall walls (only allow entry through the center doors)
    if (pos.z < 45.5 && (pos.x < -7 || pos.x > 7)) {
      pos.z = 45.5;
    }
  }
  
  // Height Map / Escalator Logic
  let targetY = 0;
  
  // Escalator bounds: X between -3 and 3, Z between -5 and -20
  if (pos.x >= -3 && pos.x <= 3 && pos.z <= -5 && pos.z >= -20) {
    // Interpolate progress along the Z axis of the escalator
    let progress = (pos.z - (-5)) / (-20 - (-5));
    progress = Math.max(0, Math.min(1, progress)); // clamp between 0 and 1
    
    targetY = progress * 8.0; // 8.0 is the second floor balcony height
    
    if (progress > 0.8) window.playerFloor = 1;
    if (progress < 0.2) window.playerFloor = 0;
  } else {
    if (window.playerFloor === 1) {
      // If on second floor but somehow walked off the balcony into the atrium
      // (X between -10 and 10, Z between -20 and 20), fall down
      if (pos.x > -9.5 && pos.x < 9.5 && pos.z > -19.5 && pos.z < 19.5) {
        window.playerFloor = 0;
        targetY = 0;
      } else {
        targetY = 8.0;
      }
    } else {
      targetY = 0;
    }
  }
  
  // Smoothly move player height towards target floor height + 1.6m eye level
  pos.y += (targetY + 1.6 - pos.y) * 15.0 * delta;
}
