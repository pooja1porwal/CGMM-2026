import * as THREE from 'three';
import { createStoreBase, createDisplayCounter } from './storeBuilder.js';
import { createBook, createNotebook, createPenSet, createDiary, createPencilBox } from '../products/productManager.js';

export function createBookStore() {
  const store = createStoreBase({
    width: 20, depth: 25, height: 10,
    wallColor: 0xf4f1ea, floorColor: 0x8b5a2b,
    signColor: '#2b1b17', signText: 'BOOKS & MORE'
  });
  
  const shelf1 = createDisplayCounter(5, 4, 1, 0x5c4033); shelf1.position.set(-6, 2, -10); store.add(shelf1);
  const shelf2 = createDisplayCounter(5, 4, 1, 0x5c4033); shelf2.position.set(0, 2, -10); store.add(shelf2);
  const shelf3 = createDisplayCounter(5, 4, 1, 0x5c4033); shelf3.position.set(6, 2, -10); store.add(shelf3);
  
  const table = createDisplayCounter(6, 1, 3, 0xd2b48c); table.position.set(0, 0.5, 0); store.add(table);
  
  const b1 = createBook(); b1.position.set(-6, 4.1, -10); b1.rotation.y = Math.PI/4; store.add(b1);
  const n1 = createNotebook(); n1.position.set(0, 4.1, -10); store.add(n1);
  const p1 = createPenSet(); p1.position.set(6, 4.1, -10); store.add(p1);
  const d1 = createDiary(); d1.position.set(-2, 1.1, 0); store.add(d1);
  const pb1 = createPencilBox(); pb1.position.set(2, 1.1, 0); store.add(pb1);
  
  return store;
}
