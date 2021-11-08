import { createBindAtom } from '~utils/atoms/createBindAtom';
import { UrlData } from '../types';
import {
  currentEventAtom,
  currentEpisodeAtom,
  currentMapPositionAtom,
  enabledUserLayersAtom,
} from '~core/shared_state';

/* Compose shared state values into one atom */
export const selectedDataAtom = createBindAtom(
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
          Number(currentMapPosition.zoom.toFixed(3)),
          Number(currentMapPosition.lng.toFixed(3)),
          Number(currentMapPosition.lat.toFixed(3)),
        ]
      : undefined;

    const currentEvent = get('currentEventAtom');
    newState.event = currentEvent ? currentEvent.id : undefined;

    const currentEpisode = get('currentEpisodeAtom');
    newState.episode = currentEpisode ? currentEpisode.id : undefined;

    const enabledLayers = get('enabledUserLayersAtom');
    if (enabledLayers.length > 0) {
      newState.layers = enabledLayers;
    }
    return newState;
  },
  'selectedDataAtom',
);
