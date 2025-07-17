import { LAYER_FEATURES_CUSTOM_FOCUS_BBOX } from '~features/layer_features_panel/constants';
import type { Feature } from 'geojson';

export function hotProjectsPreprocessor(feature: Feature): Feature {
  const properties = feature.properties;
  if (properties) {
    if (properties['status'] === 'ARCHIVED') {
      properties['isArchived'] = true;
    }
    if (properties.aoiBBOX) {
      properties[LAYER_FEATURES_CUSTOM_FOCUS_BBOX] = properties.aoiBBOX;
    }
  }
  return feature;
}
