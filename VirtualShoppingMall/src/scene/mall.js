import * as THREE from 'three';
import { createFashionStore } from '../shops/fashionStore.js';
import { createElectronicsStore } from '../shops/electronicsStore.js';
import { createSportsStore } from '../shops/sportsStore.js';
import { createHomeStore } from '../shops/homeStore.js';

export function createMall(scene) {
  const mallGroup = new THREE.Group();
  
  const mallWidth = 70;
  const mallDepth = 90;
  const mallHeight = 18;
  const skylightWidth = 20;
  const skylightDepth = 40;
  
  // Materials
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xeeeeee,
    roughness: 0.15,
    metalness: 0.1,
  });
  
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.05
  });
  
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.9,
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.05,
    metalness: 0.8,
    side: THREE.DoubleSide
  });

  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: 0xdcdcdc,
    roughness: 0.2,
    metalness: 0.5
  });

  // 1. Floor
  const floorGeo = new THREE.PlaneGeometry(mallWidth, mallDepth);
  const floor = new THREE.Mesh(floorGeo, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  mallGroup.add(floor);

  // 2. Ceiling with Skylight Opening
  const cZ = (mallDepth - skylightDepth) / 2;
  const cX = (mallWidth - skylightWidth) / 2;

  // Front ceiling
  const cFront = new THREE.Mesh(new THREE.PlaneGeometry(mallWidth, cZ), ceilingMaterial);
  cFront.rotation.x = Math.PI / 2;
  cFront.position.set(0, mallHeight, mallDepth/2 - cZ/2);
  mallGroup.add(cFront);

  // Back ceiling
  const cBack = new THREE.Mesh(new THREE.PlaneGeometry(mallWidth, cZ), ceilingMaterial);
  cBack.rotation.x = Math.PI / 2;
  cBack.position.set(0, mallHeight, -mallDepth/2 + cZ/2);
  mallGroup.add(cBack);

  // Left ceiling
  const cLeft = new THREE.Mesh(new THREE.PlaneGeometry(cX, skylightDepth), ceilingMaterial);
  cLeft.rotation.x = Math.PI / 2;
  cLeft.position.set(-mallWidth/2 + cX/2, mallHeight, 0);
  mallGroup.add(cLeft);

  // Right ceiling
  const cRight = new THREE.Mesh(new THREE.PlaneGeometry(cX, skylightDepth), ceilingMaterial);
  cRight.rotation.x = Math.PI / 2;
  cRight.position.set(mallWidth/2 - cX/2, mallHeight, 0);
  mallGroup.add(cRight);

  // Skylight Glass
  const skylight = new THREE.Mesh(new THREE.PlaneGeometry(skylightWidth, skylightDepth), glassMaterial);
  skylight.rotation.x = Math.PI / 2;
  skylight.position.set(0, mallHeight + 0.1, 0);
  mallGroup.add(skylight);
  
  // Skylight beams
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
  for(let i = -skylightDepth/2 + 5; i < skylightDepth/2; i += 5) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(skylightWidth, 0.4, 0.4), beamMat);
    beam.position.set(0, mallHeight, i);
    beam.castShadow = true;
    mallGroup.add(beam);
  }

  // 3. Walls
  const wallThickness = 1;
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(mallWidth, mallHeight, wallThickness), wallMaterial);
  backWall.position.set(0, mallHeight / 2, -mallDepth / 2);
  backWall.receiveShadow = true;
  backWall.castShadow = true;
  mallGroup.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, mallHeight, mallDepth), wallMaterial);
  leftWall.position.set(-mallWidth / 2, mallHeight / 2, 0);
  leftWall.receiveShadow = true;
  leftWall.castShadow = true;
  mallGroup.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, mallHeight, mallDepth), wallMaterial);
  rightWall.position.set(mallWidth / 2, mallHeight / 2, 0);
  rightWall.receiveShadow = true;
  rightWall.castShadow = true;
  mallGroup.add(rightWall);

  // Front Wall Entrance
  const entranceWidth = 14;
  const entranceHeight = 12;
  
  const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry((mallWidth - entranceWidth) / 2, mallHeight, wallThickness), wallMaterial);
  frontWallLeft.position.set(-mallWidth / 4 - entranceWidth / 4, mallHeight / 2, mallDepth / 2);
  frontWallLeft.receiveShadow = true;
  frontWallLeft.castShadow = true;
  mallGroup.add(frontWallLeft);

  const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry((mallWidth - entranceWidth) / 2, mallHeight, wallThickness), wallMaterial);
  frontWallRight.position.set(mallWidth / 4 + entranceWidth / 4, mallHeight / 2, mallDepth / 2);
  frontWallRight.receiveShadow = true;
  frontWallRight.castShadow = true;
  mallGroup.add(frontWallRight);

  const frontWallTop = new THREE.Mesh(new THREE.BoxGeometry(entranceWidth, mallHeight - entranceHeight, wallThickness), wallMaterial);
  frontWallTop.position.set(0, mallHeight - (mallHeight - entranceHeight) / 2, mallDepth / 2);
  frontWallTop.receiveShadow = true;
  frontWallTop.castShadow = true;
  mallGroup.add(frontWallTop);

  // 4. Main Entrance Architecture
  const doorGeo = new THREE.BoxGeometry(entranceWidth - 0.2, entranceHeight, 0.5);
  const doors = new THREE.Mesh(doorGeo, glassMaterial);
  doors.position.set(0, entranceHeight / 2, mallDepth / 2);
  mallGroup.add(doors);
  mallGroup.userData.doors = doors;
  mallGroup.userData.entranceHeight = entranceHeight;

  const canopy = new THREE.Mesh(new THREE.BoxGeometry(entranceWidth + 6, 1, 8), beamMat);
  canopy.position.set(0, entranceHeight + 0.5, mallDepth / 2 + 4);
  canopy.castShadow = true;
  mallGroup.add(canopy);

  // Atrium Pillars (to give structure)
  const pillarGeo = new THREE.CylinderGeometry(0.8, 0.8, mallHeight, 16);
  const pZ = skylightDepth / 2 + 2;
  const pX = skylightWidth / 2 + 2;
  const pillarPositions = [
    [-pX, pZ], [pX, pZ], [-pX, -pZ], [pX, -pZ],
    [-pX, 0], [pX, 0]
  ];
  pillarPositions.forEach(pos => {
    const p = new THREE.Mesh(pillarGeo, pillarMaterial);
    p.position.set(pos[0], mallHeight/2, pos[1]);
    p.castShadow = true;
    p.receiveShadow = true;
    mallGroup.add(p);
  });

  // Atrium Glass Railings (simulating an upper floor overlooking the atrium)
  // We'll place a balcony structure at Y = 8
  const balconyHeight = 8;
  const balconyThickness = 0.5;
  const balconyMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.1 });
  
  // Left balcony
  const balcLeft = new THREE.Mesh(new THREE.BoxGeometry(cX, balconyThickness, mallDepth), balconyMat);
  balcLeft.position.set(-mallWidth/2 + cX/2, balconyHeight, 0);
  balcLeft.castShadow = true; balcLeft.receiveShadow = true;
  mallGroup.add(balcLeft);
  
  // Right balcony
  const balcRight = new THREE.Mesh(new THREE.BoxGeometry(cX, balconyThickness, mallDepth), balconyMat);
  balcRight.position.set(mallWidth/2 - cX/2, balconyHeight, 0);
  balcRight.castShadow = true; balcRight.receiveShadow = true;
  mallGroup.add(balcRight);
  
  // Back balcony
  const balcBack = new THREE.Mesh(new THREE.BoxGeometry(skylightWidth, balconyThickness, cZ), balconyMat);
  balcBack.position.set(0, balconyHeight, -mallDepth/2 + cZ/2);
  balcBack.castShadow = true; balcBack.receiveShadow = true;
  mallGroup.add(balcBack);

  // Front balcony
  const balcFront = new THREE.Mesh(new THREE.BoxGeometry(skylightWidth, balconyThickness, cZ), balconyMat);
  balcFront.position.set(0, balconyHeight, mallDepth/2 - cZ/2);
  balcFront.castShadow = true; balcFront.receiveShadow = true;
  mallGroup.add(balcFront);

  // Glass Railings
  const railingGeo = new THREE.PlaneGeometry(mallDepth, 1.5);
  const railLeft = new THREE.Mesh(railingGeo, glassMaterial);
  railLeft.rotation.y = Math.PI / 2;
  railLeft.position.set(-skylightWidth/2, balconyHeight + 0.75, 0);
  mallGroup.add(railLeft);
  
  const railRight = new THREE.Mesh(railingGeo, glassMaterial);
  railRight.rotation.y = -Math.PI / 2;
  railRight.position.set(skylightWidth/2, balconyHeight + 0.75, 0);
  mallGroup.add(railRight);

  // 5. Interior Lighting (Local fill lights)
  const fillLight1 = new THREE.PointLight(0xffeedd, 0.5, 50);
  fillLight1.position.set(0, 6, 20);
  mallGroup.add(fillLight1);
  const fillLight2 = new THREE.PointLight(0xffeedd, 0.5, 50);
  fillLight2.position.set(0, 6, -20);
  mallGroup.add(fillLight2);

  // 6. Shops
  // Fashion Store (Left Front)
  const fashionStore = createFashionStore();
  fashionStore.position.set(-20, 0, 15);
  fashionStore.rotation.y = Math.PI / 2;
  mallGroup.add(fashionStore);

  // Electronics Store (Right Front)
  const electronicsStore = createElectronicsStore();
  electronicsStore.position.set(20, 0, 15);
  electronicsStore.rotation.y = -Math.PI / 2;
  mallGroup.add(electronicsStore);

  // Sports Store (Left Back)
  const sportsStore = createSportsStore();
  sportsStore.position.set(-20, 0, -15);
  sportsStore.rotation.y = Math.PI / 2;
  mallGroup.add(sportsStore);

  // Home Store (Right Back)
  const homeStore = createHomeStore();
  homeStore.position.set(20, 0, -15);
  homeStore.rotation.y = -Math.PI / 2;
  mallGroup.add(homeStore);

  // Central Plant/Decoration
  const planterGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
  const planterMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
  const planter = new THREE.Mesh(planterGeo, planterMat);
  planter.position.set(0, 0.25, 0);
  planter.receiveShadow = true; planter.castShadow = true;
  mallGroup.add(planter);

  // === ESCALATOR ===
  const escalatorGroup = new THREE.Group();
  
  // Side Railings
  const escRailGeo = new THREE.PlaneGeometry(16, 2);
  const escGlassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.4, side: THREE.DoubleSide, metalness: 0.9, roughness: 0.1 });
  
  const leftRail = new THREE.Mesh(escRailGeo, escGlassMat);
  leftRail.rotation.y = Math.PI / 2;
  // Slope rotation
  leftRail.rotation.x = -Math.atan(8 / 15); // angle of incline
  leftRail.position.set(-3, 4 + 1.2, -12.5); // Center height 4, + railing height
  escalatorGroup.add(leftRail);
  
  const rightRail = new THREE.Mesh(escRailGeo, escGlassMat);
  rightRail.rotation.y = -Math.PI / 2;
  rightRail.rotation.x = Math.atan(8 / 15); 
  rightRail.position.set(3, 4 + 1.2, -12.5);
  escalatorGroup.add(rightRail);

  // Black handrails
  const handrailGeo = new THREE.BoxGeometry(0.15, 0.15, 16.5);
  const handrailMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
  
  const leftHand = new THREE.Mesh(handrailGeo, handrailMat);
  leftHand.rotation.x = -Math.atan(8 / 15);
  leftHand.position.set(-3, 4 + 2.2, -12.5);
  escalatorGroup.add(leftHand);

  const rightHand = new THREE.Mesh(handrailGeo, handrailMat);
  rightHand.rotation.x = -Math.atan(8 / 15);
  rightHand.position.set(3, 4 + 2.2, -12.5);
  escalatorGroup.add(rightHand);
  
  // Steps Base Ramp (dark metal)
  const rampGeo = new THREE.BoxGeometry(5.8, 0.5, 16);
  const rampMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.5 });
  const ramp = new THREE.Mesh(rampGeo, rampMat);
  ramp.rotation.x = -Math.atan(8 / 15);
  ramp.position.set(0, 4 - 0.2, -12.5);
  escalatorGroup.add(ramp);

  // Physical Steps
  const stepCount = 40;
  const stepGeo = new THREE.BoxGeometry(5.8, 0.4, 0.4);
  const stepMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.6 });
  const stepsInstanced = new THREE.InstancedMesh(stepGeo, stepMat, stepCount);
  
  const dummy = new THREE.Object3D();
  for (let i = 0; i < stepCount; i++) {
    // Interpolate from Z=-5 to Z=-20
    const progress = i / stepCount;
    const stepZ = -5 - (15 * progress);
    const stepY = 8 * progress;
    
    dummy.position.set(0, stepY, stepZ);
    dummy.updateMatrix();
    stepsInstanced.setMatrixAt(i, dummy.matrix);
  }
  escalatorGroup.add(stepsInstanced);
  
  // Save steps to animate in render loop
  mallGroup.userData.escalatorSteps = stepsInstanced;
  
  // "UPPER LEVEL" Sign hanging above escalator
  const signGeo = new THREE.PlaneGeometry(4, 1);
  const escCanvas = document.createElement('canvas');
  escCanvas.width = 512; escCanvas.height = 128;
  const ctx = escCanvas.getContext('2d');
  ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 50px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('↑ UPPER LEVEL', 256, 64);
  
  const escSignMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(escCanvas) });
  const escSign = new THREE.Mesh(signGeo, escSignMat);
  escSign.position.set(0, 6, -5); // Above entrance
  escalatorGroup.add(escSign);

  mallGroup.add(escalatorGroup);
  // ===================

  // Abstract Tree
  const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 4);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.set(0, 2.5, 0);
  trunk.castShadow = true;
  mallGroup.add(trunk);

  const leavesGeo = new THREE.SphereGeometry(2.5, 16, 16);
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e5c31, roughness: 0.9 });
  const leaves = new THREE.Mesh(leavesGeo, leavesMat);
  leaves.position.set(0, 5, 0);
  leaves.castShadow = true;
  mallGroup.add(leaves);

  // === BRANDING SIGN (Nandini Kushwah) ===
  const brandSignGroup = new THREE.Group();
  
  // Sign frame (Metal pole and backboard)
  const signPole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 }));
  signPole.position.set(0, 2, 2.5); // Stand just in front of the planter
  brandSignGroup.add(signPole);
  
  // The actual sign board
  const brandSignWidth = 4;
  const brandSignHeight = 2.5;
  const brandSignGeo = new THREE.BoxGeometry(brandSignWidth, brandSignHeight, 0.2);
  
  const brandCanvas = document.createElement('canvas');
  brandCanvas.width = 1024; brandCanvas.height = 512;
  const bCtx = brandCanvas.getContext('2d');
  
  // Background (Sleek dark acrylic)
  bCtx.fillStyle = '#0a0a0a';
  bCtx.fillRect(0, 0, 1024, 512);
  
  // Gold/Cyan accents
  bCtx.strokeStyle = '#00ffff';
  bCtx.lineWidth = 10;
  bCtx.strokeRect(10, 10, 1004, 492);
  
  // Main Title
  bCtx.fillStyle = '#ffffff';
  bCtx.font = 'bold 70px "Inter", sans-serif';
  bCtx.textAlign = 'center';
  bCtx.textBaseline = 'middle';
  bCtx.fillText('VIRTUAL SHOPPING MALL', 512, 160);
  
  // Designer Name
  bCtx.fillStyle = '#00ffff';
  bCtx.font = 'bold 50px "Inter", sans-serif';
  bCtx.fillText('Nandini Kushwah', 512, 280);
  
  // Subtitle
  bCtx.fillStyle = '#aaaaaa';
  bCtx.font = '30px "Inter", sans-serif';
  bCtx.fillText('Computer Graphics Project', 512, 360);
  
  const brandTex = new THREE.CanvasTexture(brandCanvas);
  const brandSignMat = new THREE.MeshStandardMaterial({ map: brandTex, roughness: 0.2, metalness: 0.5 });
  const brandSignBackMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.2 });
  
  const brandSignMesh = new THREE.Mesh(brandSignGeo, [
    brandSignBackMat, // right
    brandSignBackMat, // left
    brandSignBackMat, // top
    brandSignBackMat, // bottom
    brandSignMat,     // front
    brandSignBackMat  // back
  ]);
  brandSignMesh.position.set(0, 3, 2.6);
  brandSignMesh.castShadow = true;
  brandSignGroup.add(brandSignMesh);
  
  mallGroup.add(brandSignGroup);

  // Decorative Benches
  const benchMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });
  const benchSupportMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
  
  function createBench() {
    const benchGroup = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 0.8), benchMat);
    seat.position.y = 0.5;
    seat.castShadow = true; seat.receiveShadow = true;
    benchGroup.add(seat);
    
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.6), benchSupportMat);
    leg1.position.set(-1.2, 0.25, 0);
    leg1.castShadow = true;
    benchGroup.add(leg1);
    
    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.6), benchSupportMat);
    leg2.position.set(1.2, 0.25, 0);
    leg2.castShadow = true;
    benchGroup.add(leg2);
    
    return benchGroup;
  }

  // Place benches around the central planter
  const bench1 = createBench(); bench1.position.set(0, 0, 4.5); mallGroup.add(bench1);
  const bench2 = createBench(); bench2.position.set(0, 0, -4.5); mallGroup.add(bench2);
  const bench3 = createBench(); bench3.position.set(4.5, 0, 0); bench3.rotation.y = Math.PI/2; mallGroup.add(bench3);
  const bench4 = createBench(); bench4.position.set(-4.5, 0, 0); bench4.rotation.y = Math.PI/2; mallGroup.add(bench4);

  // Small planters
  const smallPlanterGeo = new THREE.BoxGeometry(1.5, 0.6, 1.5);
  function createSmallPlanter() {
    const pGroup = new THREE.Group();
    const base = new THREE.Mesh(smallPlanterGeo, planterMat);
    base.position.y = 0.3; base.castShadow = true; base.receiveShadow = true;
    pGroup.add(base);
    
    const plant = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), leavesMat);
    plant.position.y = 0.8; plant.castShadow = true;
    pGroup.add(plant);
    return pGroup;
  }
  
  const sp1 = createSmallPlanter(); sp1.position.set(0, 0, 15); mallGroup.add(sp1);
  const sp2 = createSmallPlanter(); sp2.position.set(0, 0, -15); mallGroup.add(sp2);
  
  scene.add(mallGroup);
  return mallGroup;
}
