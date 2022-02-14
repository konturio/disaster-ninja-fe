import { createBindAtom } from '~utils/atoms/createBindAtom';
import { eventListResourceAtom } from './eventListResource';
import { currentEventAtom, focusedGeometryAtom } from '~core/shared_state';
import { Event } from '~core/types';

export const autoSelectEvent = createBindAtom(
  {
    eventListResourceAtom
  },
  ({ get, schedule, getUnlistedState }, state = {}) => {
    const eventListResource = get('eventListResourceAtom');
    const currentEvent = getUnlistedState(currentEventAtom);
    const focusedGeometry = getUnlistedState(focusedGeometryAtom);
    const firstEventInList =
      eventListResource.data &&
      eventListResource.data.length > 0 &&
      eventListResource.data[0];

    const focusedGeometryCheck = focusedGeometry === null
      || (focusedGeometry.source.type === 'event'
        && !eventListResource.data?.find((ev: Event) => ev.eventId === focusedGeometry.source['meta']?.eventId));
    if (currentEvent === null && firstEventInList && focusedGeometryCheck) {
      schedule((dispatch) => {
        dispatch(currentEventAtom.setCurrentEventId(firstEventInList.eventId));
      });
    }

    return state;
  },
  'autoSelectEvent',
);
