import type { BrandInput, Typography } from '../types/brand';
const map: Record<string, [string, number, number]> = {
  'Modern Sans Serif': ['Arial, Helvetica, sans-serif', 700, -1],
  'Elegant Serif': ['Georgia, Times New Roman, serif', 700, 0],
  'Bold Display': ['Impact, Arial Black, sans-serif', 900, 1],
  Minimal: ['Arial, Helvetica, sans-serif', 400, 2],
  Rounded: ['Trebuchet MS, Arial, sans-serif', 700, -1],
  Futuristic: ['Consolas, Courier New, monospace', 700, -1],
  Corporate: ['Verdana, Arial, sans-serif', 700, -1],
  Creative: ['Georgia, Times New Roman, serif', 700, 1],
};
export function createTypography(brand: BrandInput): Typography {
  const [family, weight, spacing] = map[brand.fontPersonality] || map['Modern Sans Serif'];
  return {
    name: brand.fontPersonality,
    family,
    weight: brand.personality.includes('Bold') ? 900 : weight,
    spacing: brand.personality.includes('Luxury') ? 2 : spacing,
    bodyFamily: 'Arial, Helvetica, sans-serif',
    reasoning: `${brand.fontPersonality} gives ${brand.brandName} a ${brand.personality.slice(0, 2).join(' and ').toLowerCase() || 'clear'} voice. System font stacks keep the studio independent of online font services.`,
  };
}
