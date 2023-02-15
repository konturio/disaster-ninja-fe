import { createAtom } from '~utils/atoms';
import { collectedPointsAtom } from './collectedPoints';
import { sensorResourceAtom } from './sensorResource';

export const resourceWatcherAtom = createAtom(
  {
    sensorResourceAtom,
  },
  ({ schedule, onChange }, state = null) => {
    onChange('sensorResourceAtom', (res) => {
      if (!res.loading && res.data === 'ok') {
        schedule((dispatch) => dispatch(collectedPointsAtom.resetFeatures()));
        // don't reset on error (keep collection)
      }
    });

    return state;
  },
  'resourceWatcherAtom',
);
