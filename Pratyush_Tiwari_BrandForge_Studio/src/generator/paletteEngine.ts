import type { BrandInput, Industry, Palette } from '../types/brand';
import { mix, validHex } from '../utils/colorUtils';
export const swatches: Record<string, string> = {
  Blue: '#2563eb',
  Purple: '#703ee8',
  Red: '#d73a44',
  Orange: '#ed7425',
  Green: '#258354',
  Pink: '#d65088',
  Yellow: '#dca824',
  Black: '#25252b',
  Monochrome: '#34343b',
  'Purple / Blue': '#7144e8',
};
const defaults: Partial<Record<Industry, string>> = {
  Food: 'Orange',
  Finance: 'Blue',
  Technology: 'Purple',
  Healthcare: 'Green',
  Travel: 'Blue',
  Beauty: 'Pink',
  Fashion: 'Black',
  Sports: 'Red',
};
const marketplacePalettes: Partial<Record<Industry, string[]>> = {
  Education: ['#f97316', '#3156c8', '#f43f5e', '#0f766e', '#7c3aed', '#f59e0b', '#0f172a'],
  Food: ['#ea580c', '#7c2d12', '#15803d', '#dc2626', '#f59e0b', '#111827'],
  Technology: ['#2563eb', '#7c3aed', '#0f766e', '#0891b2', '#111827', '#db2777'],
  Finance: ['#167a6d', '#2563eb', '#0f172a', '#15803d', '#7c3aed', '#ca8a04'],
  Healthcare: ['#0d9488', '#16a34a', '#2563eb', '#dc2626', '#7c3aed', '#0891b2'],
  Beauty: ['#db2777', '#be185d', '#7c3aed', '#ea580c', '#111827', '#c026d3'],
  Fashion: ['#111827', '#be123c', '#7c2d12', '#6d28d9', '#0f766e', '#ca8a04'],
  Sports: ['#dc2626', '#2563eb', '#16a34a', '#ea580c', '#111827', '#7c3aed'],
  Other: ['#111827', '#3156c8', '#7c3aed', '#0f766e', '#ea580c', '#be123c'],
};
export function createPalette(brand: BrandInput, category: Industry, index = 0): Palette {
  const pref =
    brand.colorPreference === 'Auto' ? defaults[category] || 'Purple' : brand.colorPreference;
  let primary =
    brand.colorPreference === 'Auto' && marketplacePalettes[category]?.length
      ? marketplacePalettes[category]![index % marketplacePalettes[category]!.length]
      : pref === 'Custom' && validHex(brand.customColor)
        ? brand.customColor
        : swatches[pref] || swatches.Purple;
  const mono = pref === 'Monochrome' || pref === 'Black';
  if (index % 7 === 2 || index % 7 === 4) primary = mix(primary, '#15121e', 0.17);
  const secondary = mono
    ? '#777780'
    : category === 'Food'
      ? '#56316c'
      : category === 'Finance'
        ? '#167a6d'
        : category === 'Education'
          ? ['#3156c8', '#0f766e', '#f97316', '#7c3aed'][index % 4]
          : brand.personality.includes('Organic')
            ? '#36583d'
            : mix(primary, '#111827', 0.25);
  return {
    primary,
    secondary,
    accent: mono
      ? '#bdbdc6'
      : category === 'Food'
        ? '#65913b'
        : ['#f59e0b', '#38bdf8', '#fb7185', '#a3e635'][index % 4],
    background: mix(primary, '#ffffff', index % 5 === 0 ? 0.92 : 0.955),
    ink: '#24212d',
  };
}
