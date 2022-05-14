import { createAtom } from '~utils/atoms';
import { eventListResourceAtom } from './eventListResource';
import { currentEventAtom, focusedGeometryAtom } from '~core/shared_state';

export const autoSelectEvent = createAtom(
  {
    eventListResourceAtom,
    focusedGeometryAtom,
  },
  ({ getUnlistedState, schedule, onChange }, state = {}) => {
    onChange('eventListResourceAtom', (eventListResource) => {
      if (
        eventListResource &&
        !eventListResource.loading &&
        !eventListResource.error &&
        eventListResource.data &&
        eventListResource.data.length
      ) {
        const firstEventInList = eventListResource.data[0];
        const focusedGeometry = getUnlistedState(focusedGeometryAtom);
        const currentEvent = getUnlistedState(currentEventAtom);
        if (
          currentEvent === null &&
          (focusedGeometry === null || focusedGeometry.source?.type === 'event')
        ) {
          schedule((dispatch) => {
            dispatch(
              currentEventAtom.setCurrentEventId(firstEventInList.eventId),
            );
          });
        }
      }
    });

    onChange('focusedGeometryAtom', (focusedGeometry) => {
      if (focusedGeometry === null) {
        const currentEvent = getUnlistedState(currentEventAtom);
        if (currentEvent === null) {
          const eventListResource = getUnlistedState(eventListResourceAtom);
          if (
            eventListResource &&
            !eventListResource.loading &&
            !eventListResource.error &&
            eventListResource.data &&
            eventListResource.data.length
          ) {
            const firstEventInList = eventListResource.data[0];
            schedule((dispatch) => {
              dispatch(
                currentEventAtom.setCurrentEventId(firstEventInList.eventId),
              );
            });
          }
        }
      }
    });

    return state;
  },
  'autoSelectEvent',
);
