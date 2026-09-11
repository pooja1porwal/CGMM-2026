import * as THREE from 'three';

export function createPeople(scene) {
  const peopleGroup = new THREE.Group();
  
  // Create a reusable low-poly human generator to guarantee 60fps
  // and avoid heavy .glb loading.
  function createPerson(skinColor, shirtColor, pantsColor, isShopkeeper) {
    const person = new THREE.Group();
    
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.8 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.9 });
    
    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.3), skinMat);
    head.position.y = 1.6;
    head.castShadow = true;
    person.add(head);
    
    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.25), shirtMat);
    torso.position.y = 1.1;
    torso.castShadow = true;
    person.add(torso);
    
    // Arms
    const armGeo = new THREE.BoxGeometry(0.15, 0.6, 0.15);
    const leftArm = new THREE.Mesh(armGeo, skinMat);
    leftArm.position.set(-0.35, 1.1, 0);
    leftArm.castShadow = true;
    person.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeo, skinMat);
    rightArm.position.set(0.35, 1.1, 0);
    rightArm.castShadow = true;
    person.add(rightArm);
    
    // Legs
    const legGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.15, 0.4, 0);
    leftLeg.castShadow = true;
    person.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.15, 0.4, 0);
    rightLeg.castShadow = true;
    person.add(rightLeg);
    
    // Optional Shopkeeper Nametag
    if (isShopkeeper) {
      const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.08), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      tag.position.set(0.15, 1.25, 0.13);
      person.add(tag);
    }
    
    return person;
  }
  
  // 1. SHOPKEEPERS
  const skFashion = createPerson(0x8d5524, 0x111111, 0x222222, true);
  skFashion.position.set(-15, 0, 15); // Fashion store counter
  skFashion.rotation.y = Math.PI / 2;
  peopleGroup.add(skFashion);
  
  const skElectronics = createPerson(0xe0ac69, 0x00a8ff, 0x111111, true);
  skElectronics.position.set(15, 0, 15); // Electronics store
  skElectronics.rotation.y = -Math.PI / 2;
  peopleGroup.add(skElectronics);
  
  const skSports = createPerson(0xc68642, 0xff5722, 0xffffff, true);
  skSports.position.set(-15, 0, -15); // Sports store
  skSports.rotation.y = Math.PI / 2;
  peopleGroup.add(skSports);
  
  const skHome = createPerson(0xf1c27d, 0x607d8b, 0x333333, true);
  skHome.position.set(15, 0, -15); // Home store
  skHome.rotation.y = -Math.PI / 4;
  peopleGroup.add(skHome);
  
  // 2. CUSTOMERS (ATRIUM & STORES)
  const c1 = createPerson(0x8d5524, 0xe74c3c, 0x2980b9, false);
  c1.position.set(0, 0, 10); // Looking at planter
  c1.rotation.y = Math.PI;
  peopleGroup.add(c1);
  
  const c2 = createPerson(0xffdbac, 0xf1c40f, 0x2c3e50, false);
  c2.position.set(3, 0, -2); // Near benches
  c2.rotation.y = -Math.PI / 3;
  peopleGroup.add(c2);
  
  const c3 = createPerson(0xe0ac69, 0x9b59b6, 0x111111, false);
  c3.position.set(-22, 0, 12); // Looking at fashion rack
  c3.rotation.y = Math.PI / 2;
  peopleGroup.add(c3);
  
  const c4 = createPerson(0xc68642, 0x2ecc71, 0x34495e, false);
  c4.position.set(18, 0, -12); // Looking at sofa
  c4.rotation.y = -Math.PI / 4;
  peopleGroup.add(c4);
  // 4. PARKING AREA
  const c6 = createPerson(0x8d5524, 0x95a5a6, 0x222222, false);
  c6.position.set(5, 0, 52); // Walking towards entrance
  c6.rotation.y = Math.PI;
  peopleGroup.add(c6);
  
  scene.add(peopleGroup);
  scene.userData.people = peopleGroup.children;
}

