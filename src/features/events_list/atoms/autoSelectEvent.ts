import { createAtom } from '~utils/atoms';
import { currentEventAtom, currentNotificationAtom } from '~core/shared_state';
import { scheduledAutoFocus, scheduledAutoSelect } from '~core/shared_state/currentEvent';
import { i18n } from '~core/localization';
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
        const currentEventNotInNewList =
          eventListResource.data.findIndex((e) => e.eventId === currentEvent?.id) === -1;

        if (currentEvent?.id && currentEventNotInNewList) {
          // This case happens when call for event by provided url id didn't return event
          schedule((dispatch) =>
            dispatch(
              currentNotificationAtom.showNotification(
                'warning',
                { title: i18n.t('event_list.no_event_in_feed') },
                5,
              ),
            ),
          );
        } else if (currentEventNotInNewList) {
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
