import { createAtom } from '~utils/atoms';
import { currentMapAtom } from '~core/shared_state';
import { notificationServiceInstance as notification } from '~core/notificationServiceInstance';
import { i18n } from '~core/localization';

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
        notification.warning({
          title: i18n.t("Can't use map as filter"),
          description: i18n.t('Map not ready yet, try later'),
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
