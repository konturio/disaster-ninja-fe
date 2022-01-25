import { createBindAtom, createBooleanAtom } from '~utils/atoms/createBindAtom';
import {
  currentUserAtom,
  currentEpisodeAtom,
  currentEventAtom,
  currentMapPositionAtom,
} from '~core/shared_state';
import { enabledLayersAtom } from '~core/shared_state';
import { URLStore } from '../URLStore';
import { URLDataInSearchEncoder } from '../dataInURLEncoder';
import { UrlData } from '../types';

const urlStore = new URLStore(new URLDataInSearchEncoder());
const initFlagAtom = createBooleanAtom(false);

/* Compose shared state values into one atom */
export const urlStoreAtom = createBindAtom(
  {
    currentUser: currentUserAtom,
    initFlag: initFlagAtom,
    currentMapPositionAtom,
    currentEventAtom,
    currentEpisodeAtom,
    enabledLayersAtom,
  },
  ({ get, schedule, create }, state: UrlData = urlStore.readCurrentState()) => {
    const initFlag = get('initFlag');
    if (!initFlag) {
      /* Initialization */

      // Check url
      const noLayersInUrl =
        state.layers === undefined || state.layers.length === 0;
      if (noLayersInUrl) {
        const currentUser = get('currentUser');
        if (currentUser === null) return state; // Wait user settings for defaults
        state = {
          ...state,
          layers: currentUser.defaultLayers,
        };
      }

      // Finish Initialization
      schedule((dispatch) =>
        dispatch([
          initFlagAtom.setTrue(),
          enabledLayersAtom.set(state.layers ?? []),
        ]),
      );
    } else {
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

      const enabledLayers = get('enabledLayersAtom');
      newState.layers = Array.from(enabledLayers ?? []);

      state = newState;
      schedule((dispatch, ctx: { debounceTimer?: NodeJS.Timeout }) => {
        /* STORE -> URL reactive updates */
        if (ctx.debounceTimer) clearTimeout(ctx.debounceTimer);
        ctx.debounceTimer = setTimeout(() => {
          urlStore.updateUrl(state);
        }, 300);

        /* URL -> Store realtime updates (extra feature) */
        // const actions: Action[] = [];
        // urlStore.onUrlChange((updated: UrlData) => {
        //   if (state.event !== updated.event) {
        //     actions.push(
        //       updated.event
        //         ? currentEventAtom.setCurrentEventId(updated.event)
        //         : currentEventAtom.resetCurrentEvent(),
        //     );
        //   }

        //   // Update EPISODE
        //   if (state.episode !== updated.episode) {
        //     actions.push(
        //       updated.episode
        //         ? currentEpisodeAtom.setCurrentEpisodeId(updated.episode)
        //         : currentEpisodeAtom.resetCurrentEpisodeId(),
        //     );
        //   }

        //   // Update LAYERS
        //   const currentLayers = new Set(state.layers ?? []);
        //   const added = (updated.layers ?? []).filter(
        //     (l) => !currentLayers.has(l),
        //   );
        //   actions.push(logicalLayersRegistryAtom.mountLayers(added));

        //   // Update MAP position
        //   if ((state.map ?? []).join() !== (updated.map ?? []).join()) {
        //     if (updated.map !== undefined) {
        //       actions.push(
        //         currentMapPositionAtom.setCurrentMapPosition({
        //           zoom: Number(updated.map[0]),
        //           lng: Number(updated.map[1]),
        //           lat: Number(updated.map[2]),
        //         }),
        //       );
        //     }
        //   }

        //   if (actions.length) dispatch(actions);
        // });
      });
    }

    return state;
  },
  'urlStoreAtom',
);
