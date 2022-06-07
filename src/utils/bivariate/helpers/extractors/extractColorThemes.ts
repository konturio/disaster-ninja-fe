import type { Stat, OverlayColor } from '../../types/stat.types';

export type Theme = OverlayColor[];

export function extractColors({ overlays }: Stat): Theme[] {
  return Object.values(
    overlays.reduce((acc, overlay) => {
      const hash = overlay.colors.map((c) => c.color).join();
      acc[hash] = overlay.colors;
      return acc;
    }, {}),
  );
}
