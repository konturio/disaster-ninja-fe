import { LAYER_FEATURES_CUSTOM_FOCUS_BBOX } from '~features/layer_features_panel/constants';
import type { Feature } from 'geojson';

export function oamPreprocessor(feature: Feature): Feature {
  if (feature.properties?.bbox) {
    feature.properties[LAYER_FEATURES_CUSTOM_FOCUS_BBOX] = feature.properties.bbox;
  }
  return feature;
}
