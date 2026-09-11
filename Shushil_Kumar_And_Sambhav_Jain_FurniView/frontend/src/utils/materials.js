import * as THREE from 'three';

// Cache generated canvas textures so they are created only once
const textureCache = new Map();

/**
 * Procedural texture generator using HTML5 Canvas.
 * Generates realistic bump/normal/roughness maps without external image downloads.
 */
export function createProceduralTexture(type, size = 512) {
  if (textureCache.has(type)) {
    return textureCache.get(type);
  }

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  switch (type) {
    case 'wood': {
      // Wood grain pattern: rings and linear flow with natural noise
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, size, size);

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x += 4) {
          const distFromCenter = Math.sqrt((x - size / 2) ** 2 + ((y - size / 2) * 0.2) ** 2);
          const ring = Math.sin(distFromCenter * 0.08 + Math.sin(y * 0.05) * 2.5);
          const noise = (Math.random() - 0.5) * 25;
          const val = Math.floor(128 + ring * 45 + noise);
          ctx.fillStyle = `rgb(${val},${val},${val})`;
          ctx.fillRect(x, y, 4, 1);
        }
      }
      break;
    }

    case 'leather': {
      // Pebble grain leather bump texture
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, size, size);

      // Draw irregular pebble cells
      const numCells = 1200;
      for (let i = 0; i < numCells; i++) {
        const cx = Math.random() * size;
        const cy = Math.random() * size;
        const r = 3 + Math.random() * 6;
        const shade = 140 + Math.floor(Math.random() * 60);

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgb(70,70,70)';
        ctx.stroke();
      }
      break;
    }

    case 'fabric': {
      // Cross-weave cloth fabric pattern
      ctx.fillStyle = '#909090';
      ctx.fillRect(0, 0, size, size);

      const thread = 4;
      for (let y = 0; y < size; y += thread) {
        for (let x = 0; x < size; x += thread) {
          const isWeft = ((x / thread) % 2 === 0) ^ ((y / thread) % 2 === 0);
          const val = isWeft ? 160 + (x % thread) * 15 : 90 + (y % thread) * 15;
          ctx.fillStyle = `rgb(${val},${val},${val})`;
          ctx.fillRect(x, y, thread, thread);
        }
      }
      break;
    }

    case 'velvet': {
      // Soft micro-fiber nap texture with subtle high frequency noise
      ctx.fillStyle = '#858585';
      ctx.fillRect(0, 0, size, size);

      const imgData = ctx.getImageData(0, 0, size, size);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const n = (Math.random() - 0.5) * 35;
        const val = Math.min(255, Math.max(0, 133 + n));
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
      break;
    }

    case 'metal': {
      // Brushed metal horizontal directional scratches
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, size, size);

      for (let y = 0; y < size; y++) {
        const shade = 100 + Math.floor(Math.random() * 80);
        ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
        ctx.fillRect(0, y, size, 1);
      }
      break;
    }

    case 'marble': {
      // Polished marble with elegant organic veins
      ctx.fillStyle = '#f2f2f5';
      ctx.fillRect(0, 0, size, size);

      ctx.lineWidth = 2;
      for (let vein = 0; vein < 7; vein++) {
        ctx.beginPath();
        let vx = Math.random() * size;
        let vy = 0;
        ctx.moveTo(vx, vy);
        while (vy < size) {
          vx += (Math.random() - 0.48) * 20;
          vy += Math.random() * 25 + 10;
          ctx.lineTo(vx, vy);
        }
        ctx.strokeStyle = `rgba(140, 145, 160, ${0.25 + Math.random() * 0.35})`;
        ctx.stroke();
      }
      break;
    }

    default:
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(type === 'wood' ? 1.5 : type === 'fabric' ? 8 : 4, type === 'wood' ? 1.5 : type === 'fabric' ? 8 : 4);
  textureCache.set(type, texture);
  return texture;
}

/**
 * Returns PBR material parameters based on material type and custom color
 */
export function getMaterialProperties(materialType, baseColor = '#808080', customOverrides = {}) {
  const color = new THREE.Color(baseColor);

  let bumpMap = null;
  let bumpScale = 0.05;
  let roughness = 0.7;
  let metalness = 0.1;
  let clearcoat = 0.0;
  let clearcoatRoughness = 0.1;

  // Browser check for canvas support
  const hasCanvas = typeof document !== 'undefined';

  switch (materialType) {
    case 'Wood':
      roughness = 0.65;
      metalness = 0.04;
      clearcoat = 0.1;
      bumpScale = 0.03;
      if (hasCanvas) bumpMap = createProceduralTexture('wood');
      break;

    case 'Leather':
      roughness = 0.42;
      metalness = 0.12;
      clearcoat = 0.25;
      bumpScale = 0.04;
      if (hasCanvas) bumpMap = createProceduralTexture('leather');
      break;

    case 'Fabric':
      roughness = 0.95;
      metalness = 0.0;
      clearcoat = 0.0;
      bumpScale = 0.06;
      if (hasCanvas) bumpMap = createProceduralTexture('fabric');
      break;

    case 'Velvet':
      roughness = 0.88;
      metalness = 0.05;
      clearcoat = 0.0;
      bumpScale = 0.04;
      if (hasCanvas) bumpMap = createProceduralTexture('velvet');
      break;

    case 'Metal':
      roughness = 0.22;
      metalness = 0.88;
      clearcoat = 0.35;
      bumpScale = 0.02;
      if (hasCanvas) bumpMap = createProceduralTexture('metal');
      break;

    default:
      roughness = 0.7;
      metalness = 0.1;
  }

  return {
    color,
    roughness: customOverrides.roughness ?? roughness,
    metalness: customOverrides.metalness ?? metalness,
    clearcoat,
    clearcoatRoughness,
    bumpMap,
    bumpScale,
    ...customOverrides,
  };
}
