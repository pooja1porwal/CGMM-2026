export function validHex(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}
export function hexToRgb(hex: string) {
  const h = validHex(hex) ? hex : '#703ee8';
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
}
export function luminance(hex: string) {
  const c = Object.values(hexToRgb(hex)).map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
export function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function inkOn(background: string) {
  if (contrast(background, '#202026') >= 4.5) return '#202026';
  return contrast(background, '#ffffff') >= 4.5 ? '#ffffff' : '#000000';
}
export function mix(a: string, b: string, t: number) {
  const x = hexToRgb(a),
    y = hexToRgb(b);
  return (
    '#' +
    (['r', 'g', 'b'] as const)
      .map((k) =>
        Math.round(x[k] + (y[k] - x[k]) * t)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}
