import { createAtom } from '@reatom/core';
import { getPaddings } from '~utils/map/cameraForGeometry';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import { eventListResourceAtom } from './eventListResource';

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

    if (!eventData) {
      console.error(
        `Error while fitting event bounds, event with id ${currentEvent.id} not found in event list`,
      );
      return;
    }

    const bbox = eventData.bbox;

    onAction('fitBounds', () => {
      const map = globalThis.KONTUR_MAP;

      if (!map) {
        console.error(`Error while fitting event bounds, map not found`);
        return;
      }

      map.fitBounds(bbox, { padding: getPaddings() });
    });

    return bbox;
  },
);
