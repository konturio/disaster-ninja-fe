import { createAtom } from '@reatom/core';
import { eventListResourceAtom } from '~features/events_list/atoms/eventListResource';
import { getPaddings } from '~utils/map/cameraForGeometry';
import { currentEventAtom } from './currentEvent';

export const currentEventBbox = createAtom(
  {
    currentEventAtom,
    eventListResourceAtom,
    fitBounds: () => null,
  },
  ({ get, onAction }) => {
    const currentEvent = get('currentEventAtom');

    if (!currentEvent) return null;

    const eventListResource = get('eventListResourceAtom');

    if (!eventListResource || !eventListResource.data) return null;

    const eventData = eventListResource.data.find(
      (event) => event.eventId === currentEvent.id,
    );

    if (!eventData) throw new Error('Event not found');

    const bbox = eventData.bbox;

    onAction('fitBounds', () => {
      const map = globalThis.KONTUR_MAP;

      if (!map) throw new Error('Map not found');

      map.fitBounds(bbox, { padding: getPaddings() });
    });

    return bbox;
  },
);
