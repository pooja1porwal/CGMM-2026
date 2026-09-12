import type { Palette } from '../types/brand';
export default function PaletteStrip({ palette }: { palette: Palette }) {
  return (
    <div className="palette-dots" aria-label="Logo color palette">
      {[palette.primary, palette.secondary, palette.accent, palette.background].map((c, i) => (
        <span key={i} style={{ background: c }} title={c} />
      ))}
    </div>
  );
}
