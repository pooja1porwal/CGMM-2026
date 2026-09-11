import * as THREE from 'three';
import { createStoreBase, createDisplayCounter } from './storeBuilder.js';
import { createFootball, createBasketball, createDumbbell } from '../products/productManager.js';

export function createSportsStore() {
  const store = createStoreBase({
    width: 20, depth: 25, height: 10,
    wallColor: 0xeef5ff, floorColor: 0xffffff,
    signColor: '#ff5722', signText: 'SPORTS'
  });

  // Display podiums
  const p1 = createDisplayCounter(2, 1, 2, 0x444444); p1.position.set(-5, 0.5, -3); store.add(p1);
  const p2 = createDisplayCounter(2, 1.5, 2, 0x444444); p2.position.set(0, 0.75, -5); store.add(p2);
  const p3 = createDisplayCounter(2, 1, 2, 0x444444); p3.position.set(5, 0.5, -3); store.add(p3);

  // Rack for dumbbells
  const rack = createDisplayCounter(6, 0.5, 1.5, 0x222222);
  rack.position.set(0, 0.25, 5);
  store.add(rack);

  // Products
  const fball = createFootball(); fball.position.set(-5, 1.4, -3); store.add(fball);
  const bball = createBasketball(); bball.position.set(0, 1.9, -5); store.add(bball);
  
  const d1 = createDumbbell(); d1.position.set(-1.5, 0.7, 5); store.add(d1);
  const d2 = createDumbbell(); d2.position.set(0, 0.7, 5); store.add(d2);
  const d3 = createDumbbell(); d3.position.set(1.5, 0.7, 5); store.add(d3);

  return store;
}

