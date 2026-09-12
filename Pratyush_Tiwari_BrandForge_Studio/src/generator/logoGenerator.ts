import type { BrandInput } from '../types/brand';
import type { LogoConcept, Layout } from '../types/logo';
import type { SVGElement } from '../editor/editorTypes';
import { analyzeBrand } from './semanticAnalyzer';
import { createPalette } from './paletteEngine';
import { createTypography } from './typographyEngine';
import { iconDescriptions } from './iconLibrary';
import { documentSvg, makeElement, uid } from '../editor/editorUtils';
import { inkOn } from '../utils/colorUtils';
const designFamilies = [
  {
    name: 'Signature',
    layout: 'stacked',
    icon: [210, 34, 180],
    text: [56, 225, 488, 50],
    motif: 'halo',
  },
  {
    name: 'Ribbon Classic',
    layout: 'badge',
    icon: [208, 26, 184],
    text: [74, 228, 452, 42],
    motif: 'ribbon',
  },
  {
    name: 'Heritage Seal',
    layout: 'emblem',
    icon: [222, 51, 156],
    text: [65, 225, 470, 42],
    motif: 'ring',
  },
  {
    name: 'Big Mascot',
    layout: 'stacked',
    icon: [198, 22, 204],
    text: [44, 238, 512, 49],
    motif: 'burst',
  },
  {
    name: 'Clean Mark',
    layout: 'minimal',
    icon: [226, 42, 148],
    text: [76, 222, 448, 48],
    motif: 'plain',
  },
  {
    name: 'Sticker Badge',
    layout: 'badge',
    icon: [204, 26, 192],
    text: [60, 235, 480, 41],
    motif: 'ticket',
  },
  {
    name: 'Monogram Lockup',
    layout: 'horizontal',
    icon: [64, 88, 150],
    text: [224, 126, 330, 47],
    motif: 'initial',
  },
  {
    name: 'Poster Mark',
    layout: 'stacked',
    icon: [190, 28, 220],
    text: [52, 246, 496, 45],
    motif: 'panel',
  },
  {
    name: 'Premium Crest',
    layout: 'emblem',
    icon: [208, 36, 184],
    text: [58, 234, 484, 40],
    motif: 'crest',
  },
  {
    name: 'Fast Tile',
    layout: 'minimal',
    icon: [194, 35, 212],
    text: [66, 250, 468, 41],
    motif: 'tile',
  },
  {
    name: 'Founder Stamp',
    layout: 'badge',
    icon: [218, 50, 164],
    text: [60, 229, 480, 41],
    motif: 'ring',
  },
  {
    name: 'Premium Horizontal',
    layout: 'horizontal',
    icon: [70, 108, 150],
    text: [244, 129, 310, 44],
    motif: 'plain',
  },
  {
    name: 'Round Badge',
    layout: 'emblem',
    icon: [215, 47, 170],
    text: [74, 226, 452, 41],
    motif: 'halo',
  },
  {
    name: 'Sharp Split',
    layout: 'split',
    icon: [66, 92, 164],
    text: [248, 128, 304, 45],
    motif: 'divider',
  },
  {
    name: 'App Icon',
    layout: 'minimal',
    icon: [205, 32, 190],
    text: [76, 240, 448, 42],
    motif: 'tile',
  },
  {
    name: 'Luxury Crest',
    layout: 'emblem',
    icon: [205, 38, 190],
    text: [58, 235, 484, 39],
    motif: 'crest',
  },
  {
    name: 'Shelf Sign',
    layout: 'horizontal',
    icon: [188, 28, 224],
    text: [68, 244, 464, 43],
    motif: 'panel',
  },
  {
    name: 'Social Avatar',
    layout: 'badge',
    icon: [198, 25, 204],
    text: [70, 242, 460, 39],
    motif: 'ticket',
  },
  {
    name: 'Clean Wordmark',
    layout: 'stacked',
    icon: [235, 52, 130],
    text: [42, 205, 516, 56],
    motif: 'plain',
  },
  {
    name: 'Corner Emblem',
    layout: 'horizontal',
    icon: [76, 96, 142],
    text: [226, 129, 330, 46],
    motif: 'initial',
  },
  {
    name: 'Modern Poster',
    layout: 'stacked',
    icon: [195, 28, 210],
    text: [52, 246, 496, 44],
    motif: 'panel',
  },
  {
    name: 'Editorial Badge',
    layout: 'badge',
    icon: [210, 40, 180],
    text: [58, 233, 484, 40],
    motif: 'ribbon',
  },
  {
    name: 'Soft Seal',
    layout: 'emblem',
    icon: [214, 48, 172],
    text: [70, 226, 460, 40],
    motif: 'ticket',
  },
  {
    name: 'Compact Mark',
    layout: 'minimal',
    icon: [215, 45, 170],
    text: [76, 235, 448, 41],
    motif: 'rail',
  },
] as const;
type DesignFamily = (typeof designFamilies)[number];
const conceptNames = [
  'Signature',
  'Classic',
  'Heritage',
  'Modern',
  'Minimal',
  'Badge',
  'Monogram',
  'Poster',
  'Crest',
  'Fast Tile',
  'Studio Pick',
  'Bold Mark',
  'Corner Sign',
  'Fresh Look',
  'Smart Lockup',
  'Premium Form',
  'Clean Signal',
  'Local Favorite',
];
export function generateLogos(brand: BrandInput): LogoConcept[] {
  if (!brand.brandName.trim()) throw new Error('Enter your brand name to generate logos.');
  const semantic = analyzeBrand(brand),
    typography = createTypography(brand);
  const conceptCount = Math.min(240, semantic.symbols.length * designFamilies.length);
  const style = brand.logoStyle;
  return Array.from({ length: conceptCount }, (_, i) => {
    const symbol = semantic.symbols[i % semantic.symbols.length],
      family =
        designFamilies[(i + Math.floor(i / semantic.symbols.length)) % designFamilies.length],
      palette = createPalette(brand, semantic.category, i),
      layout = family.layout as Layout,
      dark = [1, 5, 13, 18].includes(i % designFamilies.length) || family.motif === 'crest',
      background = dark ? palette.secondary : palette.background;
    const isHorizontal = layout === 'horizontal' || layout === 'split',
      isEmblem = layout === 'emblem' || layout === 'badge';
    const weight = typography.weight;
    const [baseSymbolX, baseSymbolY, baseIconSize] = family.icon;
    const [nameX, nameY, nameW, baseNameSize] = family.text;
    const iconSize =
      style === 'Wordmark'
        ? Math.round(baseIconSize * 0.66)
        : style === 'Lettermark'
          ? Math.round(baseIconSize * 0.88)
          : style === 'Minimal'
            ? Math.round(baseIconSize * 0.86)
            : baseIconSize;
    const symbolX = style === 'Wordmark' && !isHorizontal ? (600 - iconSize) / 2 : baseSymbolX,
      symbolY = style === 'Wordmark' && !isHorizontal ? 68 : baseSymbolY,
      nameSize = style === 'Wordmark' ? Math.min(56, baseNameSize + 9) : baseNameSize;
    const elements: SVGElement[] = [];
    addFamilyMotif(elements, family, palette, dark, brand.brandName, i);
    if (isEmblem)
      elements.push(
        makeElement({
          name: 'Identity seal',
          role: 'decoration',
          shape: style === 'Geometric' ? 'polygon' : 'circle',
          x: 185,
          y: 23,
          width: 230,
          height: 230,
          fill: dark ? palette.primary : palette.secondary,
          opacity: 0.085,
          rotation: (i * 12) % 360,
        }),
      );
    if (layout === 'split')
      elements.push(
        makeElement({
          name: 'Divider',
          role: 'decoration',
          shape: 'line',
          x: 214,
          y: 145,
          width: 2,
          height: 110,
          rotation: 90,
          fill: palette.primary,
          stroke: dark ? '#ffffff' : palette.primary,
          strokeWidth: 1,
          opacity: 0.5,
        }),
      );
    elements.push(
      makeElement({
        name: iconDescriptions[symbol] || symbol,
        kind: 'icon',
        role: 'symbol',
        icon: symbol,
        text: Array.from(brand.brandName.trim())[0].toUpperCase(),
        x: symbolX,
        y: symbolY,
        width: iconSize,
        height: iconSize,
        fill: dark ? '#ffffff' : palette.primary,
        secondary: dark ? palette.accent : palette.secondary,
        accent: dark ? palette.primary : palette.accent,
        gradient: style === 'Gradient' || family.motif === 'panel',
        shadow: style === 'Mascot-style SVG' || family.motif === 'ticket',
        rotation:
          style === 'Abstract'
            ? (i * 6 - 12 + 360) % 360
            : family.motif === 'ticket'
              ? i % 2
                ? 355
                : 5
              : 0,
      }),
    );
    if (family.motif === 'initial')
      elements.push(
        makeElement({
          name: 'Initial capsule',
          kind: 'text',
          role: 'decoration',
          x: 436,
          y: 226,
          width: 64,
          height: 58,
          text: Array.from(brand.brandName.trim())[0].toUpperCase(),
          fill: dark ? '#ffffff' : palette.primary,
          fontFamily: typography.family,
          fontSize: 44,
          fontWeight: 800,
          opacity: 0.85,
        }),
      );
    if (style === 'Lettermark' && semantic.category !== 'Other')
      elements.push(
        makeElement({
          name: 'Initial accent',
          kind: 'text',
          role: 'decoration',
          x: symbolX + iconSize - 4,
          y: symbolY + iconSize - 28,
          width: 36,
          height: 40,
          text: brand.brandName[0].toUpperCase(),
          fill: dark ? '#ffffff' : palette.ink,
          fontFamily: typography.family,
          fontSize: 30,
        }),
      );
    if (style === 'Mascot-style SVG')
      elements.push(
        makeElement({
          name: 'Friendly eyes',
          kind: 'text',
          role: 'decoration',
          x: symbolX + iconSize * 0.27,
          y: symbolY + iconSize * 0.42,
          width: iconSize * 0.46,
          height: 30,
          text: '• •',
          fill: dark ? palette.ink : '#ffffff',
          fontSize: 26,
        }),
      );
    elements.push(
      makeElement({
        name: 'Brand name',
        kind: 'text',
        role: 'brand',
        text: brand.brandName.trim(),
        x: nameX,
        y: nameY,
        width: nameW,
        height: 65,
        fontFamily: typography.family,
        fontSize: nameSize,
        fontWeight: weight,
        letterSpacing: typography.spacing,
        fill: inkOn(background),
      }),
    );
    if (brand.tagline.trim())
      elements.push(
        makeElement({
          name: 'Tagline',
          kind: 'text',
          role: 'tagline',
          text: brand.tagline.trim(),
          x: nameX,
          y: nameY + Math.max(58, nameSize + 18),
          width: nameW,
          height: 32,
          fontFamily: typography.bodyFamily,
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: 1.4,
          fill: inkOn(background),
          opacity: 0.77,
        }),
      );
    if (layout === 'badge')
      elements.push(
        makeElement({
          name: 'Signature underline',
          role: 'decoration',
          shape: 'rounded rectangle',
          x: 274,
          y: 343,
          width: 52,
          height: 4,
          radius: 50,
          fill: palette.accent,
        }),
      );
    if (i > 5 && (layout === 'emblem' || layout === 'badge'))
      elements.push(
        makeElement({
          name: 'Outer ring',
          role: 'decoration',
          shape: 'circle',
          x: 171,
          y: 9,
          width: 258,
          height: 258,
          fill: 'transparent',
          stroke: dark ? '#ffffff' : palette.secondary,
          strokeWidth: 2,
          opacity: 0.22,
          rotation: (i * 9) % 360,
        }),
      );
    const variantName = conceptNames[i % conceptNames.length],
      conceptName = family.name.toLowerCase().includes(variantName.toLowerCase())
        ? family.name
        : `${family.name} ${variantName}`;
    const semanticConnection =
      semantic.category === 'Other'
        ? `“${brand.brandName}” has no known dictionary category. This concept uses ${iconDescriptions[symbol]} and the name’s initial where applicable; its ${brand.personality.join(', ').toLowerCase() || 'balanced'} character comes from geometry and typography, rather than an invented meaning.`
        : `This logo uses ${iconDescriptions[symbol]} to represent ${brand.brandName} and its ${semantic.theme.toLowerCase()} identity. ${semantic.keywords.length ? `Matched cues: ${semantic.keywords.slice(0, 4).join(', ')}.` : `The selected ${brand.industry.toLowerCase()} industry supplies the symbol vocabulary.`}`;
    return {
      id: uid(),
      name: conceptName,
      category: semantic.category,
      semanticConnection,
      palette,
      typography,
      svgElements: elements,
      svg: documentSvg({ elements, background }, { title: brand.brandName }),
      layout,
      background,
    };
  });
}
function addFamilyMotif(
  elements: ReturnType<typeof makeElement>[],
  family: DesignFamily,
  palette: ReturnType<typeof createPalette>,
  dark: boolean,
  brandName: string,
  index: number,
) {
  const ink = dark ? '#ffffff' : palette.primary;
  if (family.motif === 'halo')
    elements.push(
      makeElement({
        name: 'Soft halo',
        role: 'decoration',
        shape: 'circle',
        x: 193,
        y: 19,
        width: 214,
        height: 214,
        fill: ink,
        opacity: 0.06,
      }),
    );
  if (family.motif === 'rail')
    elements.push(
      makeElement({
        name: 'Side rail',
        role: 'decoration',
        shape: 'rounded rectangle',
        x: 38,
        y: 66,
        width: 9,
        height: 268,
        radius: 20,
        fill: palette.accent,
        opacity: 0.8,
      }),
    );
  if (family.motif === 'ring')
    elements.push(
      makeElement({
        name: 'Outer seal',
        role: 'decoration',
        shape: 'circle',
        x: 165,
        y: 10,
        width: 270,
        height: 270,
        fill: 'transparent',
        stroke: ink,
        strokeWidth: 3,
        opacity: 0.26,
      }),
      makeElement({
        name: 'Inner seal',
        role: 'decoration',
        shape: 'circle',
        x: 193,
        y: 38,
        width: 214,
        height: 214,
        fill: 'transparent',
        stroke: palette.accent,
        strokeWidth: 5,
        opacity: 0.24,
      }),
    );
  if (family.motif === 'ribbon')
    elements.push(
      makeElement({
        name: 'Ribbon left fold',
        role: 'decoration',
        shape: 'polygon',
        x: 50,
        y: 260,
        width: 86,
        height: 54,
        fill: dark ? '#ffffff' : palette.secondary,
        opacity: dark ? 0.12 : 0.18,
        rotation: 180,
      }),
      makeElement({
        name: 'Brand ribbon',
        role: 'decoration',
        shape: 'rounded rectangle',
        x: 92,
        y: 248,
        width: 416,
        height: 64,
        radius: 16,
        fill: dark ? '#ffffff' : palette.secondary,
        opacity: dark ? 0.11 : 0.15,
      }),
      makeElement({
        name: 'Ribbon right fold',
        role: 'decoration',
        shape: 'polygon',
        x: 464,
        y: 260,
        width: 86,
        height: 54,
        fill: dark ? '#ffffff' : palette.secondary,
        opacity: dark ? 0.12 : 0.18,
      }),
    );
  if (family.motif === 'burst')
    elements.push(
      makeElement({
        name: 'Mascot burst',
        role: 'decoration',
        shape: 'star',
        x: 160,
        y: 8,
        width: 280,
        height: 280,
        fill: dark ? '#ffffff' : palette.accent,
        opacity: dark ? 0.1 : 0.2,
        rotation: (index * 17) % 360,
      }),
      makeElement({
        name: 'Mascot medallion',
        role: 'decoration',
        shape: 'circle',
        x: 198,
        y: 46,
        width: 204,
        height: 204,
        fill: dark ? '#ffffff' : palette.primary,
        opacity: dark ? 0.08 : 0.1,
      }),
      makeElement({
        name: 'Spark dot',
        role: 'decoration',
        shape: 'circle',
        x: 408,
        y: 76,
        width: 24,
        height: 24,
        fill: palette.accent,
        opacity: 0.85,
      }),
    );
  if (family.motif === 'panel')
    elements.push(
      makeElement({
        name: 'Poster panel',
        role: 'decoration',
        shape: 'rounded rectangle',
        x: 92,
        y: 26,
        width: 416,
        height: 322,
        radius: 24,
        fill: dark ? '#ffffff' : palette.secondary,
        opacity: dark ? 0.08 : 0.1,
        rotation: index % 2 ? 2 : 358,
      }),
    );
  if (family.motif === 'ticket')
    elements.push(
      makeElement({
        name: 'Ticket slab',
        role: 'decoration',
        shape: 'rounded rectangle',
        x: 84,
        y: 38,
        width: 432,
        height: 300,
        radius: 18,
        fill: dark ? '#ffffff' : palette.primary,
        opacity: dark ? 0.07 : 0.065,
        rotation: index % 2 ? 357 : 3,
      }),
    );
  if (family.motif === 'crest')
    elements.push(
      makeElement({
        name: 'Crest slab',
        role: 'decoration',
        shape: 'polygon',
        x: 178,
        y: 20,
        width: 244,
        height: 272,
        fill: palette.primary,
        opacity: 0.12,
        rotation: 45,
      }),
    );
  if (family.motif === 'tile')
    elements.push(
      makeElement({
        name: 'Icon tile',
        role: 'decoration',
        shape: 'rounded rectangle',
        x: 171,
        y: 29,
        width: 258,
        height: 224,
        radius: 42,
        fill: dark ? '#ffffff' : palette.secondary,
        opacity: dark ? 0.1 : 0.13,
        rotation: index % 2 ? 358 : 2,
      }),
    );
  if (family.motif === 'initial')
    elements.push(
      makeElement({
        name: 'Large watermark initial',
        kind: 'text',
        role: 'decoration',
        x: 388,
        y: 66,
        width: 156,
        height: 130,
        text: Array.from(brandName.trim())[0].toUpperCase(),
        fill: ink,
        fontSize: 116,
        fontWeight: 900,
        opacity: 0.06,
      }),
    );
}
