import * as THREE from 'three';
import { createStoreBase, createDisplayCounter, createClothingRack } from './storeBuilder.js';
import { createJacket, createSneakers, createTShirt } from '../products/productManager.js';

export function createFashionStore() {
  const store = createStoreBase({
    width: 20, depth: 25, height: 10,
    wallColor: 0xffffff, floorColor: 0xf5f5f5,
    signColor: '#111111', signText: 'FASHION'
  });

  // Furniture
  const rack1 = createClothingRack(6);
  rack1.position.set(-5, 0, -5);
  store.add(rack1);

  const rack2 = createClothingRack(6);
  rack2.position.set(5, 0, -5);
  store.add(rack2);

  const counter = createDisplayCounter(4, 1, 3, 0xffffff);
  counter.position.set(0, 0.5, 5);
  store.add(counter);

  // Products
  const jacket1 = createJacket(); jacket1.position.set(-6.5, 3.2, -5); store.add(jacket1);
  const jacket2 = createJacket(); jacket2.position.set(-5, 3.2, -5); store.add(jacket2);
  const jacket3 = createJacket(); jacket3.position.set(-3.5, 3.2, -5); store.add(jacket3);

  const shirt1 = createTShirt(); shirt1.position.set(3.5, 3.2, -5); store.add(shirt1);
  const shirt2 = createTShirt(); shirt2.position.set(5, 3.2, -5); store.add(shirt2);
  const shirt3 = createTShirt(); shirt3.position.set(6.5, 3.2, -5); store.add(shirt3);

  const sneakers1 = createSneakers(); sneakers1.position.set(-1, 1.2, 5); store.add(sneakers1);
  const sneakers2 = createSneakers(); sneakers2.position.set(1, 1.2, 5); store.add(sneakers2);

  return store;
}

