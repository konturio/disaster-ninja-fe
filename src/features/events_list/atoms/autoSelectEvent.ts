import { createBindAtom } from '~utils/atoms/createBindAtom';
import { eventListResourceAtom } from './eventListResource';
import { currentEventAtom, focusedGeometryAtom } from '~core/shared_state';

export const autoSelectEvent = createBindAtom(
  {
    eventListResourceAtom,
    currentEventAtom,
    focusedGeometryAtom,
  },
  ({ get, schedule }, state = {}) => {
    const eventListResource = get('eventListResourceAtom');
    const currentEvent = get('currentEventAtom');
    const focusedGeometry = get('focusedGeometryAtom');
    const firstEventInList =
      eventListResource.data &&
      eventListResource.data.length > 0 &&
      eventListResource.data[0];

    if (currentEvent === null && firstEventInList && focusedGeometry === null) {
      schedule((dispatch) => {
        dispatch(currentEventAtom.setCurrentEventId(firstEventInList.eventId));
      });
    }

    return state;
  },
  'autoSelectEvent',
);
