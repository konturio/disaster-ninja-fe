import { atom, reatomResource, withDataAtom, withErrorAtom } from '@reatom/framework';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { i18n } from '~core/localization';
import { getLayerFeatures } from '~core/api/layers';
import { layerFeaturesFiltersAtom } from './layerFeaturesFiltersAtom';
import { getBBoxForLayerFeature } from './helpers/getBBoxForFeature';
import { sortFeaturesPanelItems } from './helpers/sortFeaturesPanelItems';
import { getLayerFeaturesPreprocessor } from './helpers/layerFeaturesPreprocessors';
import type { FeaturesPanelItem } from '../components/LayerFeaturesPanel/types';
import type { LayerFeaturesPanelConfig } from '../types/layerFeaturesPanel';
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

export const layerFeaturesCollectionAtom = atom<{
  data: FeaturesPanelItem[] | null;
  loading: boolean;
}>((ctx) => {
  const layerFeatures = ctx.spy(fetchLayerFeaturesResource.dataAtom);
  const loading = ctx.spy(fetchLayerFeaturesResource.pendingAtom) > 0;
  const transformedLaterFeatures = layerFeatures
    ? transformFeaturesToPanelData(layerFeatures)
    : null;
  if (transformedLaterFeatures) {
    sortFeaturesPanelItems(transformedLaterFeatures, featuresPanelLayerId);
  }
  return { data: transformedLaterFeatures, loading };
}, 'layerFeaturesCollectionAtom');

function transformFeaturesToPanelData(featuresList: Feature[]): FeaturesPanelItem[] {
  const preprocessedFeatures = featuresList.map((f) =>
    getLayerFeaturesPreprocessor(featuresPanelLayerId)(f),
  );
  return preprocessedFeatures.map((f) => ({
    properties: f.properties ?? {},
    id: f.id,
    focus: getBBoxForLayerFeature(f, featuresPanelLayerId),
  }));
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
