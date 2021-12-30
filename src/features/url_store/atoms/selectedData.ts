import { createBindAtom } from '~utils/atoms/createBindAtom';
import { UrlData } from '../types';
import { currentEpisodeAtom, currentEventAtom, currentMapPositionAtom } from '~core/shared_state';
import { logicalLayersRegistryStateAtom } from '~core/logical_layers/atoms/logicalLayersRegistryState';

/* Compose shared state values into one atom */
export const selectedDataAtom = createBindAtom(
  {
    currentMapPositionAtom,
    currentEventAtom,
    currentEpisodeAtom,
    layersStates: logicalLayersRegistryStateAtom,
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

    const mountedLayers = Object.values(get('layersStates')).reduce(
      (acc, l) => (l.isMounted && acc.push(l.id), acc),
      [] as string[],
    );
    if (mountedLayers.length > 0) {
      newState.layers = mountedLayers;
    }
    return newState;
  },
  'selectedDataAtom',
);
