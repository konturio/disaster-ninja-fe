import { focusedGeometryAtom, currentEventAtom } from '~core/shared_state';
import { eventListResourceAtom } from '~features/events_list/atoms/eventListResource'; // This is bad!
import { createBindAtom } from '~utils/atoms';
import { Event } from '~appModule/types';

export const currentEventDataAtom = createBindAtom(
  {
    // focusedGeometry: focusedGeometryAtom,
    currentEvent: currentEventAtom,
    eventList: eventListResourceAtom,
  },
  ({ get }, state: Event | null = null) => {
    // TODO
    // const focusedGeometry = get('focusedGeometry');
    // if (focusedGeometry) {
    //   return focusedGeometry.source?.meta;
    // }

    const eventListResource = get('eventList');
    if (eventListResource.data) {
      const currentEvent = get('currentEvent');
      if (currentEvent) {
        const currentEventData = eventListResource.data.find(
          (layer) => layer.id === currentEvent.id,
        );
        return currentEventData ?? null;
      }
    }
    return null;
  },
);
