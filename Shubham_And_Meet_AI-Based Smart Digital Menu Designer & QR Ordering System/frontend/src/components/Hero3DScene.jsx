import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Pause, 
  Play, 
  Sparkles, 
  Sliders, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Utensils
} from 'lucide-react';

const DISH_PRESETS = [
  {
    id: 'paneer',
    name: 'Paneer Butter Masala',
    icon: '🍲',
    sliderLabel: 'Cream Richness',
    defaultSlider: 40,
    subtitle: 'Rich creamy gravy with fresh paneer cubes & butter',
  },
  {
    id: 'spring-rolls',
    name: 'Veg Spring Rolls',
    icon: '🥢',
    sliderLabel: 'Crispiness Level',
    defaultSlider: 55,
    subtitle: 'Crispy golden rolls with sweet chili dipping sauce',
  },
  {
    id: 'paratha',
    name: 'Lachha Paratha Stack',
    icon: '🫓',
    sliderLabel: 'Roast & Flakiness',
    defaultSlider: 72,
    subtitle: 'Flaky multi-layered parathas with melted butter & chutney',
  },
  {
    id: 'lime-soda',
    name: 'Fresh Lime Soda',
    icon: '🍹',
    sliderLabel: 'Citrus Juice Level',
    defaultSlider: 65,
    subtitle: 'Chilled effervescent soda with mint, ice & lime slices',
  },
];

export default function Hero3DScene() {
  const mountRef = useRef(null);
  const [selectedDish, setSelectedDish] = useState('paneer');
  const [sliderVal, setSliderVal] = useState(40);
  const [autoRotate, setAutoRotate] = useState(true);

  // References for live updates inside animation loop
  const currentDishRef = useRef('paneer');
  const sliderValRef = useRef(40);
  const autoRotateRef = useRef(true);
  const onSliderChangeRef = useRef(null);

  // Sync state to refs
  useEffect(() => {
    currentDishRef.current = selectedDish;
    const preset = DISH_PRESETS.find(d => d.id === selectedDish);
    if (preset) {
      setSliderVal(preset.defaultSlider);
      sliderValRef.current = preset.defaultSlider;
    }
  }, [selectedDish]);

  useEffect(() => {
    sliderValRef.current = sliderVal;
    if (onSliderChangeRef.current) {
      onSliderChangeRef.current(sliderVal / 100);
    }
  }, [sliderVal]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const stage = mountRef.current;
    if (!stage) return;

    const W = stage.clientWidth || 600;
    const H = stage.clientHeight || 420;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn('WebGL init failed:', e);
      return;
    }

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);

    let dist = 11.5;
    let rotY = 0.35;
    let rotX = 0.45;
    let dragging = false;
    let lx = 0;
    let ly = 0;

    function rnd(a, b) { return a + Math.random() * (b - a); }

    // Lights
    const hemi = new THREE.HemisphereLight(0xfff0dd, 0x5a4230, 0.7);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff3e5, 1.5);
    keyLight.position.set(5, 9, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0006;
    const sc = keyLight.shadow.camera;
    sc.left = -8; sc.right = 8; sc.top = 8; sc.bottom = -8; sc.near = 1; sc.far = 26;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbfe0f2, 0.45);
    fillLight.position.set(-5, 4, -4);
    scene.add(fillLight);

    const root = new THREE.Group();
    scene.add(root);

    // Track active meshes for cleanup
    let dishGroup = new THREE.Group();
    root.add(dishGroup);

    // ─────────────────────────────────────────────────────────
    // SCENE 1: PANEER BUTTER MASALA
    // ─────────────────────────────────────────────────────────
    function buildPaneerScene(creamVal) {
      dist = 11.5;
      rotX = 0.42;

      const table = new THREE.Mesh(
        new THREE.CylinderGeometry(9, 9, 0.5, 48),
        new THREE.MeshStandardMaterial({ color: 0x6a4325, roughness: 0.85 })
      );
      table.position.y = -0.3;
      table.receiveShadow = true;
      dishGroup.add(table);

      const napkin = new THREE.Mesh(
        new THREE.BoxGeometry(7.2, 0.09, 5.4),
        new THREE.MeshStandardMaterial({ color: 0xd9cfbd, roughness: 0.95 })
      );
      napkin.position.set(-0.5, -0.01, 0.4);
      napkin.rotation.y = 0.22;
      napkin.receiveShadow = true;
      dishGroup.add(napkin);

      const bowlPts = [
        new THREE.Vector2(0.0, 0.10),
        new THREE.Vector2(1.20, 0.06),
        new THREE.Vector2(1.85, 0.32),
        new THREE.Vector2(2.30, 0.85),
        new THREE.Vector2(2.55, 1.45),
        new THREE.Vector2(2.62, 1.68),
        new THREE.Vector2(2.86, 1.70),
        new THREE.Vector2(2.94, 1.42),
        new THREE.Vector2(2.86, 0.82),
        new THREE.Vector2(2.42, 0.24),
        new THREE.Vector2(1.55, -0.04),
        new THREE.Vector2(0.0, -0.06)
      ];
      const bowl = new THREE.Mesh(
        new THREE.LatheGeometry(bowlPts, 72),
        new THREE.MeshStandardMaterial({ color: 0x141312, roughness: 0.55, metalness: 0.12, side: THREE.DoubleSide })
      );
      bowl.position.y = 0.06;
      bowl.castShadow = true;
      bowl.receiveShadow = true;
      dishGroup.add(bowl);

      function createGravyTexture(creamAmt) {
        const c = document.createElement('canvas');
        c.width = 512; c.height = 512;
        const x = c.getContext('2d');
        const g = x.createRadialGradient(256, 256, 20, 256, 256, 256);
        g.addColorStop(0, '#e8853a');
        g.addColorStop(0.55, '#d8641f');
        g.addColorStop(1, '#b8480f');
        x.fillStyle = g;
        x.fillRect(0, 0, 512, 512);

        for (let i = 0; i < 60; i++) {
          const px = rnd(0, 512), py = rnd(0, 512), pr = rnd(20, 70);
          const rg = x.createRadialGradient(px, py, 0, px, py, pr);
          rg.addColorStop(0, i % 2 ? 'rgba(160,52,10,0.5)' : 'rgba(246,158,70,0.45)');
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          x.fillStyle = rg;
          x.beginPath(); x.arc(px, py, pr, 0, 6.3); x.fill();
        }
        for (let i = 0; i < 900; i++) {
          x.fillStyle = 'rgba(120,32,6,' + rnd(0.08, 0.3) + ')';
          x.fillRect(rnd(0, 512), rnd(0, 512), rnd(1.5, 4), rnd(1.5, 3));
        }
        for (let i = 0; i < 400; i++) {
          x.fillStyle = 'rgba(255,214,140,' + rnd(0.1, 0.35) + ')';
          x.beginPath(); x.arc(rnd(0, 512), rnd(0, 512), rnd(1.5, 5), 0, 6.3); x.fill();
        }
        // Cream swirl
        x.strokeStyle = 'rgba(255,250,238,' + (0.35 + creamAmt * 0.6) + ')';
        x.lineWidth = 9 + creamAmt * 7;
        x.lineCap = 'round';
        for (let i = 0; i < 10; i++) {
          const a0 = (i / 10) * 6.283;
          x.beginPath();
          x.arc(256, 256, 150, a0, a0 + 0.42);
          x.stroke();
          x.beginPath();
          x.arc(256, 256, 92, a0 + 0.3, a0 + 0.66);
          x.stroke();
        }
        // Cilantro flecks
        for (let i = 0; i < 90; i++) {
          x.fillStyle = ['#4f8b25', '#69a832', '#3d7018'][Math.floor(rnd(0, 3))];
          x.beginPath();
          x.ellipse(rnd(40, 472), rnd(40, 472), rnd(3, 9), rnd(2, 5), rnd(0, 3), 0, 6.3);
          x.fill();
        }
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      }

      const gravyMat = new THREE.MeshStandardMaterial({
        map: createGravyTexture(creamVal), roughness: 0.28, metalness: 0.06
      });
      const gravy = new THREE.Mesh(new THREE.CylinderGeometry(2.42, 1.9, 1.05, 72), gravyMat);
      gravy.position.y = 0.85;
      gravy.receiveShadow = true;
      dishGroup.add(gravy);

      // Paneer Cubes Texture
      const pc = document.createElement('canvas');
      pc.width = 128; pc.height = 128;
      const pxCtx = pc.getContext('2d');
      pxCtx.fillStyle = '#eda849';
      pxCtx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 14; i++) {
        const px = rnd(0, 128), py = rnd(0, 128), pr = rnd(8, 26);
        const rg = pxCtx.createRadialGradient(px, py, 0, px, py, pr);
        rg.addColorStop(0, 'rgba(140,64,14,0.55)');
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        pxCtx.fillStyle = rg;
        pxCtx.beginPath(); pxCtx.arc(px, py, pr, 0, 6.3); pxCtx.fill();
      }
      for (let i = 0; i < 500; i++) {
        pxCtx.fillStyle = 'rgba(255,226,160,' + rnd(0.05, 0.25) + ')';
        pxCtx.fillRect(rnd(0, 128), rnd(0, 128), rnd(1, 3), rnd(1, 3));
      }
      const pTex = new THREE.CanvasTexture(pc);
      pTex.colorSpace = THREE.SRGBColorSpace;

      const paneerMat = new THREE.MeshStandardMaterial({
        map: pTex, bumpMap: pTex, bumpScale: 0.02, roughness: 0.65
      });
      const ring = [
        [0.0, -1.55, 0.4], [1.35, -0.95, 1.1], [1.72, 0.25, 2.0], [1.15, 1.35, 2.6],
        [-0.15, 1.75, 0.9], [-1.35, 1.05, 1.7], [-1.78, -0.2, 0.2], [-1.15, -1.3, 2.3],
        [0.75, -0.55, 1.4], [-0.65, 0.45, 0.6]
      ];
      ring.forEach((p) => {
        const s = rnd(0.46, 0.62);
        const cube = new THREE.Mesh(new THREE.BoxGeometry(s, s * 0.85, s), paneerMat);
        cube.position.set(p[0], 1.42 + rnd(-0.05, 0.06), p[1]);
        cube.rotation.set(rnd(-0.15, 0.15), p[2], rnd(-0.12, 0.12));
        cube.castShadow = true;
        dishGroup.add(cube);
      });

      // Butter Dollop
      const butter = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 24, 18),
        new THREE.MeshStandardMaterial({ color: 0xf7e492, roughness: 0.35 })
      );
      butter.scale.set(1, 0.42, 0.85);
      butter.position.set(0.05, 1.5, 0.05);
      butter.castShadow = true;
      dishGroup.add(butter);

      // Ginger Julienne Sticks
      const gingerMat = new THREE.MeshStandardMaterial({ color: 0xefdca6, roughness: 0.6 });
      for (let gi = 0; gi < 16; gi++) {
        const stick = new THREE.Mesh(new THREE.BoxGeometry(rnd(0.3, 0.55), 0.035, 0.055), gingerMat);
        const ga = rnd(0, 6.283), gr = rnd(0.3, 1.75);
        stick.position.set(Math.cos(ga) * gr, 1.45, Math.sin(ga) * gr);
        stick.rotation.y = rnd(0, 3.1);
        dishGroup.add(stick);
      }

      // Fresh Coriander Leaves
      const leafMats = [
        new THREE.MeshStandardMaterial({ color: 0x4f8f22, roughness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0x71b23a, roughness: 0.5 })
      ];
      for (let li = 0; li < 34; li++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), leafMats[li % 2]);
        leaf.scale.set(1, 0.16, 0.62);
        const la = rnd(0, 6.283), lr = rnd(0.25, 2.15);
        leaf.position.set(Math.cos(la) * lr, 1.46 + rnd(0, 0.05), Math.sin(la) * lr);
        leaf.rotation.y = rnd(0, 3.1);
        leaf.rotation.z = rnd(-0.2, 0.2);
        dishGroup.add(leaf);
      }

      // Water Glass
      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62, 0.55, 1.9, 32, 1, true),
        new THREE.MeshStandardMaterial({ color: 0xdfeef2, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
      );
      glass.position.set(3.9, 0.95, -2.4);
      dishGroup.add(glass);
      const water = new THREE.Mesh(
        new THREE.CylinderGeometry(0.57, 0.52, 1.2, 32),
        new THREE.MeshStandardMaterial({ color: 0xcfe6ee, roughness: 0.05, transparent: true, opacity: 0.55 })
      );
      water.position.set(3.9, 0.6, -2.4);
      dishGroup.add(water);

      onSliderChangeRef.current = (v) => {
        if (gravyMat.map) gravyMat.map.dispose();
        gravyMat.map = createGravyTexture(v);
        gravyMat.needsUpdate = true;
      };
    }

    // ─────────────────────────────────────────────────────────
    // SCENE 2: VEG SPRING ROLLS
    // ─────────────────────────────────────────────────────────
    function buildSpringRollsScene(fryAmt) {
      dist = 8.6;
      rotX = 0.5;

      const texMats = [];

      function friedTexture(hi, base, mid, dark) {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 256;
        const x = c.getContext('2d');
        const bg = x.createLinearGradient(0, 0, 0, 256);
        bg.addColorStop(0, hi);
        bg.addColorStop(0.5, base);
        bg.addColorStop(1, mid);
        x.fillStyle = bg;
        x.fillRect(0, 0, 256, 256);

        for (let i = 0; i < 22; i++) {
          const px = rnd(0, 256), py = rnd(0, 256), pr = rnd(18, 52);
          const g = x.createRadialGradient(px, py, 0, px, py, pr);
          g.addColorStop(0, dark);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          x.fillStyle = g;
          x.beginPath(); x.arc(px, py, pr, 0, 6.3); x.fill();
        }
        for (let i = 0; i < 34; i++) {
          const px = rnd(0, 256), py = rnd(0, 256), pr = rnd(6, 18);
          const g = x.createRadialGradient(px, py, 0, px, py, pr);
          g.addColorStop(0, 'rgba(255,225,158,0.75)');
          g.addColorStop(1, 'rgba(255,225,158,0)');
          x.fillStyle = g;
          x.beginPath(); x.arc(px, py, pr, 0, 6.3); x.fill();
        }
        for (let i = 0; i < 2000; i++) {
          x.fillStyle = 'rgba(122,58,12,' + rnd(0.03, 0.13) + ')';
          x.fillRect(rnd(0, 256), rnd(0, 256), rnd(1, 2.2), rnd(1, 2.2));
        }
        x.strokeStyle = 'rgba(150,84,26,0.3)';
        x.lineWidth = 2.5;
        x.beginPath(); x.moveTo(0, 64); x.bezierCurveTo(70, 54, 170, 78, 256, 66); x.stroke();
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      }

      function fillingTexture() {
        const c = document.createElement('canvas');
        c.width = 128; c.height = 128;
        const x = c.getContext('2d');
        x.fillStyle = '#e59a33';
        x.fillRect(0, 0, 128, 128);
        const palette = ['#f2b249', '#c67421', '#ffd47a', '#7fae3c', '#e8dcc0'];
        for (let i = 0; i < 130; i++) {
          x.fillStyle = palette[Math.floor(rnd(0, palette.length))];
          x.beginPath();
          x.ellipse(rnd(0, 128), rnd(0, 128), rnd(3, 12), rnd(2, 5), rnd(0, 3), 0, 6.3);
          x.fill();
        }
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      }

      const texA = friedTexture('#f6c266', '#e9a03c', '#cf7f24', 'rgba(150,74,16,0.5)');
      const texB = friedTexture('#fad07c', '#f0b25a', '#d68c2c', 'rgba(140,66,12,0.42)');
      const texC = friedTexture('#f0b355', '#dd8f2e', '#bd6d1a', 'rgba(120,54,10,0.58)');
      const fillTex = fillingTexture();

      function rollGeometry(len, rad) {
        const cr = 0.14, pts = [];
        pts.push(new THREE.Vector2(0, -len));
        for (let i = 0; i <= 6; i++) {
          const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2);
          pts.push(new THREE.Vector2((rad - cr) + Math.cos(a) * cr, (-len + cr) + Math.sin(a) * cr));
        }
        for (let i = 0; i <= 6; i++) {
          const a = (i / 6) * (Math.PI / 2);
          pts.push(new THREE.Vector2((rad - cr) + Math.cos(a) * cr, (len - cr) + Math.sin(a) * cr));
        }
        pts.push(new THREE.Vector2(0, len));
        const g = new THREE.LatheGeometry(pts, 36);
        g.rotateZ(Math.PI / 2);
        return g;
      }

      function roll(x, y, z, ry, rz, tex, len, cut) {
        const g = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({
          map: tex, bumpMap: tex, bumpScale: 0.03, roughness: 0.58, metalness: 0.04, color: 0xffffff
        });
        texMats.push(mat);
        const body = new THREE.Mesh(rollGeometry(len, 0.38), mat);
        body.castShadow = true;
        body.receiveShadow = true;
        g.add(body);
        if (cut) {
          const f = new THREE.Mesh(
            new THREE.CircleGeometry(0.32, 24),
            new THREE.MeshStandardMaterial({ map: fillTex, roughness: 0.8, side: THREE.DoubleSide })
          );
          f.rotation.y = Math.PI / 2;
          f.position.x = len + 0.01;
          g.add(f);
        }
        g.position.set(x, y, z);
        g.rotation.set(0, ry, rz);
        return g;
      }

      const board = new THREE.Mesh(
        new THREE.CylinderGeometry(3.9, 3.8, 0.3, 64),
        new THREE.MeshStandardMaterial({ color: 0x7d4b26, roughness: 0.68 })
      );
      board.position.y = -0.32;
      board.receiveShadow = true;
      dishGroup.add(board);

      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(3.0, 2.7, 0.24, 64),
        new THREE.MeshStandardMaterial({ color: 0xf5eee0, roughness: 0.45 })
      );
      plate.position.y = -0.05;
      plate.receiveShadow = true;
      plate.castShadow = true;
      dishGroup.add(plate);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(2.95, 0.14, 14, 64),
        new THREE.MeshStandardMaterial({ color: 0xe8dfcb, roughness: 0.5 })
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.06;
      rim.receiveShadow = true;
      dishGroup.add(rim);

      // Chili Dip Bowl
      const bowlGroup = new THREE.Group();
      const cupMat = new THREE.MeshStandardMaterial({ color: 0xfffaf1, roughness: 0.3, side: THREE.DoubleSide });
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.5, 0.42, 40, 1, true), cupMat);
      cup.castShadow = true;
      bowlGroup.add(cup);
      const cupBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 40), cupMat);
      cupBase.position.y = -0.2;
      bowlGroup.add(cupBase);

      const sauce = new THREE.Mesh(
        new THREE.CylinderGeometry(0.63, 0.58, 0.24, 40),
        new THREE.MeshStandardMaterial({ color: 0xd7261a, roughness: 0.14, metalness: 0.08 })
      );
      sauce.position.y = 0.05;
      bowlGroup.add(sauce);

      for (let s = 0; s < 16; s++) {
        const seed = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 6, 6),
          new THREE.MeshStandardMaterial({ color: 0xffdf94, roughness: 0.5 })
        );
        const sa = rnd(0, 6.3), sr = rnd(0, 0.55);
        seed.position.set(Math.cos(sa) * sr, 0.17, Math.sin(sa) * sr);
        bowlGroup.add(seed);
      }
      bowlGroup.position.set(-1.65, 0.28, 0.1);
      dishGroup.add(bowlGroup);

      // Nicely arranged spring rolls on the right half of the plate
      const layout = [
        // Bottom layer (y = 0.42)
        [0.35, 0.42, -0.85, 0.25, 0.00, texA, 1.05, false],
        [0.65, 0.42, -0.15, -0.15, 0.00, texB, 1.00, true],
        [0.45, 0.42, 0.65, 0.35, 0.00, texC, 1.05, false],
        [1.35, 0.42, -0.60, 1.35, 0.00, texA, 0.95, true],
        [1.40, 0.42, 0.30, 1.25, 0.00, texB, 1.00, false],
        // Top stacked layer (y = 0.82)
        [0.55, 0.82, -0.45, 0.35, 0.04, texB, 1.00, true],
        [0.65, 0.82, 0.25, -0.25, -0.04, texA, 0.95, false],
        [1.05, 0.82, -0.10, 1.10, 0.02, texC, 0.95, true]
      ];
      layout.forEach((r) => { dishGroup.add(roll(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7])); });

      // Scallion Rings resting on plate surface
      const greenDark = new THREE.MeshStandardMaterial({ color: 0x5a9e2d, roughness: 0.45 });
      const greenPale = new THREE.MeshStandardMaterial({ color: 0xcde8a8, roughness: 0.45 });
      for (let k = 0; k < 16; k++) {
        const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 8, 18), k % 3 === 0 ? greenPale : greenDark);
        ringMesh.rotation.x = Math.PI / 2 + rnd(-0.15, 0.15);
        ringMesh.rotation.z = rnd(0, 3.14);
        const sa = rnd(0, 6.28), sr = rnd(0.6, 2.5);
        ringMesh.position.set(Math.cos(sa) * sr, 0.08 + rnd(0, 0.02), Math.sin(sa) * sr);
        ringMesh.castShadow = true;
        dishGroup.add(ringMesh);
      }

      function applyFry(v) {
        const col = new THREE.Color().setHSL(0.085, 0.55 + v * 0.2, 0.74 - v * 0.28);
        texMats.forEach((m) => { m.color.copy(col); });
      }
      applyFry(fryAmt);

      onSliderChangeRef.current = (v) => {
        applyFry(v);
      };
    }

    // ─────────────────────────────────────────────────────────
    // SCENE 3: LACHHA PARATHA STACK
    // ─────────────────────────────────────────────────────────
    function buildParathaScene(charAmt) {
      dist = 12.0;
      rotX = 0.55;

      const table = new THREE.Mesh(
        new THREE.BoxGeometry(13, 0.4, 9),
        new THREE.MeshStandardMaterial({ color: 0xc3cbcc, roughness: 0.95 })
      );
      table.position.y = -0.22;
      table.receiveShadow = true;
      dishGroup.add(table);

      const platePts = [
        new THREE.Vector2(0.00, 0.06),
        new THREE.Vector2(2.10, 0.05),
        new THREE.Vector2(3.10, 0.22),
        new THREE.Vector2(3.62, 0.46),
        new THREE.Vector2(3.80, 0.54),
        new THREE.Vector2(3.92, 0.50),
        new THREE.Vector2(3.78, 0.30),
        new THREE.Vector2(3.00, 0.05),
        new THREE.Vector2(1.80, -0.04),
        new THREE.Vector2(0.00, -0.06)
      ];
      const plate = new THREE.Mesh(
        new THREE.LatheGeometry(platePts, 80),
        new THREE.MeshStandardMaterial({ color: 0xf6f6f4, roughness: 0.34, side: THREE.DoubleSide })
      );
      plate.castShadow = true;
      plate.receiveShadow = true;
      dishGroup.add(plate);

      function createParathaTexture(char) {
        const c = document.createElement('canvas');
        c.width = 512; c.height = 512;
        const x = c.getContext('2d');
        const base = new THREE.Color().setHSL(0.085, 0.46 + char * 0.12, 0.60 - char * 0.16);
        x.fillStyle = '#' + base.getHexString();
        x.fillRect(0, 0, 512, 512);
        const cx = 256, cy = 256;

        for (let i = 0; i < 16; i++) {
          const rad = 18 + i * 14.5 + rnd(-3, 3);
          x.strokeStyle = 'rgba(96,52,14,' + (0.16 + char * 0.22) + ')';
          x.lineWidth = rnd(2, 4.5);
          x.beginPath();
          for (let k = 0; k <= 60; k++) {
            const a = (k / 60) * 6.283;
            const rr = rad * (1 + Math.sin(a * 3 + i) * 0.02 + Math.sin(a * 7 + i * 2) * 0.012);
            const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
            if (k === 0) x.moveTo(px, py); else x.lineTo(px, py);
          }
          x.stroke();
          x.strokeStyle = 'rgba(255,224,168,0.22)';
          x.lineWidth = 1.6;
          x.stroke();
        }
        for (let i = 0; i < 150; i++) {
          const sa = rnd(0, 6.283), sr = rnd(15, 245);
          const bx = cx + Math.cos(sa) * sr, by = cy + Math.sin(sa) * sr;
          const size = rnd(4, 17);
          const g = x.createRadialGradient(bx, by, 0, bx, by, size);
          g.addColorStop(0, 'rgba(52,26,6,' + (0.35 + char * 0.55) + ')');
          g.addColorStop(0.6, 'rgba(96,50,14,' + (0.2 + char * 0.35) + ')');
          g.addColorStop(1, 'rgba(96,50,14,0)');
          x.fillStyle = g;
          x.beginPath(); x.arc(bx, by, size, 0, 6.3); x.fill();
        }
        for (let i = 0; i < 2200; i++) {
          x.fillStyle = 'rgba(70,38,10,' + rnd(0.03, 0.12) + ')';
          x.fillRect(rnd(0, 512), rnd(0, 512), rnd(1, 2.5), rnd(1, 2.5));
        }
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      }

      function parathaGeometry(radius, phase) {
        const g = new THREE.CylinderGeometry(radius, radius * 0.99, 0.14, 110, 2);
        const pos = g.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i);
          const r = Math.sqrt(v.x * v.x + v.z * v.z);
          if (r > 0.001) {
            const a = Math.atan2(v.z, v.x);
            const wob = 1 + Math.sin(a * 6 + phase) * 0.035 + Math.sin(a * 11 + phase * 2) * 0.018;
            v.x *= wob; v.z *= wob;
          }
          if (v.y > 0.01) v.y += Math.sin(r * 7 + phase) * 0.018 + rnd(-0.005, 0.005);
          if (v.y < -0.01) v.y -= Math.sin(r * 5 + phase) * 0.01;
          pos.setXYZ(i, v.x, v.y, v.z);
        }
        g.computeVertexNormals();
        return g;
      }

      const pTex = createParathaTexture(charAmt);
      const parathaMat = new THREE.MeshStandardMaterial({
        map: pTex, bumpMap: pTex, bumpScale: 0.055, roughness: 0.86, metalness: 0.0
      });

      const stack = [
        [2.62, 0.10, 0.0, -0.05, 0.06],
        [2.58, 0.24, 0.9, 0.08, -0.04],
        [2.60, 0.38, 1.9, -0.03, -0.09],
        [2.55, 0.52, 3.0, 0.06, 0.08],
        [2.58, 0.66, 4.1, -0.07, 0.02],
        [2.50, 0.80, 5.2, 0.02, -0.03]
      ];
      stack.forEach((s, idx) => {
        const m = new THREE.Mesh(parathaGeometry(s[0], idx * 1.7), parathaMat);
        m.position.set(s[3], s[1], s[4]);
        m.rotation.y = s[2];
        m.rotation.x = rnd(-0.015, 0.015);
        m.castShadow = true;
        m.receiveShadow = true;
        dishGroup.add(m);
      });

      // Butter Cube
      const butter = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.38, 0.6),
        new THREE.MeshStandardMaterial({ color: 0xf7ecab, roughness: 0.35 })
      );
      butter.position.set(0.05, 1.06, 0.05);
      butter.rotation.y = 0.35;
      butter.castShadow = true;
      dishGroup.add(butter);

      // Green Chilies
      const chilliMat = new THREE.MeshStandardMaterial({ color: 0x3f8c22, roughness: 0.35 });
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a6b26, roughness: 0.6 });
      [[5.0, -2.1, 0.5], [5.4, -1.5, 0.9]].forEach((c) => {
        const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.14, 1.5, 12), chilliMat);
        ch.rotation.z = Math.PI / 2;
        ch.rotation.y = c[2];
        ch.position.set(c[0], 0.09, c[1]);
        ch.castShadow = true;
        dishGroup.add(ch);
        const st = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.32, 8), stemMat);
        st.rotation.z = Math.PI / 2;
        st.rotation.y = c[2];
        st.position.set(c[0] - Math.cos(c[2]) * 0.88, 0.11, c[1] + Math.sin(c[2]) * 0.88);
        dishGroup.add(st);
      });

      // Side Chutney Bowls
      function sideBowl(px, pz, r, fillColor) {
        const pts = [
          new THREE.Vector2(0, 0.05),
          new THREE.Vector2(r * 0.55, 0.03),
          new THREE.Vector2(r * 0.9, 0.3),
          new THREE.Vector2(r, 0.62),
          new THREE.Vector2(r * 1.06, 0.66),
          new THREE.Vector2(r * 1.1, 0.4),
          new THREE.Vector2(r * 0.98, 0.05),
          new THREE.Vector2(0, -0.02)
        ];
        const b = new THREE.Mesh(
          new THREE.LatheGeometry(pts, 48),
          new THREE.MeshStandardMaterial({ color: 0xf7f7f5, roughness: 0.3, side: THREE.DoubleSide })
        );
        b.position.set(px, 0, pz);
        b.castShadow = true;
        b.receiveShadow = true;
        dishGroup.add(b);

        const f = new THREE.Mesh(
          new THREE.CylinderGeometry(r * 0.92, r * 0.7, 0.4, 40),
          new THREE.MeshStandardMaterial({ color: fillColor, roughness: 0.4 })
        );
        f.position.set(px, 0.4, pz);
        dishGroup.add(f);
      }
      sideBowl(-2.4, -4.4, 1.5, 0xd4661d);
      sideBowl(2.9, -4.6, 0.95, 0xb0501a);

      onSliderChangeRef.current = (v) => {
        const nt = createParathaTexture(v);
        if (parathaMat.map) parathaMat.map.dispose();
        parathaMat.map = nt;
        parathaMat.bumpMap = nt;
        parathaMat.needsUpdate = true;
      };
    }

    // ─────────────────────────────────────────────────────────
    // SCENE 4: FRESH LIME SODA
    // ─────────────────────────────────────────────────────────
    function buildLimeSodaScene(juiceAmt) {
      dist = 12.0;
      rotX = 0.35;

      const slate = new THREE.Mesh(
        new THREE.BoxGeometry(16, 0.4, 11),
        new THREE.MeshStandardMaterial({ color: 0x131313, roughness: 0.55, metalness: 0.15 })
      );
      slate.position.y = -0.21;
      slate.receiveShadow = true;
      dishGroup.add(slate);

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xf2fbff, roughness: 0.04, metalness: 0.0,
        transparent: true, opacity: 0.26, side: THREE.DoubleSide,
        clearcoat: 1.0, clearcoatRoughness: 0.03
      });
      const glassWall = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 0.84, 3.3, 56, 1, true), glassMat);
      glassWall.position.y = 1.68;
      glassWall.castShadow = true;
      dishGroup.add(glassWall);

      const glassBase = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.82, 0.22, 56), glassMat);
      glassBase.position.y = 0.11;
      glassBase.receiveShadow = true;
      dishGroup.add(glassBase);

      const glassRim = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.035, 10, 56), glassMat);
      glassRim.rotation.x = Math.PI / 2;
      glassRim.position.y = 3.32;
      dishGroup.add(glassRim);

      const juiceMat = new THREE.MeshPhysicalMaterial({
        color: 0xd6e87a, roughness: 0.06, metalness: 0.0,
        transparent: true, opacity: 0.82, clearcoat: 0.8
      });
      const juice = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 0.83, 2.75, 56), juiceMat);
      juice.position.y = 1.6;
      dishGroup.add(juice);

      // Bubbles
      const bubbleMat = new THREE.MeshStandardMaterial({
        color: 0xf6ffe0, roughness: 0.1, transparent: true, opacity: 0.6
      });
      for (let b = 0; b < 90; b++) {
        const bs = rnd(0.025, 0.06);
        const bub = new THREE.Mesh(new THREE.SphereGeometry(bs, 8, 6), bubbleMat);
        const ba = rnd(0, 6.283), br = Math.sqrt(Math.random()) * 0.86;
        bub.position.set(Math.cos(ba) * br, rnd(0.35, 2.85), Math.sin(ba) * br);
        dishGroup.add(bub);
      }

      // Ice chunks
      const iceMat = new THREE.MeshPhysicalMaterial({
        color: 0xeaf6ff, roughness: 0.12, metalness: 0.0,
        transparent: true, opacity: 0.62, clearcoat: 1.0, clearcoatRoughness: 0.05
      });
      for (let ic = 0; ic < 34; ic++) {
        const chunk = new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(0.14, 0.26), 0), iceMat);
        const ia = rnd(0, 6.283), ir = Math.sqrt(Math.random()) * 0.82;
        chunk.position.set(Math.cos(ia) * ir, rnd(2.35, 3.15), Math.sin(ia) * ir);
        chunk.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
        chunk.scale.set(rnd(0.8, 1.3), rnd(0.7, 1.2), rnd(0.8, 1.3));
        dishGroup.add(chunk);
      }

      // Lime slice texture
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const x = c.getContext('2d');
      x.fillStyle = '#4e8f1d';
      x.beginPath(); x.arc(128, 128, 126, 0, 6.3); x.fill();
      x.fillStyle = '#e8f2c2';
      x.beginPath(); x.arc(128, 128, 112, 0, 6.3); x.fill();
      x.fillStyle = '#cfe58a';
      x.beginPath(); x.arc(128, 128, 104, 0, 6.3); x.fill();
      for (let s = 0; s < 10; s++) {
        const a0 = (s / 10) * 6.283 + 0.05, a1 = a0 + 0.55;
        const grad = x.createRadialGradient(128, 128, 8, 128, 128, 104);
        grad.addColorStop(0, '#dff09c');
        grad.addColorStop(1, '#b9d95f');
        x.fillStyle = grad;
        x.beginPath();
        x.moveTo(128, 128);
        x.arc(128, 128, 100, a0, a1);
        x.closePath();
        x.fill();
        x.strokeStyle = 'rgba(250,255,235,0.9)';
        x.lineWidth = 3.5;
        x.stroke();
      }
      x.fillStyle = '#f2f8dc';
      x.beginPath(); x.arc(128, 128, 9, 0, 6.3); x.fill();
      const limeTex = new THREE.CanvasTexture(c);
      limeTex.colorSpace = THREE.SRGBColorSpace;

      const sliceMat = new THREE.MeshStandardMaterial({
        map: limeTex, roughness: 0.28, metalness: 0.02, transparent: true, opacity: 0.96, side: THREE.DoubleSide
      });
      const sliceGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.06, 40);

      function addSlice(px, py, pz, rx, rz, ry, s) {
        const m = new THREE.Mesh(sliceGeo, sliceMat);
        m.position.set(px, py, pz);
        m.rotation.set(rx, ry || 0, rz);
        if (s) m.scale.set(s, 1, s);
        m.castShadow = true;
        dishGroup.add(m);
      }
      addSlice(0.32, 2.55, 0.32, 1.35, 0.35, 0.5);
      addSlice(0.05, 1.85, 0.55, 1.5, -0.2, 0.2);
      addSlice(-0.45, 1.25, 0.35, 1.42, 0.5, -0.4, 0.9);
      addSlice(2.55, 0.06, 1.85, Math.PI / 2, 0, 0.3);
      addSlice(3.25, 0.06, 1.55, Math.PI / 2, 0, -0.2);
      addSlice(3.9, 0.07, 1.2, Math.PI / 2, 0, 0.6);
      addSlice(-2.5, 0.06, 1.6, Math.PI / 2, 0, 0.15);

      function wholeLime(px, pz, r) {
        const g = new THREE.SphereGeometry(r, 40, 28);
        const mat = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.02, color: 0x5a9e22 });
        const m = new THREE.Mesh(g, mat);
        m.position.set(px, r * 0.94, pz);
        m.castShadow = true;
        m.receiveShadow = true;
        dishGroup.add(m);
      }
      wholeLime(-2.9, -0.4, 0.72);
      wholeLime(-3.5, 1.1, 0.66);

      // Mint Leaves
      function mintLeaf(px, py, pz, ry, s) {
        const g = new THREE.SphereGeometry(0.28, 16, 12);
        const mat = new THREE.MeshStandardMaterial({ roughness: 0.4, color: 0x3d821e });
        const m = new THREE.Mesh(g, mat);
        m.position.set(px, py, pz);
        m.rotation.set(0, ry, 0);
        if (s) m.scale.set(s * 1.3, s * 0.2, s * 0.8);
        m.castShadow = true;
        dishGroup.add(m);
      }
      mintLeaf(0.15, 3.35, -0.1, 0.6, 1.0);
      mintLeaf(-0.3, 3.28, 0.25, 2.1, 0.85);
      mintLeaf(0.45, 3.3, 0.3, 4.0, 0.9);
      mintLeaf(2.2, 0.06, 3.0, 0.4, 1.1);
      mintLeaf(3.6, 0.06, 2.6, 2.4, 1.0);

      function applyJuice(v) {
        juiceMat.color.setHSL(0.19 - v * 0.02, 0.25 + v * 0.55, 0.86 - v * 0.16);
        juiceMat.opacity = 0.6 + v * 0.3;
      }
      applyJuice(juiceAmt);

      onSliderChangeRef.current = (v) => {
        applyJuice(v);
      };
    }

    // Switch active dish
    function loadDishScene(dishId, val) {
      // Clear previous dish meshes
      while (dishGroup.children.length > 0) {
        const obj = dishGroup.children[0];
        dishGroup.remove(obj);
      }

      if (dishId === 'paneer') {
        buildPaneerScene(val / 100);
      } else if (dishId === 'spring-rolls') {
        buildSpringRollsScene(val / 100);
      } else if (dishId === 'paratha') {
        buildParathaScene(val / 100);
      } else if (dishId === 'lime-soda') {
        buildLimeSodaScene(val / 100);
      }
    }

    loadDishScene(selectedDish, sliderVal);

    // Pointer Events for Dragging / Orbiting
    const onPointerDown = (e) => {
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      stage.style.cursor = 'grabbing';
    };

    const onPointerUp = () => {
      dragging = false;
      stage.style.cursor = 'grab';
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      rotY += (e.clientX - lx) * 0.008;
      rotX += (e.clientY - ly) * 0.005;
      rotX = Math.max(0.08, Math.min(1.2, rotX));
      lx = e.clientX;
      ly = e.clientY;
    };

    const onWheel = (e) => {
      e.preventDefault();
      dist = Math.max(6.5, Math.min(18, dist + e.deltaY * 0.008));
    };

    stage.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('wheel', onWheel, { passive: false });

    // Resize
    const onResize = () => {
      if (!stage || !cam || !renderer) return;
      const w = stage.clientWidth || 600;
      const h = stage.clientHeight || 420;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId;
    function loop() {
      animId = requestAnimationFrame(loop);
      if (autoRotateRef.current && !dragging) {
        rotY += 0.004;
      }
      root.rotation.y = rotY;

      // Adjust lookAt based on dish height
      const lookY = currentDishRef.current === 'lime-soda' ? 1.5 : (currentDishRef.current === 'paratha' ? 0.7 : 0.6);
      cam.position.set(0, lookY + Math.sin(rotX) * dist * 0.75, Math.cos(rotX) * dist);
      cam.lookAt(0, lookY, 0);

      renderer.render(scene, cam);
    }
    loop();

    // Store load function in ref for switching without full scene recreation
    stage._loadDishScene = loadDishScene;

    return () => {
      cancelAnimationFrame(animId);
      stage.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && stage.contains(renderer.domElement)) {
        stage.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update dish when selectedDish changes
  useEffect(() => {
    if (mountRef.current && mountRef.current._loadDishScene) {
      const preset = DISH_PRESETS.find(d => d.id === selectedDish);
      mountRef.current._loadDishScene(selectedDish, preset ? preset.defaultSlider : 50);
    }
  }, [selectedDish]);

  const currentPreset = DISH_PRESETS.find(d => d.id === selectedDish) || DISH_PRESETS[0];

  return (
    <div className="w-full flex flex-col rounded-3xl overflow-hidden bg-gradient-to-b from-white/80 via-white/50 to-orange-50/50 dark:from-slate-900/90 dark:via-gray-950/90 dark:to-gray-950/90 border border-orange-200/50 dark:border-white/10 shadow-2xl backdrop-blur-xl p-4 sm:p-5 transition-all">
      {/* Top Header: Dish Tabs Switcher */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-gray-200/60 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Interactive 3D WebGL Engine
          </span>
        </div>

        {/* Dish Switcher Buttons */}
        <div 
          className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-white/5 overflow-x-auto max-w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DISH_PRESETS.map((dish) => (
            <button
              key={dish.id}
              type="button"
              onClick={() => setSelectedDish(dish.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedDish === dish.id
                  ? 'bg-gradient-to-r from-primary-500 to-amber-500 text-white shadow-md shadow-primary-500/25 scale-[1.03]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
              }`}
            >
              <span>{dish.icon}</span>
              <span className="hidden sm:inline">{dish.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center 3D Stage Viewport */}
      <div className="relative w-full h-[360px] sm:h-[400px] mt-3 rounded-2xl overflow-hidden bg-gradient-to-b from-orange-50/30 to-amber-50/20 dark:from-black/40 dark:to-black/60 border border-orange-100 dark:border-white/5 shadow-inner">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          title="Drag to rotate 360° • Scroll to zoom"
        />

        {/* Floating Dish Info Badge */}
        <div className="absolute top-3 left-3 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-lg pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentPreset.icon}</span>
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                {currentPreset.name}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {currentPreset.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Gesture Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 dark:bg-black/70 backdrop-blur-md text-white text-[11px] px-3.5 py-1 rounded-full border border-white/15 opacity-90 shadow-md">
          Drag to rotate 360° • Scroll to zoom
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-gray-200/60 dark:border-white/10 flex-wrap">
        {/* Rotation Toggle Button */}
        <button
          type="button"
          onClick={() => setAutoRotate(prev => !prev)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
            autoRotate
              ? 'bg-primary-500 text-white shadow-primary-500/20 hover:bg-primary-600'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{autoRotate ? 'Pause Rotation' : 'Resume Rotation'}</span>
        </button>

        {/* Real-time Ingredient / Finish Slider */}
        <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/60 px-4 py-1.5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-xs">
          <Sliders className="w-3.5 h-3.5 text-primary-500" />
          <label htmlFor="culinary-slider" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {currentPreset.sliderLabel}:
          </label>
          <input
            id="culinary-slider"
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-28 sm:w-36 accent-primary-500 cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 min-w-[32px]">
            {sliderVal}%
          </span>
        </div>

        {/* 3D Tech Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-gray-200/60 dark:border-white/5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Real-time PCF Soft Shadows & Shaders</span>
        </div>
      </div>
    </div>
  );
}
