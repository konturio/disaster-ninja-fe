import turfBbox from '@turf/bbox';
import { getMapPaddings } from './getMapPaddings';

export function getCameraForGeometry(
  geojson: GeoJSON.GeoJSON,
  map: maplibregl.Map | null,
) {
  if (!map) return;
  const bbox = getBboxForGeometry(geojson);
  if (!bbox) return;
  const camera = getCameraForBbox(bbox, map);
  return camera;
}

export function getBboxForGeometry(
  geojson: GeoJSON.GeoJSON,
): [number, number, number, number] | undefined {
  let bbox: [number, number, number, number];
  try {
    // Turf can return 3d bbox, so we need to cut off potential extra data
    // Turf also check if geojson is valid
    bbox = turfBbox(geojson) as [number, number, number, number];
    bbox.length = 4;
  } catch (error) {
    console.error('Not a valid geojson file');
    return;
  }
  return bbox;
}

export function getCameraForBbox(bbox: maplibregl.LngLatBoundsLike, map: maplibregl.Map) {
  const camera = map.cameraForBounds(bbox, {
    padding: getMapPaddings(map),
  });
  if (!camera) {
    // in case we didn't get camera with paddings lets try to get them at least without paddings
    // (flawed focus better then no focus at all)
    return map.cameraForBounds(bbox);
  }
  return camera;
}
