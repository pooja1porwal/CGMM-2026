import JSZip from 'jszip';
import type { LogoConcept } from '../types/logo';
import { documentSvg } from '../editor/editorUtils';
export const safeName = (name: string) =>
  name.replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-|-$/g, '') || 'brandforge-logo';
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
export function downloadSVG(svg: string, name: string) {
  downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), safeName(name) + '.svg');
}
export async function rasterBlob(svg: string, format: 'png' | 'jpeg', scale = 3): Promise<Blob> {
  await document.fonts.ready;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () =>
        reject(new Error('This browser could not rasterize the SVG. Please use SVG export.'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = 600 * scale;
    canvas.height = 400 * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas export is unavailable in this browser.');
    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Image export failed.'))),
        `image/${format}`,
        0.94,
      ),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
export async function exportLogo(
  concept: LogoConcept,
  format: 'svg' | 'png' | 'jpeg',
  transparent = false,
) {
  const svg = documentSvg(
    { elements: concept.svgElements, background: concept.background },
    { transparent, title: concept.name },
  );
  if (format === 'svg') downloadSVG(svg, concept.name);
  else
    downloadBlob(
      await rasterBlob(svg, format),
      safeName(concept.name) + (transparent ? '-transparent' : '') + '.' + format,
    );
}
export async function downloadKit(files: Record<string, string | Blob>, name: string) {
  const zip = new JSZip();
  Object.entries(files).forEach(([path, content]) => zip.file(path, content));
  downloadBlob(await zip.generateAsync({ type: 'blob' }), safeName(name) + '-brand-kit.zip');
}
