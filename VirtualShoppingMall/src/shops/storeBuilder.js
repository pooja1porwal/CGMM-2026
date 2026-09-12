import * as THREE from 'three';

export function createStoreBase(options) {
  const storeGroup = new THREE.Group();
  
  const width = options.width || 20;
  const depth = options.depth || 30;
  const height = options.height || 10;
  
  const wallColor = options.wallColor || 0xffffff;
  const floorColor = options.floorColor || 0xdddddd;
  const signColor = options.signColor || '#111111';
  const signText = options.signText || 'STORE';

  const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.8 });
  const floorMat = new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.2, metalness: 0.1 });
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 1.0 });

  // 1. Floor
  const floorGeo = new THREE.PlaneGeometry(width, depth);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.05;
  floor.receiveShadow = true;
  storeGroup.add(floor);
  
  // 1.5 Ceiling
  const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = height;
  storeGroup.add(ceiling);

  // 2. Solid Walls
  const wallThickness = 1;

  // Back Wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, wallThickness), wallMat);
  backWall.position.set(0, height / 2, -depth / 2);
  backWall.receiveShadow = true;
  backWall.castShadow = true;
  storeGroup.add(backWall);

  // Left Wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, height, depth), wallMat);
  leftWall.position.set(-width / 2, height / 2, 0);
  leftWall.receiveShadow = true;
  leftWall.castShadow = true;
  storeGroup.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, height, depth), wallMat);
  rightWall.position.set(width / 2, height / 2, 0);
  rightWall.receiveShadow = true;
  rightWall.castShadow = true;
  storeGroup.add(rightWall);
  
  // 3. Glass Storefront
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, transparent: true, opacity: 0.2, roughness: 0.0, metalness: 0.9, side: THREE.DoubleSide
  });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
  
  // Entrance Gap
  const entranceWidth = 6;
  const glassWidth = (width - entranceWidth) / 2;
  
  // Left Glass
  const leftGlass = new THREE.Mesh(new THREE.PlaneGeometry(glassWidth, height), glassMat);
  leftGlass.position.set(-width/2 + glassWidth/2, height/2, depth/2);
  storeGroup.add(leftGlass);
  
  // Right Glass
  const rightGlass = new THREE.Mesh(new THREE.PlaneGeometry(glassWidth, height), glassMat);
  rightGlass.position.set(width/2 - glassWidth/2, height/2, depth/2);
  storeGroup.add(rightGlass);
  
  // Header frame
  const header = new THREE.Mesh(new THREE.BoxGeometry(width, 2, 0.5), frameMat);
  header.position.set(0, height - 1, depth/2);
  storeGroup.add(header);

  // 4. Signage
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 1024; signCanvas.height = 256;
  const ctx = signCanvas.getContext('2d');
  ctx.fillStyle = signColor;
  ctx.fillRect(0, 0, signCanvas.width, signCanvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 80px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.letterSpacing = '10px';
  ctx.fillText(signText, signCanvas.width / 2, signCanvas.height / 2);
  
  const signTexture = new THREE.CanvasTexture(signCanvas);
  const signGeo = new THREE.PlaneGeometry(8, 2);
  const signMat = new THREE.MeshBasicMaterial({ map: signTexture });
  const signBoard = new THREE.Mesh(signGeo, signMat);
  signBoard.position.set(0, height - 1, depth / 2 + 0.26); 
  storeGroup.add(signBoard);

  // 5. Store Local Lighting (Ceiling Recessed Lights)
  const spotLight1 = new THREE.SpotLight(0xffffff, 2);
  spotLight1.position.set(-5, height - 0.5, 0);
  spotLight1.angle = Math.PI/4;
  spotLight1.penumbra = 0.5;
  spotLight1.castShadow = true;
  storeGroup.add(spotLight1);

  const spotLight2 = new THREE.SpotLight(0xffffff, 2);
  spotLight2.position.set(5, height - 0.5, 0);
  spotLight2.angle = Math.PI/4;
  spotLight2.penumbra = 0.5;
  spotLight2.castShadow = true;
  storeGroup.add(spotLight2);

  return storeGroup;
}

export function createDisplayCounter(width, height, depth, color) {
  const counterGeo = new THREE.BoxGeometry(width, height, depth);
  const counterMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.3, metalness: 0.1 });
  const counter = new THREE.Mesh(counterGeo, counterMat);
  counter.castShadow = true;
  counter.receiveShadow = true;
  return counter;
}

export function createClothingRack(width) {
  const rackGroup = new THREE.Group();
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
  
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
  const leftPole = new THREE.Mesh(poleGeo, metalMat);
  leftPole.position.set(-width/2, 2, 0);
  rackGroup.add(leftPole);
  
  const rightPole = new THREE.Mesh(poleGeo, metalMat);
  rightPole.position.set(width/2, 2, 0);
  rackGroup.add(rightPole);
  
  const topBarGeo = new THREE.CylinderGeometry(0.05, 0.05, width + 0.5);
  const topBar = new THREE.Mesh(topBarGeo, metalMat);
  topBar.rotation.z = Math.PI/2;
  topBar.position.set(0, 4, 0);
  rackGroup.add(topBar);
  
  return rackGroup;
}
