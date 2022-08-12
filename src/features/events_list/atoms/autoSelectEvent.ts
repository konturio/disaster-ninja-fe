import { createAtom } from '~utils/atoms';
import { currentEventAtom } from '~core/shared_state';
import {
  scheduledAutoFocus,
  scheduledAutoSelect,
} from '~core/shared_state/currentEvent';
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
        const currentEvent = getUnlistedState(currentEventAtom);
        const eventWasDeselected = currentEvent?.id === null;
        const currentEventNotInNewList =
          eventListResource.data.findIndex(
            (e) => e.eventId === currentEvent?.id,
          ) === -1;
        if (currentEventNotInNewList && !eventWasDeselected) {
          const firstEventInList = eventListResource.data[0];
          schedule((dispatch) => {
            dispatch([
              scheduledAutoSelect.setFalse(),
              scheduledAutoFocus.setTrue(),
              currentEventAtom.setCurrentEventId(firstEventInList.eventId),
            ]);
          });
        }
      }
    });

    return state;
  },
  'autoSelectEvent',
);
