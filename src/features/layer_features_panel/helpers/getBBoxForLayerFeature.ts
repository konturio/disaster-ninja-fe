import { LAYER_FEATURES_CUSTOM_FOCUS_BBOX } from '~features/layer_features_panel/constants';
import { getBboxForGeometry } from '~utils/map/camera';
import { isValidLngLatPairObject } from '~core/map';
import type { Feature } from '@turf/helpers';
import type { GeoJsonProperties, Geometry } from 'geojson';

export function getBBoxForLayerFeature(
  feature: Feature<Geometry, GeoJsonProperties>,
): [number, number, number, number] | undefined {
  const customBbox = feature.properties?.[LAYER_FEATURES_CUSTOM_FOCUS_BBOX];
  if (customBbox) {
    if (isValidLngLatPairObject(customBbox)) {
      return customBbox;
    } else {
      console.error(`Invalid custom bbox. Using feature geometry to generate bbox`);
    }
  }
  return getBboxForGeometry(feature.geometry);
}
