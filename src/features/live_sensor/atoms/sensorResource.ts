import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';

export const sensorResourceAtom = createAsyncAtom(
  null,
  async (sensorFeatures, abortController) => {
    if (!sensorFeatures.features.length) return null;

    try {
      await apiClient.post('/features/live-sensor', sensorFeatures, true, {
        signal: abortController.signal,
      });

      return 'ok';
    } catch (error) {
      console.warn(error);
      return 'error';
    }
  },
  'SensorResourceAtom',
);
