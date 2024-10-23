import { configRepo } from '~core/config';
import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { apiClient } from '~core/apiClientInstance';
import { createNumberAtom } from '~utils/atoms/createPrimitives';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { AppFeature } from '~core/app/types';
import {
  ACAPS_LAYER_ID,
  ACAPS_SIMPLE_LAYER_ID,
  HOT_PROJECTS_LAYER_ID,
} from '../constants';
import { getHotProjectsPanelData } from './hotProjects_outlines';
import { getAcapsFeatureCards } from './acapsToFeatureCards';
import { ACAPS_MOCK } from './mocks/acaps_mock';
import type { LayerFeaturesPanelConfig } from '../types/layerFeaturesPanel';
import type { FeatureCardCfg } from '../components/CardElements';

// export const featuresPanelLayerId: string = ACAPS_SIMPLE_LAYER_ID;
const featuresPanelConfig = configRepo.get().features[AppFeature.LAYER_FEATURES_PANEL];
export const featuresPanelLayerId: string =
  featuresPanelConfig && typeof featuresPanelConfig === 'object'
    ? (featuresPanelConfig as LayerFeaturesPanelConfig).layerId
    : '';

export const currentFeatureIdAtom = createNumberAtom(undefined, 'currentFeatureIdAtom');
export const layerFeaturesCollectionAtom = createAtom(
  {
    enabledLayersAtom,
    mountedLayersAtom,
    focusedGeometryAtom,
    _setState: (state: FeatureCardCfg[]) => state,
    reset: () => {},
    loadFeaturesForSelection: () => {},
  },
  (
    { get, schedule, create, onAction, onChange },
    state: FeatureCardCfg[] | null = null,
  ) => {
    onAction('_setState', (newState) => {
      state = [...newState];
    });

    onAction('reset', () => {
      // @ts-expect-error needs better atom type
      currentFeatureIdAtom.set.dispatch(undefined);
      state = null;
    });

    onChange('focusedGeometryAtom', (focusedGeometry) => {
      // @ts-expect-error needs better atom type
      currentFeatureIdAtom.set.dispatch(undefined);
      state = null;
      const enabledLayers = get('enabledLayersAtom');
      if (!enabledLayers.has(featuresPanelLayerId)) {
        return;
      }
      if (!isGeoJSONEmpty(focusedGeometry?.geometry))
        schedule(async (dispatch) => {
          const response = await getFeatureCollection(
            focusedGeometry?.geometry,
            featuresPanelLayerId,
          );
          const panelData = transformFeaturesToPanelData(response);
          dispatch(create('_setState', panelData));
        });
    });

    onChange('mountedLayersAtom', (mountedLayers) => {
      if (!mountedLayers.has(featuresPanelLayerId)) {
        // @ts-expect-error needs better atom type
        currentFeatureIdAtom.set.dispatch(undefined);
        state = null;
      } else if (state === null) {
        // layer is mounted
        const fg = get('focusedGeometryAtom');
        if (!isGeoJSONEmpty(fg?.geometry))
          schedule(async (dispatch) => {
            // @ts-expect-error needs better atom type
            currentFeatureIdAtom.set.dispatch(undefined);
            const response = await getFeatureCollection(
              fg?.geometry,
              featuresPanelLayerId,
            );
            const panelData = transformFeaturesToPanelData(response);
            dispatch(create('_setState', panelData));
          });
      }
    });

    return state;
  },
  'layerFeaturesCollectionAtom',
);

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

export async function getFeatureCollection(geometry, layerId: string) {
  // TODO: delete when mocks are no longer needed
  // if (layerId === ACAPS_SIMPLE_LAYER_ID) {
  //   return ACAPS_MOCK;
  // }
  const features = await apiClient.post(
    `/layers/${layerId}/items/search`,
    {
      appId: configRepo.get().id,
      geoJSON: geometry,
    },
    true,
  );
  return features ?? [];
}
