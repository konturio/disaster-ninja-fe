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

    // TODO: replace with eventData.bbox when it will be available
    const bbox = [
      98.1518468440795, -0.9460759217858339, 130.028802343343, 24.717955428485666,
    ];

    onAction('fitBounds', () => {
      const map = globalThis.KONTUR_MAP;

      if (!map) throw new Error('Map not found');

      map.fitBounds(bbox, { padding: getPaddings() });
    });

    return bbox;
  },
);
