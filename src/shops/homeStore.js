import * as THREE from 'three';
import { createStoreBase, createDisplayCounter } from './storeBuilder.js';
import { createChair, createTableLamp, createTable } from '../products/productManager.js';

export function createHomeStore() {
  const store = createStoreBase({
    width: 20, depth: 25, height: 10,
    wallColor: 0xfffcf5, floorColor: 0xdab894, // wood tone floor
    signColor: '#607d8b', signText: 'HOME LIVING'
  });

  // Rugs (Planes slightly above floor)
  const rugMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 1.0 });
  const rug1 = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), rugMat);
  rug1.rotation.x = -Math.PI/2; rug1.position.set(-4, 0.08, -2);
  store.add(rug1);

  const rug2 = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), rugMat);
  rug2.rotation.x = -Math.PI/2; rug2.position.set(5, 0.08, 4);
  store.add(rug2);

  // Pedestal for lamp
  const ped = createDisplayCounter(1.5, 1, 1.5, 0xffffff);
  ped.position.set(5, 0.5, -4);
  store.add(ped);

  // Products
  const table = createTable(); table.position.set(-4, 0, -2); store.add(table);
  const chair1 = createChair(); chair1.position.set(-4, 0, 0); store.add(chair1);
  const chair2 = createChair(); chair2.position.set(-4, 0, -4); chair2.rotation.y = Math.PI; store.add(chair2);

  const lamp = createTableLamp(); lamp.position.set(5, 1.0, -4); store.add(lamp);

  const chair3 = createChair(); chair3.position.set(5, 0, 4); store.add(chair3);

  return store;
}

