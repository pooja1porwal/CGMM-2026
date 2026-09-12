import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html lang="en"><body><div id="app"></div></body></html>');
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, writable: true });
// mock resize observer and other browser APIs
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = clearTimeout;

import('./src/main.js').then(() => {
  console.log('MAIN LOADED SUCCESSFULLY');
  setTimeout(() => process.exit(0), 1000);
}).catch(e => {
  console.error('MAIN ERROR', e);
  process.exit(1);
});
