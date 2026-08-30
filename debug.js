
import * as THREE from 'three';
import { createMall } from './src/scene/mall.js';
const scene = new THREE.Scene();
try {
  createMall(scene);
  console.log('MALL CREATED SUCCESSFULLY');
} catch (e) {
  console.error('ERROR CREATING MALL:', e);
}

