import { describe, it, expect, afterEach, vi } from 'vitest';
import { rasterBlob, safeName } from './exportUtils';
describe('raster export pipeline', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
  it.each(['png', 'jpeg'] as const)(
    'rasterizes %s at 1800 × 1200 and fills JPEG white',
    async (format) => {
      const ctx = { fillStyle: '', fillRect: vi.fn(), drawImage: vi.fn() },
        canvas = {
          width: 0,
          height: 0,
          getContext: () => ctx,
          toBlob: (fn: (b: Blob) => void, type: string) => fn(new Blob(['raster'], { type })),
        };
      vi.stubGlobal('document', {
        fonts: { ready: Promise.resolve() },
        createElement: () => canvas,
      });
      vi.stubGlobal(
        'Image',
        class {
          onload: () => void = () => {};
          set src(_s: string) {
            queueMicrotask(() => this.onload());
          }
        },
      );
      const revoke = vi.spyOn(URL, 'revokeObjectURL');
      const result = await rasterBlob('<svg xmlns="http://www.w3.org/2000/svg"/>', format);
      expect(canvas.width).toBe(1800);
      expect(canvas.height).toBe(1200);
      expect(ctx.drawImage).toHaveBeenCalledOnce();
      expect(ctx.fillRect).toHaveBeenCalledTimes(format === 'jpeg' ? 1 : 0);
      expect(result.type).toBe('image/' + format);
      expect(revoke).toHaveBeenCalledOnce();
    },
  );
  it('cleans up object URLs after a decode failure', async () => {
    vi.stubGlobal('document', { fonts: { ready: Promise.resolve() } });
    vi.stubGlobal(
      'Image',
      class {
        onerror: () => void = () => {};
        set src(_s: string) {
          queueMicrotask(() => this.onerror());
        }
      },
    );
    const revoke = vi.spyOn(URL, 'revokeObjectURL');
    await expect(rasterBlob('broken', 'png')).rejects.toThrow('could not rasterize');
    expect(revoke).toHaveBeenCalledOnce();
  });
  it('sanitizes export names without removing non-Latin letters', () => {
    expect(safeName('../../My Brand <test>')).toBe('My-Brand-test');
    expect(safeName('ब्रांड')).not.toBe('brandforge-logo');
  });
});
