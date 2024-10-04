import { createAtom } from '~utils/atoms';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';

export const currentLocationAtom = createAtom(
  {
    set: (location: Location) => location,
  },
  ({ onAction }, state = globalThis.location) => {
    onAction('set', (location) => {
      state = location;
    });

    dispatchMetricsEvent(`view_${state.pathname.replace(/^\//, '')}`);
    return state;
  },
  'currentLocationAtom',
);
