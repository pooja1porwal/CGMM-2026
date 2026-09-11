import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Node.js FileReader polyfill required for GLTFExporter binary mode
class FileReader {
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = 'data:' + (blob.type || 'application/octet-stream') + ';base64,' + Buffer.from(buf).toString('base64');
      if (this.onload) this.onload();
      if (this.onloadend) this.onloadend();
    });
  }
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload();
      if (this.onloadend) this.onloadend();
    });
  }
}
global.FileReader = FileReader;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '..', 'public', 'models');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Reusable standard material definitions
const matWood = new THREE.MeshStandardMaterial({ name: 'Wood', color: 0x8b5a2b, roughness: 0.65, metalness: 0.05 });
const matFabric = new THREE.MeshStandardMaterial({ name: 'Fabric', color: 0x5a6978, roughness: 0.95, metalness: 0.0 });
const matLeather = new THREE.MeshStandardMaterial({ name: 'Leather', color: 0x3d271d, roughness: 0.45, metalness: 0.15 });
const matMetal = new THREE.MeshStandardMaterial({ name: 'Metal', color: 0x222225, roughness: 0.25, metalness: 0.85 });
const matBrass = new THREE.MeshStandardMaterial({ name: 'Brass', color: 0xd4af37, roughness: 0.3, metalness: 0.8 });
const matAccent = new THREE.MeshStandardMaterial({ name: 'Accent', color: 0xe0d7c7, roughness: 0.9, metalness: 0.0 });
const matScreen = new THREE.MeshStandardMaterial({ name: 'Screen', color: 0x101520, roughness: 0.1, metalness: 0.9 });
const matWhite = new THREE.MeshStandardMaterial({ name: 'White', color: 0xf5f5f7, roughness: 0.85, metalness: 0.0 });

function exportModel(name, group) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      group,
      (glb) => {
        const filePath = path.join(outputDir, `${name}.glb`);
        fs.writeFileSync(filePath, Buffer.from(glb));
        console.log(`Exported: ${name}.glb (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
        resolve();
      },
      (error) => {
        console.error(`Error exporting ${name}:`, error);
        reject(error);
      },
      { binary: true }
    );
  });
}

// 1. SOFA MODEL
function createSofa() {
  const group = new THREE.Group();
  group.name = 'Sofa';

  // Base frame
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.22, 0.92), matFabric);
  base.position.set(0, -0.15, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  base.name = 'frame';
  group.add(base);

  // Seat cushions (3)
  for (let i = 0; i < 3; i++) {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.18, 0.78), matFabric);
    seat.position.set(-0.72 + i * 0.72, 0.05, 0.04);
    seat.castShadow = true;
    seat.receiveShadow = true;
    seat.name = `seat_cushion_${i + 1}`;
    group.add(seat);
  }

  // Backrest main
  const back = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.52, 0.22), matFabric);
  back.position.set(0, 0.4, -0.35);
  back.castShadow = true;
  back.receiveShadow = true;
  back.name = 'backrest';
  group.add(back);

  // Back pillows (3)
  for (let i = 0; i < 3; i++) {
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.42, 0.15), matFabric);
    pillow.position.set(-0.72 + i * 0.72, 0.38, -0.22);
    pillow.rotation.x = -0.1;
    pillow.castShadow = true;
    pillow.name = `back_pillow_${i + 1}`;
    group.add(pillow);
  }

  // Armrests (2)
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.46, 0.92), matFabric);
  armL.position.set(-1.18, 0.2, 0);
  armL.castShadow = true;
  armL.name = 'armrest_left';
  group.add(armL);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.46, 0.92), matFabric);
  armR.position.set(1.18, 0.2, 0);
  armR.castShadow = true;
  armR.name = 'armrest_right';
  group.add(armR);

  // Decorative toss cushions (accessories)
  const tossL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.12), matAccent);
  tossL.position.set(-0.95, 0.25, 0.12);
  tossL.rotation.set(0.1, 0.25, -0.2);
  tossL.name = 'accessory_cushion_1';
  group.add(tossL);

  const tossR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.12), matAccent);
  tossR.position.set(0.95, 0.25, 0.12);
  tossR.rotation.set(0.1, -0.25, 0.2);
  tossR.name = 'accessory_cushion_2';
  group.add(tossR);

  // Draped throw blanket (accessory)
  const throwBlanket = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.75), matAccent);
  throwBlanket.position.set(0.75, 0.16, 0.08);
  throwBlanket.rotation.set(0, 0.05, 0);
  throwBlanket.name = 'accessory_throw';
  group.add(throwBlanket);

  // 4 Angled Wood Legs
  const legPositions = [
    [-1.05, -0.32, 0.35],
    [1.05, -0.32, 0.35],
    [-1.05, -0.32, -0.35],
    [1.05, -0.32, -0.35],
  ];
  legPositions.forEach((pos, i) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.16, 12), matWood);
    leg.position.set(...pos);
    leg.castShadow = true;
    leg.name = `leg_${i + 1}`;
    group.add(leg);

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.024, 0.04, 12), matBrass);
    ferrule.position.set(pos[0], pos[1] - 0.06, pos[2]);
    group.add(ferrule);
  });

  return group;
}

// 2. ARMCHAIR MODEL
function createArmchair() {
  const group = new THREE.Group();
  group.name = 'Armchair';

  // Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.18, 0.85), matFabric);
  base.position.set(0, -0.15, 0);
  base.castShadow = true;
  group.add(base);

  // Deep seat cushion
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.68), matFabric);
  seat.position.set(0, 0.04, 0.05);
  seat.castShadow = true;
  seat.name = 'seat';
  group.add(seat);

  // Contoured high backrest
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.72, 0.16), matFabric);
  back.position.set(0, 0.45, -0.32);
  back.rotation.x = -0.08;
  back.castShadow = true;
  back.name = 'backrest';
  group.add(back);

  // Wingback curves
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.28), matFabric);
  wingL.position.set(-0.4, 0.44, -0.24);
  wingL.rotation.y = 0.2;
  group.add(wingL);

  const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.28), matFabric);
  wingR.position.set(0.4, 0.44, -0.24);
  wingR.rotation.y = -0.2;
  group.add(wingR);

  // Arms
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.38, 0.72), matFabric);
  armL.position.set(-0.45, 0.16, 0.02);
  group.add(armL);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.38, 0.72), matFabric);
  armR.position.set(0.45, 0.16, 0.02);
  group.add(armR);

  // Lumbar pillow (accessory)
  const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.22, 0.1), matAccent);
  pillow.position.set(0, 0.2, -0.2);
  pillow.name = 'accessory_lumbar';
  group.add(pillow);

  // Legs with brass tips
  const legCoords = [
    [-0.38, -0.35, 0.32],
    [0.38, -0.35, 0.32],
    [-0.38, -0.35, -0.32],
    [0.38, -0.35, -0.32],
  ];
  legCoords.forEach((pos, i) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.02, 0.24, 12), matWood);
    leg.position.set(...pos);
    leg.castShadow = true;
    group.add(leg);

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.02, 0.05, 12), matBrass);
    ferrule.position.set(pos[0], pos[1] - 0.09, pos[2]);
    group.add(ferrule);
  });

  return group;
}

// 3. DINING TABLE MODEL
function createDiningTable() {
  const group = new THREE.Group();
  group.name = 'DiningTable';

  // Tabletop with beveled edge
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 1.05), matWood);
  top.position.set(0, 0.28, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  top.name = 'table_top';
  group.add(top);

  // Apron underframe
  const apronL = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.04), matWood);
  apronL.position.set(0, 0.23, 0.44);
  group.add(apronL);

  const apronR = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.04), matWood);
  apronR.position.set(0, 0.23, -0.44);
  group.add(apronR);

  // Center Runner (accessory)
  const runner = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.008, 0.34), matFabric);
  runner.position.set(0, 0.315, 0);
  runner.name = 'accessory_runner';
  group.add(runner);

  // Ceramic centerpiece vase (accessory)
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.24, 16), matWhite);
  vase.position.set(0, 0.44, 0);
  vase.name = 'accessory_vase';
  group.add(vase);

  // Green plant stem in vase
  const plant = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 }));
  plant.position.set(0, 0.58, 0);
  plant.name = 'accessory_plant';
  group.add(plant);

  // 4 Architectural legs
  const legCoords = [
    [-0.85, -0.16, 0.4],
    [0.85, -0.16, 0.4],
    [-0.85, -0.16, -0.4],
    [0.85, -0.16, -0.4],
  ];
  legCoords.forEach((pos, i) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.026, 0.82, 12), matWood);
    leg.position.set(...pos);
    leg.castShadow = true;
    group.add(leg);

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.026, 0.08, 12), matBrass);
    ferrule.position.set(pos[0], pos[1] - 0.37, pos[2]);
    group.add(ferrule);
  });

  return group;
}

// 4. COFFEE TABLE MODEL
function createCoffeeTable() {
  const group = new THREE.Group();
  group.name = 'CoffeeTable';

  // Upper tabletop
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.04, 32), matWood);
  top.position.set(0, -0.1, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  top.name = 'table_top';
  group.add(top);

  // Lower tier shelf
  const lowerShelf = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.025, 32), matWood);
  lowerShelf.position.set(0, -0.32, 0);
  lowerShelf.castShadow = true;
  lowerShelf.name = 'shelf';
  group.add(lowerShelf);

  // 3 Brass support legs
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const x = Math.cos(angle) * 0.46;
    const z = Math.sin(angle) * 0.46;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.55, 12), matBrass);
    leg.position.set(x, -0.28, z);
    leg.castShadow = true;
    group.add(leg);
  }

  // Accessories: Books & Ceramic Coffee Mug on top
  const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.18), new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 }));
  book1.position.set(-0.12, -0.065, 0.08);
  book1.rotation.y = 0.2;
  book1.name = 'accessory_book1';
  group.add(book1);

  const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.16), new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.8 }));
  book2.position.set(-0.12, -0.04, 0.08);
  book2.rotation.y = 0.35;
  book2.name = 'accessory_book2';
  group.add(book2);

  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.07, 16), matWhite);
  mug.position.set(0.18, -0.045, -0.1);
  mug.name = 'accessory_mug';
  group.add(mug);

  // Designer round rug underneath (accessory)
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.008, 32), matFabric);
  rug.position.set(0, -0.55, 0);
  rug.name = 'accessory_rug';
  group.add(rug);

  return group;
}

// 5. BED MODEL
function createBed() {
  const group = new THREE.Group();
  group.name = 'Bed';

  // Wooden / Upholstered Frame
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 2.2), matWood);
  frame.position.set(0, -0.16, 0);
  frame.castShadow = true;
  frame.receiveShadow = true;
  frame.name = 'frame';
  group.add(frame);

  // Thick Mattress
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.26, 2.05), matWhite);
  mattress.position.set(0, 0.08, 0.05);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  mattress.name = 'mattress';
  group.add(mattress);

  // Fitted Bedsheet (accessory)
  const bedsheet = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.015, 2.07), matFabric);
  bedsheet.position.set(0, 0.215, 0.05);
  bedsheet.name = 'accessory_bedsheet';
  group.add(bedsheet);

  // Folded Comforter Duvet Blanket (accessory)
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.06, 1.2), matFabric);
  blanket.position.set(0, 0.245, 0.46);
  blanket.castShadow = true;
  blanket.name = 'accessory_blanket';
  group.add(blanket);

  // Fluted Headboard
  const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.95, 0.12), matFabric);
  headboard.position.set(0, 0.42, -1.04);
  headboard.castShadow = true;
  headboard.receiveShadow = true;
  headboard.name = 'headboard';
  group.add(headboard);

  // 4 Sleeping Pillows (2 front, 2 back)
  const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
  [-0.45, 0.45].forEach((x, i) => {
    // Back pillow
    const pBack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.32), pillowMat);
    pBack.position.set(x, 0.28, -0.76);
    pBack.rotation.x = -0.2;
    pBack.castShadow = true;
    pBack.name = `accessory_pillow_back_${i + 1}`;
    group.add(pBack);

    // Front accent pillow
    const pFront = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 0.26), matAccent);
    pFront.position.set(x, 0.3, -0.58);
    pFront.rotation.x = -0.3;
    pFront.castShadow = true;
    pFront.name = `accessory_pillow_front_${i + 1}`;
    group.add(pFront);
  });

  // 4 Low Sturdy Wooden Legs
  const legCoords = [
    [-0.82, -0.32, 1.0],
    [0.82, -0.32, 1.0],
    [-0.82, -0.32, -1.0],
    [0.82, -0.32, -1.0],
  ];
  legCoords.forEach((pos, i) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.12, 12), matWood);
    leg.position.set(...pos);
    leg.castShadow = true;
    group.add(leg);
  });

  return group;
}

// 6. OFFICE CHAIR MODEL
function createOfficeChair() {
  const group = new THREE.Group();
  group.name = 'OfficeChair';

  // 5-Star Caster Base
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const x = Math.cos(angle) * 0.36;
    const z = Math.sin(angle) * 0.36;

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.05), matMetal);
    arm.position.set(x / 2, -0.48, z / 2);
    arm.rotation.y = -angle;
    group.add(arm);

    const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), matMetal);
    wheel.position.set(x, -0.51, z);
    group.add(wheel);
  }

  // Hydraulic Center Cylinder
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.35, 16), matMetal);
  cylinder.position.set(0, -0.32, 0);
  group.add(cylinder);

  // Seat pan
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.1, 0.52), matLeather);
  seat.position.set(0, -0.08, 0);
  seat.castShadow = true;
  seat.receiveShadow = true;
  seat.name = 'seat';
  group.add(seat);

  // Ergonomic curved backrest
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.62, 0.06), matLeather);
  back.position.set(0, 0.32, -0.24);
  back.rotation.x = -0.06;
  back.castShadow = true;
  back.name = 'backrest';
  group.add(back);

  // Lumbar support pad (accessory)
  const lumbar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.05), matLeather);
  lumbar.position.set(0, 0.16, -0.2);
  lumbar.name = 'accessory_lumbar';
  group.add(lumbar);

  // Headrest (accessory)
  const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.08), matLeather);
  headrest.position.set(0, 0.68, -0.28);
  headrest.name = 'accessory_headrest';
  group.add(headrest);

  // 3D Armrests (Left & Right)
  [-0.31, 0.31].forEach((x, i) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 12), matMetal);
    post.position.set(x, 0.03, -0.04);
    group.add(post);

    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.26), matLeather);
    pad.position.set(x, 0.15, -0.04);
    pad.name = `accessory_armrest_${i + 1}`;
    group.add(pad);
  });

  return group;
}

// 7. DINING CHAIR MODEL
function createDiningChair() {
  const group = new THREE.Group();
  group.name = 'DiningChair';

  // Contoured Seat
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.48), matWood);
  seat.position.set(0, 0.02, 0);
  seat.castShadow = true;
  seat.name = 'seat';
  group.add(seat);

  // Padded Seat Cushion (accessory)
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.44), matFabric);
  cushion.position.set(0, 0.06, 0);
  cushion.name = 'accessory_seat_pad';
  group.add(cushion);

  // Curved Spindle Backrest
  const backTop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.52, 12), matWood);
  backTop.rotation.z = Math.PI / 2;
  backTop.position.set(0, 0.52, -0.22);
  group.add(backTop);

  for (let i = 0; i < 5; i++) {
    const x = -0.18 + i * 0.09;
    const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.46, 8), matWood);
    spindle.position.set(x, 0.27, -0.22);
    group.add(spindle);
  }

  // Splayed Legs
  const legCoords = [
    [-0.21, -0.24, 0.19],
    [0.21, -0.24, 0.19],
    [-0.21, -0.24, -0.19],
    [0.21, -0.24, -0.19],
  ];
  legCoords.forEach((pos, i) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.016, 0.52, 12), matWood);
    leg.position.set(...pos);
    leg.castShadow = true;
    group.add(leg);

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.06, 12), matBrass);
    ferrule.position.set(pos[0], pos[1] - 0.23, pos[2]);
    group.add(ferrule);
  });

  return group;
}

// 8. WARDROBE MODEL
function createWardrobe() {
  const group = new THREE.Group();
  group.name = 'Wardrobe';

  // Main Cabinet Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.9, 0.65), matWood);
  body.position.set(0, 0.1, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  body.name = 'wardrobe_body';
  group.add(body);

  // Recessed Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.12, 0.6), matMetal);
  plinth.position.set(0, -0.88, 0);
  group.add(plinth);

  // Left Door
  const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.67, 1.84, 0.04), matWood);
  doorL.position.set(-0.34, 0.1, 0.33);
  doorL.castShadow = true;
  doorL.name = 'accessory_door_left';
  group.add(doorL);

  // Right Door
  const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.67, 1.84, 0.04), matWood);
  doorR.position.set(0.34, 0.1, 0.33);
  doorR.castShadow = true;
  doorR.name = 'accessory_door_right';
  group.add(doorR);

  // Vertical Metal Handles (Accessories)
  const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 12), matBrass);
  handleL.position.set(-0.06, 0.1, 0.36);
  handleL.name = 'accessory_handle_left';
  group.add(handleL);

  const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 12), matBrass);
  handleR.position.set(0.06, 0.1, 0.36);
  handleR.name = 'accessory_handle_right';
  group.add(handleR);

  return group;
}

// 9. STUDY DESK MODEL
function createStudyDesk() {
  const group = new THREE.Group();
  group.name = 'StudyDesk';

  // Desktop Surface
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.8), matWood);
  top.position.set(0, 0.28, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  top.name = 'desk_top';
  group.add(top);

  // 3-Drawer Pedestal Unit (Right side)
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.65, 0.72), matWood);
  pedestal.position.set(0.52, -0.07, 0);
  pedestal.castShadow = true;
  pedestal.name = 'pedestal';
  group.add(pedestal);

  // 3 Drawer pull bars
  for (let i = 0; i < 3; i++) {
    const pull = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 12), matBrass);
    pull.rotation.z = Math.PI / 2;
    pull.position.set(0.52, 0.12 - i * 0.19, 0.37);
    group.add(pull);
  }

  // Sturdy Steel Leg Frame (Left side)
  const legL1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.65, 0.04), matMetal);
  legL1.position.set(-0.7, -0.07, 0.34);
  group.add(legL1);

  const legL2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.65, 0.04), matMetal);
  legL2.position.set(-0.7, -0.07, -0.34);
  group.add(legL2);

  const stretcherL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.68), matMetal);
  stretcherL.position.set(-0.7, -0.36, 0);
  group.add(stretcherL);

  // Articulated Study Lamp (accessory)
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16), matBrass);
  lampBase.position.set(-0.55, 0.315, -0.22);
  lampBase.name = 'accessory_lamp_base';
  group.add(lampBase);

  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.32, 8), matBrass);
  lampStem.position.set(-0.55, 0.46, -0.22);
  group.add(lampStem);

  const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 16), matBrass);
  lampShade.position.set(-0.48, 0.58, -0.15);
  lampShade.rotation.z = -0.5;
  lampShade.name = 'accessory_lamp';
  group.add(lampShade);

  // Modern Laptop (accessory)
  const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.012, 0.22), matMetal);
  laptopBase.position.set(0, 0.31, 0.04);
  laptopBase.name = 'accessory_laptop_base';
  group.add(laptopBase);

  const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.01), matScreen);
  laptopScreen.position.set(0, 0.41, -0.06);
  laptopScreen.rotation.x = -0.15;
  laptopScreen.name = 'accessory_laptop';
  group.add(laptopScreen);

  return group;
}

// 10. TV CABINET MODEL
function createTvCabinet() {
  const group = new THREE.Group();
  group.name = 'TvCabinet';

  // Low Credenza Main Body
  const credenza = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.45, 0.48), matWood);
  credenza.position.set(0, -0.15, 0);
  credenza.castShadow = true;
  credenza.receiveShadow = true;
  credenza.name = 'cabinet_body';
  group.add(credenza);

  // Fluted Sliding Doors (Left & Right)
  const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.4, 0.03), matWood);
  doorL.position.set(-0.66, -0.15, 0.25);
  doorL.name = 'accessory_door_left';
  group.add(doorL);

  const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.4, 0.03), matWood);
  doorR.position.set(0.66, -0.15, 0.25);
  doorR.name = 'accessory_door_right';
  group.add(doorR);

  // 4 Mid-Century Splayed Legs
  const legCoords = [
    [-0.92, -0.48, 0.18],
    [0.92, -0.48, 0.18],
    [-0.92, -0.48, -0.18],
    [0.92, -0.48, -0.18],
  ];
  legCoords.forEach((pos) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.018, 0.24, 12), matWood);
    leg.position.set(...pos);
    leg.castShadow = true;
    group.add(leg);

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.018, 0.05, 12), matBrass);
    ferrule.position.set(pos[0], pos[1] - 0.09, pos[2]);
    group.add(ferrule);
  });

  // 55-inch OLED Flat Screen TV (accessory)
  const tvBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.015, 0.22), matMetal);
  tvBase.position.set(0, 0.08, 0);
  group.add(tvBase);

  const tvStand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.04), matMetal);
  tvStand.position.set(0, 0.16, 0);
  group.add(tvStand);

  const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.95, 0.04), matMetal);
  tvFrame.position.set(0, 0.68, 0);
  tvFrame.castShadow = true;
  group.add(tvFrame);

  const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.61, 0.91), matScreen);
  tvScreen.position.set(0, 0.68, 0.022);
  tvScreen.name = 'accessory_tv';
  group.add(tvScreen);

  // Slim Soundbar Speaker (accessory)
  const soundbar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.08), matMetal);
  soundbar.position.set(0, 0.11, 0.14);
  soundbar.name = 'accessory_soundbar';
  group.add(soundbar);

  return group;
}

async function run() {
  console.log('Generating realistic 3D GLB models...');
  const models = [
    { name: 'sofa', fn: createSofa },
    { name: 'armchair', fn: createArmchair },
    { name: 'dining-table', fn: createDiningTable },
    { name: 'coffee-table', fn: createCoffeeTable },
    { name: 'bed', fn: createBed },
    { name: 'office-chair', fn: createOfficeChair },
    { name: 'dining-chair', fn: createDiningChair },
    { name: 'wardrobe', fn: createWardrobe },
    { name: 'study-desk', fn: createStudyDesk },
    { name: 'tv-cabinet', fn: createTvCabinet },
  ];

  for (const m of models) {
    const group = m.fn();
    await exportModel(m.name, group);
  }

  console.log('All 10 GLB models successfully generated in public/models/ !');
}

run().catch(console.error);
