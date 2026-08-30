import * as THREE from 'three';
import { openProductPanel } from '../ui/productPanel.js';

const raycaster = new THREE.Raycaster();
// We aim exactly at the center of the screen since we have a crosshair in PointerLock mode
const centerPointer = new THREE.Vector2(0, 0); 

let hoveredProduct = null;
const HIGHLIGHT_COLOR = 0x555555;

export function initRaycaster(camera, scene, controls) {
  // Listen for mouse clicks
  document.addEventListener('click', (event) => {
    // Only raycast if the pointer is locked (we are exploring)
    if (!controls.isLocked) return;
    
    raycaster.setFromCamera(centerPointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      // Find if the intersected object belongs to a product group
      const productGroup = findProductParent(intersects[0].object);
      if (productGroup) {
        openProductPanel(productGroup.userData.id, controls);
      }
    }
  });
}

export function updateRaycaster(camera, scene) {
  raycaster.setFromCamera(centerPointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  let foundProduct = null;
  
  if (intersects.length > 0) {
    foundProduct = findProductParent(intersects[0].object);
  }

  // If we were hovering a product and now we aren't (or we're hovering a different one)
  if (hoveredProduct && hoveredProduct !== foundProduct) {
    removeHighlight(hoveredProduct);
    hoveredProduct = null;
  }

  // If we found a new product to hover
  if (foundProduct && hoveredProduct !== foundProduct) {
    hoveredProduct = foundProduct;
    addHighlight(hoveredProduct);
  }
}

// Recursively traverse up to find the group marked as isProduct
function findProductParent(object) {
  if (object.userData && object.userData.isProduct) {
    return object;
  }
  if (object.parent) {
    return findProductParent(object.parent);
  }
  return null;
}

// Add an emissive highlight effect to all meshes in the product group
function addHighlight(productGroup) {
  productGroup.scale.set(1.1, 1.1, 1.1); // Slightly enlarge
  
  productGroup.traverse((child) => {
    if (child.isMesh && child.material) {
      // Store original emissive color if not already stored
      if (child.userData.originalEmissive === undefined) {
        child.userData.originalEmissive = child.material.emissive ? child.material.emissive.getHex() : 0x000000;
      }
      if (child.material.emissive) {
        child.material.emissive.setHex(HIGHLIGHT_COLOR);
      }
    }
  });
}

function removeHighlight(productGroup) {
  productGroup.scale.set(1.0, 1.0, 1.0); // Reset scale
  
  productGroup.traverse((child) => {
    if (child.isMesh && child.material && child.userData.originalEmissive !== undefined) {
      if (child.material.emissive) {
        child.material.emissive.setHex(child.userData.originalEmissive);
      }
    }
  });
}
