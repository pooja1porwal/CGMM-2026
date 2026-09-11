import * as THREE from 'three';
import { createStoreBase, createDisplayCounter } from './storeBuilder.js';
import { createPerfume, createLipstick, createFaceCream, createShampoo, createLotion } from '../products/productManager.js';

export function createBeautyStore() {
  const store = createStoreBase({
    width: 20, depth: 25, height: 10,
    wallColor: 0xfff0f5, floorColor: 0xffffff,
    signColor: '#ff1493', signText: 'BEAUTY'
  });
  
  const c1 = createDisplayCounter(5, 1, 1.5, 0xeeeeee); c1.position.set(-5, 0.5, 0); store.add(c1);
  const c2 = createDisplayCounter(5, 1, 1.5, 0xeeeeee); c2.position.set(5, 0.5, 0); store.add(c2);
  const c3 = createDisplayCounter(10, 1.5, 1, 0xffcccc); c3.position.set(0, 0.75, -10); store.add(c3);
  
  const p1 = createPerfume(); p1.position.set(-5, 1.1, 0); store.add(p1);
  const l1 = createLipstick(); l1.position.set(-4, 1.1, 0); store.add(l1);
  const f1 = createFaceCream(); f1.position.set(5, 1.1, 0); store.add(f1);
  const s1 = createShampoo(); s1.position.set(-2, 1.35, -10); store.add(s1);
  const lot = createLotion(); lot.position.set(2, 1.35, -10); store.add(lot);
  
  return store;
}
