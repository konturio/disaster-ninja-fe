import { HOT_PROJECTS_LAYER_ID } from '~features/layer_features_panel/constants';
import { hotProjectsPreprocessor } from './preprocessors/hotProjectsPreprocessor';

export type LayerFeaturesPreprocessor = (properties: object) => object;
const defaultFeaturesPreprocessor = (properties: object) => properties;

const layerFeaturesPreprocessors: Record<string, LayerFeaturesPreprocessor> = {
  [HOT_PROJECTS_LAYER_ID]: hotProjectsPreprocessor,
};

export function getLayerFeaturesPreprocessor(
  layerFeaturesPanelId: string | undefined,
): LayerFeaturesPreprocessor {
  return layerFeaturesPanelId && layerFeaturesPreprocessors[layerFeaturesPanelId]
    ? layerFeaturesPreprocessors[layerFeaturesPanelId]
    : defaultFeaturesPreprocessor;
}
