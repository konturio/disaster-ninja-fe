import { reatomResource, withDataAtom, withErrorAtom } from '@reatom/framework';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { getLayerFeatures } from '~core/api/layers';
import { i18n } from '~core/localization';
import { enabledLayersAtom } from '~features/bivariate_manager/meta';
import {
  currentFeatureIdAtom,
  featuresPanelLayerId,
  isLayerMustBeEnabled,
} from './layerFeaturesCollectionAtom';
import type { Feature } from 'geojson';

export const fetchLayerFeaturesResource = reatomResource<Feature[] | null>(
  async (ctx) => {
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
  },
  'fetchLayerFeaturesResource',
).pipe(withDataAtom(null), withErrorAtom());
