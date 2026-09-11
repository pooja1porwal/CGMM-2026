import * as THREE from 'three';
import { createStoreBase, createDisplayCounter } from './storeBuilder.js';
import { createBurger, createPizza, createCoffee, createIceCream, createSandwich } from '../products/productManager.js';

export function createFoodCourt() {
  const store = createStoreBase({
    width: 25, depth: 20, height: 10,
    wallColor: 0xfff0e6, floorColor: 0xffffff,
    signColor: '#ff9900', signText: 'FOOD COURT'
  });
  
  const c1 = createDisplayCounter(4, 1.2, 1, 0x333333); c1.position.set(-6, 0.6, -2); store.add(c1);
  const c2 = createDisplayCounter(4, 1.2, 1, 0x333333); c2.position.set(0, 0.6, -2); store.add(c2);
  const c3 = createDisplayCounter(4, 1.2, 1, 0x333333); c3.position.set(6, 0.6, -2); store.add(c3);
  
  function createTable(x, z) {
    const tableGroup = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16), new THREE.MeshStandardMaterial({color: 0xdddddd}));
    top.position.y = 1; tableGroup.add(top);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), new THREE.MeshStandardMaterial({color: 0x222222}));
    leg.position.y = 0.5; tableGroup.add(leg);
    tableGroup.position.set(x, 0, z);
    return tableGroup;
  }
  
  store.add(createTable(-5, 5));
  store.add(createTable(5, 5));
  
  const b = createBurger(); b.position.set(-6, 1.3, -2); store.add(b);
  const p = createPizza(); p.position.set(-2, 1.3, -2); store.add(p);
  const c = createCoffee(); c.position.set(2, 1.3, -2); store.add(c);
  const i = createIceCream(); i.position.set(6, 1.3, -2); store.add(i);
  const s = createSandwich(); s.position.set(4, 1.1, 5); store.add(s);
  
  return store;
}
