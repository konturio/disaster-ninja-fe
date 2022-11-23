import { createAtom } from '~core/store/atoms';
import { currentMapAtom } from '~core/shared_state';
import core from '~core/index';

export const eventListFilters = createAtom(
  {
    setBBoxFilterFromCurrentMapView: () => null,
    resetBboxFilter: () => null,
  },
  (
    { onAction, getUnlistedState },
    state: {
      bbox: [number, number, number, number] | null;
    } = { bbox: null },
  ) => {
    onAction('setBBoxFilterFromCurrentMapView', () => {
      const map = getUnlistedState(currentMapAtom);
      if (map) {
        const currentViewBbox = map.getBounds().toArray();
        state = {
          ...state,
          bbox: [
            currentViewBbox[0][0],
            currentViewBbox[0][1],
            currentViewBbox[1][0],
            currentViewBbox[1][1],
          ],
        };
      } else {
        core.notifications.warning({
          title: core.i18n.t('event_list.warning_title'),
          description: core.i18n.t('event_list.warning_description'),
        });
      }
    });

    onAction('resetBboxFilter', () => {
      state = {
        ...state,
        bbox: null,
      };
    });

    return state;
  },
);
