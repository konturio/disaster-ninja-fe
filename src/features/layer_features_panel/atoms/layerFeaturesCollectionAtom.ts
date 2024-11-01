import { atom } from '@reatom/framework';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import {
  ACAPS_LAYER_ID,
  ACAPS_SIMPLE_LAYER_ID,
  HOT_PROJECTS_LAYER_ID,
  LAYERS_REQUIRED_BY_FEATURE_PANEL,
} from '../constants';
import { getHotProjectsPanelData } from './hotProjects_outlines';
import { getAcapsFeatureCards } from './acapsToFeatureCards';
import { fetchLayerFeaturesResource } from './layerFeaturesResource';
import type { LayerFeaturesPanelConfig } from '../types/layerFeaturesPanel';
import type { FeatureCardCfg } from '../components/CardElements';

// export const featuresPanelLayerId: string = ACAPS_SIMPLE_LAYER_ID;
const featuresPanelConfig = configRepo.get().features[AppFeature.LAYER_FEATURES_PANEL];
export const featuresPanelLayerId: string =
  featuresPanelConfig && typeof featuresPanelConfig === 'object'
    ? (featuresPanelConfig as LayerFeaturesPanelConfig).layerId
    : '';
export const isLayerMustBeEnabled =
  LAYERS_REQUIRED_BY_FEATURE_PANEL.includes(featuresPanelLayerId);

export const currentFeatureIdAtom = atom<number | undefined>(
  undefined,
  'currentFeatureIdAtom',
);

export const layerFeaturesCollectionAtom = atom<FeatureCardCfg[] | null>((ctx) => {
  const layerFeatures = ctx.spy(fetchLayerFeaturesResource.dataAtom);
  const isLoading = ctx.spy(fetchLayerFeaturesResource.pendingAtom);
  if (isLoading) {
    return null;
  }
  return layerFeatures ? transformFeaturesToPanelData(layerFeatures) : null;
}, 'layerFeaturesCollectionAtom');

function transformFeaturesToPanelData(featuresList: object): FeatureCardCfg[] {
  switch (featuresPanelLayerId) {
    case HOT_PROJECTS_LAYER_ID:
      return getHotProjectsPanelData(featuresList);
    case ACAPS_LAYER_ID:
    case ACAPS_SIMPLE_LAYER_ID:
      return getAcapsFeatureCards(featuresList);
    default:
      return [];
  }
}
