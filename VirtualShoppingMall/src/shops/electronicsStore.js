import * as THREE from 'three';
import { createStoreBase, createDisplayCounter } from './storeBuilder.js';
import { createLaptop, createSmartphone, createHeadphones } from '../products/productManager.js';

export function createElectronicsStore() {
  const store = createStoreBase({
    width: 20, depth: 25, height: 10,
    wallColor: 0x111111, floorColor: 0x222222,
    signColor: '#00E5FF', signText: 'ELECTRONICS'
  });

  // Modern sleek tables
  const table1 = createDisplayCounter(8, 0.9, 3, 0xffffff);
  table1.position.set(0, 0.45, -2);
  store.add(table1);

  const table2 = createDisplayCounter(6, 0.9, 2, 0xffffff);
  table2.position.set(-5, 0.45, 6);
  store.add(table2);

  const table3 = createDisplayCounter(6, 0.9, 2, 0xffffff);
  table3.position.set(5, 0.45, 6);
  store.add(table3);

  // Products
  const lap1 = createLaptop(); lap1.position.set(-2, 0.95, -2); store.add(lap1);
  const lap2 = createLaptop(); lap2.position.set(2, 0.95, -2); store.add(lap2);

  const phone1 = createSmartphone(); phone1.position.set(-5, 0.95, 6); phone1.rotation.x = -Math.PI/4; store.add(phone1);
  const phone2 = createSmartphone(); phone2.position.set(-6, 0.95, 6); phone2.rotation.x = -Math.PI/4; store.add(phone2);
  const phone3 = createSmartphone(); phone3.position.set(-4, 0.95, 6); phone3.rotation.x = -Math.PI/4; store.add(phone3);

  const head1 = createHeadphones(); head1.position.set(4, 1.2, 6); store.add(head1);
  const head2 = createHeadphones(); head2.position.set(6, 1.2, 6); store.add(head2);

  return store;
}

