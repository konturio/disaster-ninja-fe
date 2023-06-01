import { createAtom } from '~utils/atoms';
import { currentLocationAtom } from '~core/router/atoms/currentLocation';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';

export const closeOnLocationChangeAtom = createAtom(
  {
    currentLocationAtom,
  },
  ({ onChange, schedule, getUnlistedState }) => {
    onChange('currentLocationAtom', (curr, prev) => {
      const tooltip = getUnlistedState(currentTooltipAtom);
      if (curr.pathname !== prev?.pathname && tooltip?.position) {
        schedule((dispatch) => {
          dispatch(currentTooltipAtom.resetCurrentTooltip());
        });
      }
    });
  },
  'closeOnLocationChangeAtom',
);
