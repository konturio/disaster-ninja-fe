import { configRepo } from '~core/config';
import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { apiClient } from '~core/apiClientInstance';
import { createNumberAtom } from '~utils/atoms/createPrimitives';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import {
  ACAPS_LAYER_ID,
  ACAPS_SIMPLE_LAYER_ID,
  HOT_PROJECTS_LAYER_ID,
} from '../constants';
import { CURRENT_FEATURES_PANEL_LAYER_ID } from '../components/LayerFeaturesPanel';
import { getHotProjectsPanelData } from './hotProjects_outlines';
import { getAcapsFeatureCards } from './acapsToFeatureCards';
import { ACAPS_MOCK } from './mocks/acaps_mock';
import type { FeatureCardCfg } from '../components/CardElements';

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

    onChange('focusedGeometryAtom', (fg) => {
      // @ts-expect-error needs better atom type
      currentFeatureIdAtom.set.dispatch(undefined);
      state = null;
      const enabledLayers = get('enabledLayersAtom');
      if (!enabledLayers.has(HOT_PROJECTS_LAYER_ID)) {
        return;
      }
      if (!isGeoJSONEmpty(fg?.geometry))
        schedule(async (dispatch) => {
          const response = await getFeatureCollection(
            fg?.geometry,
            CURRENT_FEATURES_PANEL_LAYER_ID,
          );
          const panelData = transformFeaturesToPanelData(response);
          dispatch(create('_setState', panelData));
        });
    });

    onChange('mountedLayersAtom', (ml) => {
      if (!ml.has(HOT_PROJECTS_LAYER_ID)) {
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
              CURRENT_FEATURES_PANEL_LAYER_ID,
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
  switch (CURRENT_FEATURES_PANEL_LAYER_ID) {
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
