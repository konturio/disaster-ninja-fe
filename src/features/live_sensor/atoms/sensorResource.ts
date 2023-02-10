import { apiClient } from '~core/apiClientInstance';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { createNumberAtom } from '~utils/atoms/createPrimitives';
import { UPDATE_ENDPOINT_PATH } from '../constants';
import { collectedPointsAtom } from './collectedPoints';
import type { FeatureCollection } from '~utils/geoJSON/helpers';

// Here from those 3 atom block we want to send data at arbitrary intervals

export const resourceTriggerAtom = createNumberAtom(0, 'resourceTriggerAtom');
export const triggerRequestAction = resourceTriggerAtom.increment;
export type TriggerRequestActionType = typeof triggerRequestAction;

const resourceDepsAtom = createAtom(
  {
    resourceTriggerAtom,
  },
  ({ get, getUnlistedState, schedule }, state: FeatureCollection | null = null) => {
    const trigger = get('resourceTriggerAtom');
    if (trigger === 0) return state;

    const newState = getUnlistedState(collectedPointsAtom);
    state = { ...newState };

    if (state?.features.length) {
      // schedule an effect to clear collected points after request was triggered
      schedule((dispatch) => dispatch(collectedPointsAtom.reset()));
    }
    return state;
  },
);

export const sensorResourceAtom = createAsyncAtom(
  resourceDepsAtom,
  async (sensorFeatures, abortController) => {
    if (!sensorFeatures.features.length) return null;

    return await apiClient.post(
      UPDATE_ENDPOINT_PATH,
      {
        ...sensorFeatures,
      },
      true,
      {
        signal: abortController.signal,
      },
    );
  },
  'Sensor_resource_atom',
);
