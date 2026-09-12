import { describe, it, expect } from 'vitest';
import { DOMParser } from '@xmldom/xmldom';
import { analyzeBrand, categorySymbols } from './semanticAnalyzer';
import { generateLogos } from './logoGenerator';
import { brandVariants } from './brandKitGenerator';
import { iconDescriptions, iconMarkup } from './iconLibrary';
import { emptyBrand, presets, styles, fonts } from '../data/presets';
import { industries } from '../types/brand';
import { documentSvg, makeElement } from '../editor/editorUtils';
import { contrast, hexToRgb } from '../utils/colorUtils';
describe('semantic matching', () => {
  it.each(presets)('detects $brandName from its name or context', (brand) =>
    expect(analyzeBrand(brand).category).toBe(brand.industry),
  );
  it('gives a meaningful brand-name match priority over an unrelated selected industry', () =>
    expect(analyzeBrand({ ...emptyBrand, brandName: 'CloudByte', industry: 'Food' }).category).toBe(
      'Technology',
    ));
  it('avoids matching short AI and car tokens inside unrelated words', () =>
    expect(analyzeBrand({ ...emptyBrand, brandName: 'Chair Scarlet' }).category).toBe('Other'));
  it('uses industry as a fallback for an unknown name', () =>
    expect(
      analyzeBrand({ ...emptyBrand, brandName: 'Zorvex', industry: 'Education' }).category,
    ).toBe('Education'));
  it('has an honest unknown-name fallback', () => {
    const result = analyzeBrand({ ...emptyBrand, brandName: 'Zorvex' });
    expect(result.category).toBe('Other');
    expect(result.rationale).toContain('No dictionary category');
  });
  it.each([
    ['Coffee Corner', 'coffee-bean'],
    ['Pizza Planet', 'pizza'],
    ['Sweet Bakery', 'cake'],
  ])('distinguishes food subtype %s', (brandName, icon) =>
    expect(analyzeBrand({ ...emptyBrand, brandName, industry: 'Food' }).symbols[0]).toBe(icon),
  );
  it('keeps the requested street-food symbols near the top for Vadapav', () => {
    const topSymbols = analyzeBrand(presets[0]).symbols.slice(0, 12);
    for (const icon of ['bun', 'cart', 'packet', 'pav-badge', 'flame-plate', 'cutlery-bun'])
      expect(topSymbols).toContain(icon);
  });
  it('uses tagline and description for category evidence', () =>
    expect(
      analyzeBrand({
        ...emptyBrand,
        brandName: 'Zorvex',
        tagline: 'Learn with us',
        description: 'Education courses and books for school.',
      }).category,
    ).toBe('Education'));
  it('ranks specific education tags ahead of generic education symbols', () => {
    expect(
      analyzeBrand({ ...emptyBrand, brandName: 'Bright Path School', industry: 'Education' })
        .symbols[0],
    ).toBe('school-shield');
    expect(
      analyzeBrand({ ...emptyBrand, brandName: 'SkillStack Online Course', industry: 'Education' })
        .symbols[0],
    ).toBe('online-class');
  });
  it('surfaces many pencil and stationery symbols for pencil searches', () => {
    const topSymbols = analyzeBrand({
      ...emptyBrand,
      brandName: 'The Pencil Spot',
      tagline: 'Pencil and stationery',
      industry: 'Education',
    }).symbols.slice(0, 14);
    expect(topSymbols).toEqual(
      expect.arrayContaining([
        'pencil',
        'stationery',
        'pencil-bundle',
        'notebook-pencil',
        'ruler-pencil',
        'paper-pencil',
      ]),
    );
  });
});
describe('procedural SVG generator', () => {
  it.each(industries)('generates a ranked gallery of semantic compositions for %s', (industry) => {
    const brand = { ...emptyBrand, brandName: 'Zorvex', industry, tagline: 'Built for tomorrow' };
    const logos = generateLogos(brand);
    expect(logos).toHaveLength(240);
    expect(new Set(logos.map((l) => l.layout)).size).toBeGreaterThanOrEqual(5);
    expect(
      new Set(logos.map((l) => l.svgElements.find((e) => e.role === 'symbol')?.icon)).size,
    ).toBeGreaterThanOrEqual(categorySymbols[industry].length);
    for (const logo of logos.slice(0, 24)) {
      expect(logo.category).toBe(industry);
      expect(logo.semanticConnection).toContain('Zorvex');
      expect(logo.svgElements.some((e) => e.kind === 'icon')).toBe(true);
      const xml = new DOMParser().parseFromString(logo.svg, 'image/svg+xml');
      expect(xml.documentElement?.localName).toBe('svg');
      const texts = Array.from(xml.getElementsByTagName('text')).map((t) => t.textContent);
      expect(texts).toContain(brand.brandName);
      expect(texts).toContain(brand.tagline);
      expect(logo.svg).not.toMatch(
        /NaN|Infinity|undefined|<script|<image|https?:\/\/(?!www.w3.org)/,
      );
      expect(
        contrast(logo.svgElements.find((e) => e.role === 'brand')!.fill, logo.background),
      ).toBeGreaterThan(4.5);
    }
  });
  it.each(styles)('keeps symbolic graphics in %s style', (logoStyle) => {
    const logos = generateLogos({ ...presets[0], logoStyle });
    for (const l of logos) {
      expect(l.svgElements.some((e) => e.kind === 'icon')).toBe(true);
      expect(l.svgElements.every((e) => e.rotation >= 0 && e.rotation <= 360)).toBe(true);
      expect(new DOMParser().parseFromString(l.svg, 'image/svg+xml').documentElement?.tagName).toBe(
        'svg',
      );
    }
  });
  it.each(fonts)('supports font preference %s', (fontPersonality) =>
    expect(generateLogos({ ...presets[1], fontPersonality })[0].typography.name).toBe(
      fontPersonality,
    ),
  );
  it('escapes user text instead of treating it as markup', () => {
    const logo = generateLogos({
      ...emptyBrand,
      brandName: '<script>& "Studio"',
      tagline: '<img onerror="bad">',
    })[0];
    const xml = new DOMParser().parseFromString(logo.svg, 'image/svg+xml');
    expect(xml.getElementsByTagName('script').length).toBe(0);
    expect(xml.getElementsByTagName('img').length).toBe(0);
    expect(xml.getElementsByTagName('text')[0].textContent).toBe('<script>& "Studio"');
  });
  it('rejects an empty name', () => expect(() => generateLogos(emptyBrand)).toThrow('brand name'));
  it('renders every category symbol as actual geometry', () => {
    for (const symbols of Object.values(categorySymbols))
      for (const icon of symbols) {
        expect(iconDescriptions[icon]).toBeTruthy();
        expect(iconMarkup(icon, '#123456', '#654321', '#abcdef')).toMatch(
          /<(path|rect|circle|ellipse|g)/,
        );
      }
  });
  it('emits linear and radial gradients, opacity, and grouped transforms', () => {
    const element = makeElement({
      gradient: true,
      opacity: 0.5,
      rotation: 30,
      scaleX: 2,
      shadow: true,
    });
    const svg = documentSvg({ elements: [element], background: '#ffffff' });
    expect(svg).toContain('<linearGradient');
    expect(svg).toContain('<radialGradient');
    expect(svg).toContain('<feDropShadow');
    expect(svg).toContain('opacity="0.5"');
    expect(svg).toContain('rotate(30');
    expect(svg).toContain('scale(2 1)');
  });
  it('preserves edits in the primary kit and exports nine variants', () => {
    const concept = generateLogos(presets[0])[0];
    concept.svgElements = concept.svgElements.map((e) =>
      e.role === 'brand' ? { ...e, text: 'Edited Brand', x: 100 } : e,
    );
    const variants = brandVariants(concept);
    expect(variants).toHaveLength(9);
    expect(variants[0].svg).toContain('Edited Brand');
    expect(variants[0].svg).toContain('translate(100 ');
    const iconDoc = new DOMParser().parseFromString(variants[2].svg, 'image/svg+xml');
    expect(iconDoc.getElementsByTagName('text').length).toBe(0);
    expect(variants.at(-1)!.svg).not.toContain('<rect width="600" height="400"');
  });
  it('converts HEX channels exactly', () =>
    expect(hexToRgb('#703ee8')).toEqual({ r: 112, g: 62, b: 232 }));
});
