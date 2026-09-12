import type { EditorDocument, SVGElement, ShapeKind } from './editorTypes';
import { iconMarkup } from '../generator/iconLibrary';
export const uid = () =>
  globalThis.crypto?.randomUUID?.() || `el-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const escapeXml = (v: string) =>
  v.replace(
    /[<>&"']/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!,
  );
export function makeElement(values: Partial<SVGElement>): SVGElement {
  return {
    id: uid(),
    name: 'Shape',
    kind: 'shape',
    x: 250,
    y: 150,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    fill: '#703ee8',
    stroke: '#292530',
    strokeWidth: 0,
    radius: 12,
    visible: true,
    locked: false,
    shape: 'rectangle',
    secondary: '#3156c8',
    accent: '#dfa648',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: 0,
    gradient: false,
    shadow: false,
    ...values,
  };
}
export function shapeMarkup(shape: ShapeKind, radius = 12): string {
  switch (shape) {
    case 'circle':
      return '<circle cx="50" cy="50" r="48"/>';
    case 'ellipse':
      return '<ellipse cx="50" cy="50" rx="49" ry="34"/>';
    case 'triangle':
      return '<polygon points="50,2 98,98 2,98"/>';
    case 'polygon':
      return '<polygon points="50,2 93,26 93,74 50,98 7,74 7,26"/>';
    case 'star':
      return '<polygon points="50,2 62,35 98,36 70,58 79,95 50,74 21,95 30,58 2,36 38,35"/>';
    case 'line':
      return '<line x1="0" y1="50" x2="100" y2="50" fill="none"/>';
    default:
      return `<rect x="0" y="0" width="100" height="100" rx="${shape === 'rounded rectangle' ? radius : 0}"/>`;
  }
}
export function transform(e: SVGElement) {
  return `translate(${e.x} ${e.y}) rotate(${e.rotation} ${(e.width * e.scaleX) / 2} ${(e.height * e.scaleY) / 2}) scale(${e.scaleX} ${e.scaleY})`;
}
export function elementMarkup(e: SVGElement, monochrome?: string): string {
  const id = e.id.replace(/[^\w-]/g, ''),
    f = monochrome || e.fill,
    s = monochrome || e.secondary,
    a = monochrome || e.accent;
  const definitions = `<defs><linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${f}"/><stop offset="1" stop-color="${s}"/></linearGradient><radialGradient id="r${id}"><stop stop-color="${a}"/><stop offset="1" stop-color="${f}"/></radialGradient><filter id="s${id}" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".18"/></filter></defs>`;
  const fill = e.gradient && !monochrome ? `url(#${e.kind === 'shape' ? 'r' : 'g'}${id})` : f;
  let content = '';
  if (e.kind === 'text') {
    const estimatedWidth =
      Array.from(e.text || '').length * e.fontSize * 0.61 +
      Math.max(0, Array.from(e.text || '').length - 1) * e.letterSpacing;
    content = `<text x="${e.width / 2}" y="${e.height / 2 + e.fontSize * 0.34}" text-anchor="middle" font-family="${escapeXml(e.fontFamily)}" font-size="${e.fontSize}" font-weight="${e.fontWeight}" letter-spacing="${e.letterSpacing}"${estimatedWidth > e.width ? ` textLength="${e.width}" lengthAdjust="spacingAndGlyphs"` : ''}>${escapeXml(e.text || '')}</text>`;
  } else {
    let geometry =
      e.kind === 'icon'
        ? iconMarkup(e.icon || 'facets', fill, s, a, escapeXml(Array.from(e.text || 'B')[0]))
        : shapeMarkup(e.shape || 'rectangle', e.radius);
    if (e.kind === 'icon' && e.strokeWidth > 0)
      geometry = geometry
        .replace(/stroke="[^"]*"/g, `stroke="${monochrome || e.stroke}"`)
        .replace(/stroke-width="[^"]*"/g, `stroke-width="${e.strokeWidth}"`);
    content = `<g transform="scale(${e.width / 100} ${e.height / 100})">${geometry}</g>`;
  }
  return `<g data-element-id="${escapeXml(e.id)}" transform="${transform(e)}" opacity="${e.opacity}" fill="${fill}" stroke="${monochrome || e.stroke}" stroke-width="${e.strokeWidth}"${e.shadow ? ` filter="url(#s${id})"` : ''}${!e.visible ? ' display="none"' : ''}>${definitions}${content}</g>`;
}
export function documentSvg(
  doc: EditorDocument,
  options: { transparent?: boolean; monochrome?: string; title?: string } = {},
) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" role="img"><title>${escapeXml(options.title || 'BrandForge logo')}</title>${!options.transparent && doc.background !== 'transparent' ? `<rect width="600" height="400" fill="${doc.background}"/>` : ''}${doc.elements.map((e) => elementMarkup(e, options.monochrome)).join('')}</svg>`;
}
export function reorder(elements: SVGElement[], id: string, direction: number) {
  const next = [...elements],
    i = next.findIndex((e) => e.id === id),
    j = i + direction;
  if (i < 0 || j < 0 || j >= next.length) return elements;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
