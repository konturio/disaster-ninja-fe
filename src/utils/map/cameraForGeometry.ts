import turfBbox from '@turf/bbox';
import type { PaddingOptions } from 'maplibre-gl';

function getPaddings(): PaddingOptions {
  const width = window.visualViewport.width;
  // mobile
  if (width < 960) return { left: 64, top: 44, right: 115, bottom: 0 };
  // laptop
  if (width < 1920) return { left: 348, top: 44, right: 110, bottom: 60 };
  // desktop
  return { left: 340, top: 44, right: 460, bottom: 60 };
}

export function getCameraForGeometry(
  geojson: GeoJSON.GeoJSON,
  map: maplibregl.Map | null,
) {
  if (!map) return;
  let bbox: [number, number, number, number];
  try {
    // Turf can return 3d bbox, so we need to cut off potential extra data
    // Turf also check if geojson is valid
    bbox = turfBbox(geojson) as [number, number, number, number];
    bbox.length = 4;
  } catch (error) {
    return 'Not a valid geojson file';
  }
  const camera = map.cameraForBounds(bbox, {
    padding: getPaddings(),
  });
  if (!camera) {
    // in case we didn't get camera with paddings lets try to get them at least without paddings
    // (flawed focus better then no focus at all)
    return map.cameraForBounds(bbox);
  }
  return camera;
}
