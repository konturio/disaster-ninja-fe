import { createAtom } from '~utils/atoms';
import { collectedPointsAtom } from './collectedPoints';
import { sensorDataAtom } from './sensorData';
import { sensorResourceAtom } from './sensorResource';

export const resourceHandlingAtom = createAtom(
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
  'resourceHandlingAtom',
);
