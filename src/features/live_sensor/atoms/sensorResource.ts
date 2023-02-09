import { apiClient } from '~core/apiClientInstance';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { createNumberAtom } from '~utils/atoms/createPrimitives';
import { UPDATE_ENDPOINT_PATH } from '../constants';
import { collectedPointsAtom } from './collectedPoints';
import type { FeatureCollection } from '~utils/geoJSON/helpers';

// Here we want to send data every each REQUESTS_INTERVAL
// Why not send it on every sensor update?
// Consider situation - we have sensors A, B
// Sensor A setted update, in 10 milliseconds sensor B setted update - we have 2 requests
// and exceeded expected requests interval.
// Also sensors have at least 60 updates per minute

export const resourceTriggerAtom = createNumberAtom(0, 'resourceTriggerAtom');

const resourceDepsAtom = createAtom(
  {
    resourceTriggerAtom,
  },
  ({ get, getUnlistedState }, state: FeatureCollection | null = null) => {
    const trigger = get('resourceTriggerAtom');
    if (trigger === 0) return state;

    state = getUnlistedState(collectedPointsAtom);

    return state;
  },
);

export const sensorResourceAtom = createAsyncAtom(
  resourceDepsAtom,
  async (sensorFeatures, abortController) => {
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
  'Sensor resource atom',
);
