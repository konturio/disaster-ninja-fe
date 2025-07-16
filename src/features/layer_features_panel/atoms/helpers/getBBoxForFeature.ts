import {
  HOT_PROJECTS_LAYER_ID,
  OAM_LAYER_ID,
} from '~features/layer_features_panel/constants';
import { getBboxForGeometry } from '~utils/map/camera';
import type { Feature } from '@turf/helpers';
import type { GeoJsonProperties, Geometry } from 'geojson';
import type { LngLatBoundsLike } from 'maplibre-gl';

export function getBBoxForLayerFeature(
  feature: Feature<Geometry, GeoJsonProperties>,
  featuresPanelLayerId?: string,
): LngLatBoundsLike | undefined {
  switch (featuresPanelLayerId) {
    case HOT_PROJECTS_LAYER_ID:
      // TODO: add getting bbox with property accessor?
      return feature.properties?.aoiBBOX;
    case OAM_LAYER_ID:
      return feature.properties?.bbox;
    default:
      return getBboxForGeometry(feature.geometry);
  }
}
