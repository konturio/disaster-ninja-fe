import { atom, reatomResource, withDataAtom, withErrorAtom } from '@reatom/framework';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { i18n } from '~core/localization';
import { getLayerFeatures } from '~core/api/layers';
import {
  ACAPS_LAYER_ID,
  ACAPS_SIMPLE_LAYER_ID,
  HOT_PROJECTS_LAYER_ID,
  LAYERS_REQUIRED_BY_FEATURE_PANEL,
} from '../constants';
import { getHotProjectsPanelData } from './helpers/hotProjects_outlines';
import { getAcapsPanelData } from './helpers/acaps';
import type { LayerFeaturesPanelConfig } from '../types/layerFeaturesPanel';
import type { FeatureCardCfg } from '../components/CardElements';
import type { Feature } from 'geojson';

const featuresPanelConfig = configRepo.get().features[AppFeature.LAYER_FEATURES_PANEL];
export const featuresPanelLayerId: string =
  featuresPanelConfig && typeof featuresPanelConfig === 'object'
    ? (featuresPanelConfig as LayerFeaturesPanelConfig).layerId
    : '';
const isLayerMustBeEnabled =
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
      return getAcapsPanelData(featuresList);
    default:
      return [];
  }
}

const fetchLayerFeaturesResource = reatomResource<Feature[] | null>(async (ctx) => {
  const mountedLayers = ctx.spy(enabledLayersAtom.v3atom);
  const focusedGeoJSON = ctx.spy(focusedGeometryAtom.v3atom)?.geometry;
  currentFeatureIdAtom(ctx, undefined);
  if (isLayerMustBeEnabled && !mountedLayers.has(featuresPanelLayerId)) {
    return null;
  }
  if (!featuresPanelLayerId || !focusedGeoJSON || isGeoJSONEmpty(focusedGeoJSON)) {
    return null;
  }
  let responseData: Feature[] | null;
  try {
    responseData = await getLayerFeatures(
      featuresPanelLayerId,
      focusedGeoJSON,
      ctx.controller,
    );
  } catch (e: unknown) {
    throw new Error(i18n.t('layer_features_panel.error_loading'));
  }
  // in case there is no error but response data is empty
  if (!responseData?.length) {
    throw new Error(i18n.t('layer_features_panel.no_features'));
  }
  return responseData;
}, 'fetchLayerFeaturesResource').pipe(withDataAtom(null), withErrorAtom());
