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
  OAM_LAYER_ID,
} from '../constants';
import { getHotProjectsPanelData } from './helpers/hotProjects_outlines';
import { getAcapsPanelData } from './helpers/acaps';
import { getOAMPanelData } from './helpers/openaerialmap';
import { layerFeaturesFiltersAtom } from './layerFeaturesFiltersAtom';
import type { LayerFeaturesPanelConfig } from '../types/layerFeaturesPanel';
import type { FeatureCardCfg } from '../components/CardElements';
import type { Feature } from 'geojson';

const panelFeature = configRepo.get().features[AppFeature.LAYER_FEATURES_PANEL];
const layerFeaturesPanelConfig =
  panelFeature && typeof panelFeature === 'object'
    ? (panelFeature as LayerFeaturesPanelConfig)
    : null;
export const featuresPanelLayerId = layerFeaturesPanelConfig?.layerId;
const requiresEnabledLayer = layerFeaturesPanelConfig?.requiresEnabledLayer;
const requiresGeometry = layerFeaturesPanelConfig?.requiresGeometry ?? true;

export const currentFeatureIdAtom = atom<number | null>(null, 'currentFeatureIdAtom');

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
    case OAM_LAYER_ID:
      return getOAMPanelData(featuresList);
    default:
      console.error(`Layer Features panel: unsupported layerId: ${featuresPanelLayerId}`);
      return [];
  }
}

const fetchLayerFeaturesResource = reatomResource<Feature[] | null>(async (ctx) => {
  const enabledLayers = ctx.spy(enabledLayersAtom.v3atom);
  const layerFeaturesFilters = ctx.spy(layerFeaturesFiltersAtom);
  const focusedGeoJSON = ctx.spy(focusedGeometryAtom.v3atom)?.geometry;
  const geometry = layerFeaturesFilters.geometry ?? focusedGeoJSON;
  currentFeatureIdAtom(ctx, null);
  if (
    !featuresPanelLayerId ||
    (requiresGeometry && isGeoJSONEmpty(geometry)) ||
    (requiresEnabledLayer && !enabledLayers.has(featuresPanelLayerId))
  ) {
    return null;
  }
  let responseData: Feature[] | null;
  try {
    responseData = await getLayerFeatures(
      featuresPanelLayerId,
      {
        geoJSON: geometry,
        limit: layerFeaturesPanelConfig?.maxItems,
        order: layerFeaturesPanelConfig?.sortOrder,
      },
      ctx.controller,
    );
  } catch (e: unknown) {
    throw new Error(i18n.t('layer_features_panel.error_loading'));
  }
  return responseData;
}, 'fetchLayerFeaturesResource').pipe(withDataAtom(null), withErrorAtom());
