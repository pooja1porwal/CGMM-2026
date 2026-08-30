import * as THREE from 'three';

export function createExterior(scene) {
  const exteriorGroup = new THREE.Group();

  // 1. Asphalt Ground
  const groundGeo = new THREE.PlaneGeometry(200, 150);
  const groundMat = new THREE.MeshStandardMaterial({ 
    color: 0x222222, 
    roughness: 0.9, 
    metalness: 0.1 
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.1, 80);
  ground.receiveShadow = true;
  exteriorGroup.add(ground);

  // 2. Pedestrian Walkway (Concrete)
  const walkwayGeo = new THREE.PlaneGeometry(16, 20);
  const walkwayMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 1.0,
  });
  const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
  walkway.rotation.x = -Math.PI / 2;
  walkway.position.set(0, 0.01, 55);
  walkway.receiveShadow = true;
  exteriorGroup.add(walkway);

  // 3. Parking Lines (Procedural generation)
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  function createLine(width, depth, x, z) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(x, 0.02, z);
    exteriorGroup.add(line);
  }

  // Draw parking spots (left and right of walkway)
  const spotWidth = 4;
  const spotDepth = 8;
  const numSpotsPerSide = 5;

  for (let i = 0; i <= numSpotsPerSide; i++) {
    createLine(0.2, spotDepth, -10 - (i * spotWidth), 70);
    createLine(0.2, spotDepth, 10 + (i * spotWidth), 70);
  }
  createLine(spotWidth * numSpotsPerSide, 0.2, -10 - (spotWidth * numSpotsPerSide)/2, 70 - spotDepth/2);
  createLine(spotWidth * numSpotsPerSide, 0.2, 10 + (spotWidth * numSpotsPerSide)/2, 70 - spotDepth/2);

  // 4. Low-Poly Cars
  const carGeo = new THREE.BoxGeometry(2.5, 1.2, 5);
  const cabinGeo = new THREE.BoxGeometry(2, 0.8, 2.5);
  cabinGeo.translate(0, 1, -0.5);
  
  const carColors = [0xff0000, 0x0000ff, 0x333333, 0xffffff, 0xffff00];
  const carGroup = new THREE.Group();

  function createCar(colorHex) {
    const cGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.5 });
    const base = new THREE.Mesh(carGeo, mat);
    base.position.y = 0.6;
    base.castShadow = true;
    base.receiveShadow = true;
    
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.y = 0.6;
    cabin.castShadow = true;
    
    cGroup.add(base);
    cGroup.add(cabin);
    return cGroup;
  }

  const car1 = createCar(carColors[0]); car1.position.set(-12, 0, 70); carGroup.add(car1);
  const car2 = createCar(carColors[1]); car2.position.set(-20, 0, 70); carGroup.add(car2);
  const car3 = createCar(carColors[2]); car3.position.set(-28, 0, 70); carGroup.add(car3);
  
  const car4 = createCar(carColors[3]); car4.position.set(16, 0, 70); carGroup.add(car4);
  const car5 = createCar(carColors[2]); car5.position.set(24, 0, 70); carGroup.add(car5);
  
  exteriorGroup.add(carGroup);

  // 5. Exterior Trees / Landscaping
  const trunkGeo = new THREE.CylinderGeometry(0.4, 0.6, 3);
  const leavesGeo = new THREE.SphereGeometry(2.5, 12, 12);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3219 });
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.9 });

  function createTree(x, z) {
    const tGroup = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = 4;
    leaves.castShadow = true;
    tGroup.add(trunk);
    tGroup.add(leaves);
    tGroup.position.set(x, 0, z);
    exteriorGroup.add(tGroup);
  }

  createTree(-12, 50);
  createTree(12, 50);
  createTree(-25, 55);
  createTree(25, 55);
  createTree(-35, 70);
  createTree(35, 70);

  // 6. Main Mall Sign
  const signWidth = 30;
  const signHeight = 5;
  const signGeo = new THREE.PlaneGeometry(signWidth, signHeight);
  
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 1024; signCanvas.height = 256;
  const ctx = signCanvas.getContext('2d');
  
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, 1024, 256);
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 1016, 248);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 70px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VIRTUAL SHOPPING MALL', 512, 128);

  const signMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) });
  const mallSign = new THREE.Mesh(signGeo, signMat);
  
  mallSign.position.set(0, 16, 45.1);
  exteriorGroup.add(mallSign);

  // 7. Street Lights
  const lightPoleGeo = new THREE.CylinderGeometry(0.2, 0.3, 10);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });

  function createStreetLight(x, z) {
    const pole = new THREE.Mesh(lightPoleGeo, poleMat);
    pole.position.set(x, 5, z);
    pole.castShadow = true;
    
    const fixture = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.8), poleMat);
    fixture.position.set(x, 10, z + 0.5);
    exteriorGroup.add(fixture);

    const pointLight = new THREE.PointLight(0xffeedd, 0.8, 40);
    pointLight.position.set(x, 9.5, z + 1);
    pointLight.castShadow = true;
    exteriorGroup.add(pointLight);
    
    exteriorGroup.add(pole);
  }

  createStreetLight(-20, 80);
  createStreetLight(20, 80);

  scene.add(exteriorGroup);
}

