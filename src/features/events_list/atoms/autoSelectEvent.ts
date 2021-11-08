import { createBindAtom } from '~utils/atoms/createBindAtom';
import { eventListResourceAtom } from './eventListResource';
import { currentEventAtom, focusedGeometryAtom } from '~core/shared_state';

export const autoSelectEvent = createBindAtom(
  {
    eventListResourceAtom,
    currentEventAtom,
    focusedGeometryAtom,
  },
  ({ get }, state = {}) => {
    const eventListResource = get('eventListResourceAtom');
    const currentEvent = get('currentEventAtom');
    const focusedGeometry = get('focusedGeometryAtom');
    const firstEventInList =
      eventListResource.data &&
      eventListResource.data.length > 0 &&
      eventListResource.data[0];

    if (currentEvent === null && firstEventInList && focusedGeometry === null) {
      currentEventAtom.setCurrentEventId.dispatch(firstEventInList.eventId);
    }

    return state;
  },
  'autoSelectEvent',
);
