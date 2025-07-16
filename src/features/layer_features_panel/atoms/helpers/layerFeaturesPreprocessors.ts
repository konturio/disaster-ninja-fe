import {
  ACAPS_LAYER_ID,
  ACAPS_SIMPLE_LAYER_ID,
  HOT_PROJECTS_LAYER_ID,
} from '~features/layer_features_panel/constants';
import { hotProjectsPreprocessor } from './preprocessors/hotProjectsPreprocessor';
import { acapsPreprocessor } from './preprocessors/acapsPreprocessor';
import type { Feature } from 'geojson';

export type LayerFeaturesPreprocessor = (feature: Feature) => Feature;
const defaultFeaturesPreprocessor = (feature: Feature) => feature;

const layerFeaturesPreprocessors: Record<string, LayerFeaturesPreprocessor> = {
  [HOT_PROJECTS_LAYER_ID]: hotProjectsPreprocessor,
  [ACAPS_LAYER_ID]: acapsPreprocessor,
  [ACAPS_SIMPLE_LAYER_ID]: acapsPreprocessor,
};

export function getLayerFeaturesPreprocessor(
  layerFeaturesPanelId: string | undefined,
): LayerFeaturesPreprocessor {
  return layerFeaturesPanelId && layerFeaturesPreprocessors[layerFeaturesPanelId]
    ? layerFeaturesPreprocessors[layerFeaturesPanelId]
    : defaultFeaturesPreprocessor;
}
