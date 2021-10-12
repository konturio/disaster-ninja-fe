import { createAtom } from '@reatom/core';
import { UrlData } from '../types';
import {
  currentEventAtom,
  currentEpisodeAtom,
  currentMapPositionAtom,
  enabledUserLayersAtom,
} from '~core/shared_state';

/* Compose shared state values into one atom */
export const selectedDataAtom = createAtom(
  {
    currentMapPositionAtom,
    currentEventAtom,
    currentEpisodeAtom,
    enabledUserLayersAtom,
  },
  ({ get }, state: UrlData = {}) => {
    const newState = { ...state };
    const currentMapPosition = get('currentMapPositionAtom');
    newState.map = currentMapPosition
      ? [
          currentMapPosition.zoom,
          currentMapPosition.lng,
          currentMapPosition.lat,
        ]
      : undefined;

    const currentEvent = get('currentEventAtom');
    newState.event = currentEvent ? currentEvent.id : undefined;

    const currentEpisode = get('currentEpisodeAtom');
    newState.episode = currentEpisode ? currentEpisode.id : undefined;

    const enabledLayers = get('enabledUserLayersAtom');
    newState.layers = enabledLayers;
    return newState;
  },
);
