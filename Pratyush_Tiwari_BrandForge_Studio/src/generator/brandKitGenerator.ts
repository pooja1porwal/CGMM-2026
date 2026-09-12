import type { LogoConcept } from '../types/logo';
import type { EditorDocument, SVGElement } from '../editor/editorTypes';
import { documentSvg } from '../editor/editorUtils';
export interface LogoVariant {
  name: string;
  slug: string;
  svg: string;
  background: string;
  description: string;
}
export function brandVariants(concept: LogoConcept): LogoVariant[] {
  const elements = concept.svgElements,
    main = elements.find((e) => e.role === 'symbol'),
    title = elements.find((e) => e.role === 'brand'),
    tagline = elements.find((e) => e.role === 'tagline');
  const positioned = (e: SVGElement, x: number, y: number, width: number, height: number) => ({
    ...e,
    x,
    y,
    width,
    height,
    scaleX: 1,
    scaleY: 1,
  });
  const horizontal = [
    ...(main ? [positioned(main, 68, 118, 155, 155)] : []),
    ...(title ? [positioned(title, 250, 151, 300, 62)] : []),
    ...(tagline ? [positioned(tagline, 250, 219, 300, 30)] : []),
  ];
  const vertical = [
    ...(main ? [positioned(main, 230, 40, 140, 140)] : []),
    ...(title ? [positioned(title, 65, 207, 470, 65)] : []),
    ...(tagline ? [positioned(tagline, 65, 279, 470, 30)] : []),
  ];
  const icon = main
    ? [positioned(main, 190, 90, 220, 220)]
    : elements.filter((e) => e.kind !== 'text');
  const base: EditorDocument = { elements, background: concept.background };
  return [
    {
      name: 'Primary logo',
      slug: 'primary',
      svg: documentSvg(base),
      background: concept.background,
      description: 'The complete edited composition. Your default brand signature.',
    },
    {
      name: 'Secondary logo',
      slug: 'secondary',
      svg: documentSvg({ ...base, elements: vertical.filter((e) => e.role !== 'tagline') }),
      background: concept.background,
      description: 'A simplified signature without a tagline.',
    },
    {
      name: 'Icon-only version',
      slug: 'icon',
      svg: documentSvg({ ...base, elements: icon }),
      background: concept.background,
      description: 'For avatars, app icons, and small spaces.',
    },
    {
      name: 'Horizontal version',
      slug: 'horizontal',
      svg: documentSvg({ ...base, elements: horizontal }),
      background: concept.background,
      description: 'Symbol and wordmark side by side for wider spaces.',
    },
    {
      name: 'Vertical version',
      slug: 'vertical',
      svg: documentSvg({ ...base, elements: vertical }),
      background: concept.background,
      description: 'A centered stack for packaging and cover images.',
    },
    {
      name: 'Monochrome version',
      slug: 'monochrome',
      svg: documentSvg({ ...base, background: '#ffffff' }, { monochrome: '#48434e' }),
      background: '#ffffff',
      description: 'A single gray ink direction for restrained applications.',
    },
    {
      name: 'Black version',
      slug: 'black',
      svg: documentSvg({ ...base, background: '#ffffff' }, { monochrome: '#17151c' }),
      background: '#ffffff',
      description: 'High contrast for documents and light surfaces.',
    },
    {
      name: 'White version',
      slug: 'white',
      svg: documentSvg({ ...base, background: '#25212e' }, { monochrome: '#ffffff' }),
      background: '#25212e',
      description: 'A reversed signature for dark surfaces.',
    },
    {
      name: 'Transparent version',
      slug: 'transparent',
      svg: documentSvg(base, { transparent: true }),
      background: 'transparent',
      description: 'No artboard background. Place over a compatible surface.',
    },
  ];
}
