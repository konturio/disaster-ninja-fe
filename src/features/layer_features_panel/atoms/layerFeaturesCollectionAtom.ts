import { configRepo } from '~core/config';
import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { apiClient } from '~core/apiClientInstance';
import { createNumberAtom } from '~utils/atoms/createPrimitives';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { FEATURESPANEL_LAYER_ID } from '../constants';
import { getPanelData } from './hotProjects_outlines';
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
      if (!enabledLayers.has(FEATURESPANEL_LAYER_ID)) {
        return;
      }
      if (!isGeoJSONEmpty(fg?.geometry))
        schedule(async (dispatch) => {
          const response = await getFeatureCollection(fg?.geometry);
          const panelData = getPanelData(response) as FeatureCardCfg[];
          dispatch(create('_setState', panelData));
        });
    });

    onChange('mountedLayersAtom', (ml) => {
      if (!ml.has(FEATURESPANEL_LAYER_ID)) {
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
            const response = await getFeatureCollection(fg?.geometry);
            const panelData = getPanelData(response) as FeatureCardCfg[];
            dispatch(create('_setState', panelData));
          });
      }
    });

    return state;
  },
  'layerFeaturesCollectionAtom',
);

export async function getFeatureCollection(geometry) {
  const features = await apiClient.post(
    `/layers/${FEATURESPANEL_LAYER_ID}/items/search`,
    {
      appId: configRepo.get().id,
      geoJSON: geometry,
    },
  );
  return features ?? [];
}
