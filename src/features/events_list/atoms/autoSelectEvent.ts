import { createAtom } from '~utils/atoms';
import { currentEventAtom, focusedGeometryAtom } from '~core/shared_state';
import { scheduledAutoSelect } from '~core/shared_state/currentEvent';
import { eventListResourceAtom } from './eventListResource';

export const autoSelectEvent = createAtom(
  {
    eventListResourceAtom,
  },
  ({ getUnlistedState, schedule, onChange }, state = {}) => {
    onChange('eventListResourceAtom', (eventListResource) => {
      const autoSelectWasScheduled = getUnlistedState(scheduledAutoSelect);
      if (
        autoSelectWasScheduled &&
        eventListResource &&
        !eventListResource.loading &&
        !eventListResource.error &&
        eventListResource.data &&
        eventListResource.data.length
      ) {
        const firstEventInList = eventListResource.data[0];
        schedule((dispatch) => {
          dispatch([
            scheduledAutoSelect.setFalse(),
            currentEventAtom.setCurrentEventId(firstEventInList.eventId),
          ]);
        });
      }
    });

    return state;
  },
  'autoSelectEvent',
);
