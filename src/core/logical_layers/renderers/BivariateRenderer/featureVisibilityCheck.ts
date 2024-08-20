import type { RGBAColor } from '~core/types/color';

function fillColorEmptyOrTransparent(feature: maplibregl.MapGeoJSONFeature) {
  const fillColor: RGBAColor | undefined = feature.layer.paint?.['fill-color'];
  return fillColor ? fillColor.a === 0 : true;
}

export function isFeatureVisible(feature: maplibregl.MapGeoJSONFeature) {
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
