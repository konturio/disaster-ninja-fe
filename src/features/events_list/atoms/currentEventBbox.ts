import { createAtom } from '@reatom/core-v2';
import { getMapPaddings } from '~utils/map/getMapPaddings';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import { currentMapAtom, currentMapPositionAtom } from '~core/shared_state';
import { eventListResourceAtom } from './eventListResource';

export const currentEventBbox = createAtom(
  {
    currentEventAtom,
    eventListResourceAtom,
    fitBounds: () => null,
  },
  ({ get, onAction, getUnlistedState, schedule }) => {
    const currentEvent = get('currentEventAtom');

    if (!currentEvent) return null;

    const eventListResource = get('eventListResourceAtom');

    if (!eventListResource.data) return null;

    const eventData = eventListResource.data.find(
      (event) => event.eventId === currentEvent.id,
    );

    if (!eventData) {
      console.error(
        `Error while fitting event bounds, event with id ${currentEvent.id} not found in event list`,
      );
      return null;
    }

    const bbox = eventData.bbox;

    onAction('fitBounds', () => {
      currentMapPositionAtom.setCurrentMapBbox.dispatch(bbox);
    });

    return bbox;
  },
  'currentEventBboxAtom',
);
