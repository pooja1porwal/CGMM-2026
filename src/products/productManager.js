import * as THREE from 'three';
import { getProductById } from './productData.js';

export const allProducts = [];

// Helper to create a unified product object
function createProductGroup(id) {
  const data = getProductById(id);
  if (!data) return null;
  
  const group = new THREE.Group();
  group.userData = { isProduct: true, id: data.id };
  allProducts.push(group);
  return { group, data };
}

export function createJacket() {
  const { group, data } = createProductGroup('f1');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.5), mat);
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 0.4), mat);
  leftArm.position.set(-0.8, 0, 0);
  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 0.4), mat);
  rightArm.position.set(0.8, 0, 0);
  
  group.add(torso, leftArm, rightArm);
  group.castShadow = true;
  return group;
}

export function createSneakers() {
  const { group, data } = createProductGroup('f2');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  
  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 1.2), soleMat);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.4, 0.8), mat);
  upper.position.set(0, 0.3, -0.1);
  
  group.add(sole, upper);
  return group;
}

export function createTShirt() {
  const { group, data } = createProductGroup('f3');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.4), mat);
  const leftSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.38), mat);
  leftSleeve.position.set(-0.8, 0.4, 0);
  const rightSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.38), mat);
  rightSleeve.position.set(0.8, 0.4, 0);
  
  group.add(torso, leftSleeve, rightSleeve);
  return group;
}

export function createLaptop() {
  const { group, data } = createProductGroup('e1');
  const mat = new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.8, roughness: 0.2 });
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1), mat);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 0.05), mat);
  lid.position.set(0, 0.5, -0.5);
  // Slightly angle the lid
  lid.rotation.x = -0.2;
  
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.9), screenMat);
  screen.position.set(0, 0.5, -0.47);
  screen.rotation.x = -0.2;

  group.add(base, lid, screen);
  return group;
}

export function createSmartphone() {
  const { group, data } = createProductGroup('e2');
  const mat = new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.9, roughness: 0.1 });
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.05), mat);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.95), screenMat);
  screen.position.z = 0.026;
  
  group.add(body, screen);
  return group;
}

export function createHeadphones() {
  const { group, data } = createProductGroup('e3');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const padMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.05, 8, 24, Math.PI), mat);
  band.rotation.z = Math.PI; // flip upside down to form arch
  band.position.y = 0.5;

  const leftCup = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1), mat);
  leftCup.rotation.z = Math.PI / 2;
  leftCup.position.set(-0.4, 0.4, 0);
  
  const leftPad = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05), padMat);
  leftPad.rotation.z = Math.PI / 2;
  leftPad.position.set(-0.35, 0.4, 0);

  const rightCup = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1), mat);
  rightCup.rotation.z = Math.PI / 2;
  rightCup.position.set(0.4, 0.4, 0);

  const rightPad = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05), padMat);
  rightPad.rotation.z = Math.PI / 2;
  rightPad.position.set(0.35, 0.4, 0);

  group.add(band, leftCup, leftPad, rightCup, rightPad);
  return group;
}

export function createFootball() {
  const { group, data } = createProductGroup('s1');
  // Icosahedron looks a bit like a low-poly soccer ball
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 1), mat);
  group.add(ball);
  return group;
}

export function createBasketball() {
  const { group, data } = createProductGroup('s2');
  const mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.9 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), mat);
  group.add(ball);
  return group;
}

export function createDumbbell() {
  const { group, data } = createProductGroup('s3');
  const mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.8 });
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
  
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), handleMat);
  handle.rotation.z = Math.PI / 2;

  // Cylinder with 6 radial segments makes a hexagon
  const leftWeight = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 6), mat);
  leftWeight.rotation.z = Math.PI / 2;
  leftWeight.position.set(-0.4, 0, 0);
  
  const rightWeight = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 6), mat);
  rightWeight.rotation.z = Math.PI / 2;
  rightWeight.position.set(0.4, 0, 0);

  group.add(handle, leftWeight, rightWeight);
  return group;
}

export function createChair() {
  const { group, data } = createProductGroup('h1');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), mat);
  seat.position.y = 0.5;
  
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), mat);
  back.position.set(0, 0.9, -0.35);

  const legGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.5);
  const positions = [
    [-0.35, 0.25, -0.35],
    [0.35, 0.25, -0.35],
    [-0.35, 0.25, 0.35],
    [0.35, 0.25, 0.35]
  ];
  
  group.add(seat, back);
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, mat);
    leg.position.set(...pos);
    group.add(leg);
  });

  return group;
}

export function createTableLamp() {
  const { group, data } = createProductGroup('h2');
  const mat = new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.5 });
  const shadeMat = new THREE.MeshStandardMaterial({ color: 0xffffee, side: THREE.DoubleSide });
  
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05), mat);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6), mat);
  stand.position.y = 0.3;
  
  // Cone for shade (radiusTop=0.1, radiusBottom=0.25, height=0.3)
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.25, 0.3, 16, 1, true), shadeMat);
  shade.position.y = 0.6;

  group.add(base, stand, shade);
  return group;
}

export function createTable() {
  const { group, data } = createProductGroup('h3');
  const mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.8 });
  
  const top = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1.2), mat);
  top.position.y = 0.8;
  
  const legGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
  const positions = [
    [-0.9, 0.4, -0.5],
    [0.9, 0.4, -0.5],
    [-0.9, 0.4, 0.5],
    [0.9, 0.4, 0.5]
  ];
  
  group.add(top);
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, mat);
    leg.position.set(...pos);
    group.add(leg);
  });

  return group;
}

// === NEW FOOD COURT PRODUCTS ===
export function createBurger() {
  const { group, data } = createProductGroup('fc1');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const burger = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), mat);
  group.add(burger);
  return group;
}

export function createPizza() {
  const { group, data } = createProductGroup('fc2');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const pizza = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32), mat);
  group.add(pizza);
  return group;
}

export function createCoffee() {
  const { group, data } = createProductGroup('fc3');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 0.4, 16), mat);
  cup.position.y = 0.2;
  group.add(cup);
  return group;
}

export function createIceCream() {
  const { group, data } = createProductGroup('fc4');
  const coneMat = new THREE.MeshStandardMaterial({ color: 0xcd853f });
  const iceMat = new THREE.MeshStandardMaterial({ color: data.color });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 16), coneMat);
  cone.position.y = 0.2;
  cone.rotation.z = Math.PI; // upside down cone
  const scoop = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), iceMat);
  scoop.position.y = 0.45;
  group.add(cone, scoop);
  return group;
}

export function createSandwich() {
  const { group, data } = createProductGroup('fc5');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const sand = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.3), mat);
  group.add(sand);
  return group;
}

// === NEW BOOK & STATIONERY PRODUCTS ===
export function createBook() {
  const { group, data } = createProductGroup('b1');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const pagesMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.7), mat);
  const pages = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.71), pagesMat);
  group.add(book, pages);
  return group;
}

export function createNotebook() {
  const { group, data } = createProductGroup('b2');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.6), mat);
  group.add(book);
  return group;
}

export function createPenSet() {
  const { group, data } = createProductGroup('b3');
  const mat = new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.8 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.15), new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 }));
  const pen1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25), mat);
  pen1.rotation.z = Math.PI/2;
  const pen2 = pen1.clone();
  pen2.position.z = -0.04;
  const pen3 = pen1.clone();
  pen3.position.z = 0.04;
  group.add(box, pen1, pen2, pen3);
  return group;
}

export function createDiary() {
  const { group, data } = createProductGroup('b4');
  const mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.9 });
  const diary = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.5), mat);
  group.add(diary);
  return group;
}

export function createPencilBox() {
  const { group, data } = createProductGroup('b5');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const pbox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.15), mat);
  group.add(pbox);
  return group;
}

// === NEW BEAUTY & COSMETICS PRODUCTS ===
export function createPerfume() {
  const { group, data } = createProductGroup('bc1');
  const glassMat = new THREE.MeshStandardMaterial({ color: data.color, transparent: true, opacity: 0.7, metalness: 0.9 });
  const capMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0 });
  const bottle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.1), glassMat);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05), capMat);
  neck.position.y = 0.125;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.05), capMat);
  cap.position.y = 0.17;
  group.add(bottle, neck, cap);
  return group;
}

export function createLipstick() {
  const { group, data } = createProductGroup('bc2');
  const tubeMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
  const lipMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.3 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15), tubeMat);
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08), lipMat);
  lip.position.y = 0.11;
  group.add(base, lip);
  return group;
}

export function createFaceCream() {
  const { group, data } = createProductGroup('bc3');
  const mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.2 });
  const capMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5 });
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.15), mat);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04), capMat);
  cap.position.y = 0.09;
  group.add(jar, cap);
  return group;
}

export function createShampoo() {
  const { group, data } = createProductGroup('bc4');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.4), mat);
  const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  pump.position.y = 0.25;
  group.add(bottle, pump);
  return group;
}

export function createLotion() {
  const { group, data } = createProductGroup('bc5');
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const bottle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.35, 0.1), mat);
  group.add(bottle);
  return group;
}

