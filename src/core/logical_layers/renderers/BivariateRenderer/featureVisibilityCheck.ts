import type { FillColor } from './types';

function fillColorEmptyOrTransparent(feature: maplibregl.MapboxGeoJSONFeature) {
  const fillColor: FillColor | undefined = feature.layer.paint?.['fill-color'];
  return fillColor ? fillColor.a === 0 : true;
}

export function isFeatureVisible(feature: maplibregl.MapboxGeoJSONFeature) {
  if (fillColorEmptyOrTransparent(feature)) return false;
  /* TODO: add check for all properties */
  // if (
  //   visibilityHidden(feature) ||
  //   (fillColorEmptyOrTransparent(feature) &&
  //     lineColorEmptyOrTransparent(feature) &&
  //     textColorEmptyOrTransparent(feature))
  // ) {
  //   return false;
  // }
  return true;
}
