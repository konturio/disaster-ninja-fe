import { apiClient } from '~core/apiClientInstance';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { UPDATE_ENDPOINT_PATH } from '../constants';
import { collectedPointsAtom } from './collectedPoints';
import { sensorDataAtom } from './sensorData';

const sensorResourceAtom = createAsyncAtom(
  null,
  async (sensorFeatures, abortController) => {
    if (!sensorFeatures.features.length) return null;

    try {
      await apiClient.post(
        UPDATE_ENDPOINT_PATH,
        {
          ...sensorFeatures,
        },
        true,
        {
          signal: abortController.signal,
        },
      );

      return 'ok';
    } catch (error) {
      console.warn(error);
      return 'error';
    }
  },
  'SensorResourceAtom',
);

export const requestHandlingAtom = createAtom(
  {
    sensorResourceAtom,
    triggerRequest: () => null,
  },
  ({ getUnlistedState, schedule, onChange, onAction }, state = null) => {
    const featureCollection = { ...getUnlistedState(collectedPointsAtom) };

    onAction('triggerRequest', () => {
      schedule((dispatch) =>
        dispatch([
          sensorResourceAtom.request(featureCollection),
          sensorDataAtom.resetAllData(),
        ]),
      );
    });

    onChange('sensorResourceAtom', (res) => {
      if (!res.loading && res.data === 'ok') {
        schedule((dispatch) => dispatch(collectedPointsAtom.resetFeatures()));
        // don't reset on error (keep collection)
      }
    });

    return state;
  },
  'requestHandlingAtom',
);
