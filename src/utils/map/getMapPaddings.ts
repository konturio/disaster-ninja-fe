import { configRepo } from '~core/config';
import type { PaddingOptions } from 'maplibre-gl';

export function getMapPaddings(map: maplibregl.Map, debug = false): PaddingOptions {
  const blankSpaceEl = document.getElementById(configRepo.get().mapBlankSpaceId);
  if (blankSpaceEl === null) {
    console.warn('getMapPaddings::Cannot find map blank space element');
    return {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    };
  }

  const mapCanvasEl = map._canvas;
  if (!mapCanvasEl) {
    console.warn('getMapPaddings::Cannot find map canvas element');
    return {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    };
  }

  const blankRect = blankSpaceEl.getBoundingClientRect();
  const mapRect = mapCanvasEl.getBoundingClientRect();

  const top = Math.max(blankRect.top - mapRect.top, 0);
  const right = Math.max(mapRect.right - blankRect.right, 0);
  const bottom = Math.max(mapRect.bottom - blankRect.bottom, 0);
  const left = Math.max(blankRect.left - mapRect.left, 0);

  /* Shows visually calculated paddings */
  if (import.meta.env.DEV) {
    if (debug) {
      const debugEl = document.createElement('div');
      debugEl.setAttribute(
        'style',
        `position: absolute; border: 1px solid red; top: ${top}px; left: ${left}px; right: ${right}px; bottom: ${bottom}px; background-color: hsla(0, 50%, 50%, 0.1)`,
      );
      mapCanvasEl.parentElement?.setAttribute(
        'style',
        'position: relative; width: 100%; height: 100%;',
      );
      mapCanvasEl.parentElement?.appendChild(debugEl);
    }
  }

  return { top, right, bottom, left };
}
