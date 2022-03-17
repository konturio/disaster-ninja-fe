import { createAtom, createBooleanAtom } from '~utils/atoms';
import {
  currentUserAtom,
  currentEpisodeAtom,
  currentEventAtom,
  currentMapPositionAtom,
} from '~core/shared_state';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { URLStore } from '../URLStore';
import { URLDataInSearchEncoder } from '../dataInURLEncoder';
import { UrlData } from '../types';
import { Action } from '@reatom/core';

const urlStore = new URLStore(new URLDataInSearchEncoder());
const initFlagAtom = createBooleanAtom(false);
let lastVersion = 0;
/* Compose shared state values into one atom */
export const urlStoreAtom = createAtom(
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

      /* Finish Initialization */
      schedule((dispatch) => {
        const actions: Action[] = [];

        // Apply layers
        actions.push(enabledLayersAtom.change(() => new Set(state.layers)));

        // Apply map position
        if (state.map) {
          actions.push(
            currentMapPositionAtom.setCurrentMapPosition({
              zoom: Number(state.map[0]),
              lng: Number(state.map[1]),
              lat: Number(state.map[2]),
            }),
          );
        }

        // Apply event
        if (state.event) {
          actions.push(currentEventAtom.setCurrentEventId(state.event));
        }
        // Apply episode
        if (state.episode) {
          actions.push(currentEpisodeAtom.setCurrentEpisodeId(state.episode));
        }

        // Done
        actions.push(initFlagAtom.setTrue());
        if (actions.length) dispatch(actions);
      });
    } else {
      const newState = { ...state };
      const currentMapPosition = get('currentMapPositionAtom');
      if (currentMapPosition) {
        newState.map = [
          Number(currentMapPosition.zoom.toFixed(3)),
          Number(currentMapPosition.lng.toFixed(3)),
          Number(currentMapPosition.lat.toFixed(3)),
        ];
      }

      const currentEvent = get('currentEventAtom');
      newState.event = currentEvent ? currentEvent.id : undefined;

      const currentEpisode = get('currentEpisodeAtom');
      newState.episode = currentEpisode ? currentEpisode.id : undefined;

      const enabledLayers = get('enabledLayersAtom');
      newState.layers = Array.from(enabledLayers ?? []);
      state = newState;
      const currentVersion = ++lastVersion;

      schedule((dispatch, ctx: { debounceTimer?: NodeJS.Timeout }) => {
        /**
         * Schedule run not in the same order as created, every dispatch have own side effects order.
         * Next line check that it last one schedule, if not - we ignore it
         *  */
        if (currentVersion !== lastVersion) return;

        /* STORE -> URL reactive updates */
        if (ctx.debounceTimer) clearTimeout(ctx.debounceTimer);
        ctx.debounceTimer = setTimeout(() => {
          urlStore.updateUrl(state);
        }, 300);

        /* URL -> Store realtime updates (extra feature) */
        // const actions: Action[] = [];
        // urlStore.onUrlChange((updated: UrlData) => {
        // if (state.event !== updated.event) {
        //   actions.push(
        //     updated.event
        //       ? currentEventAtom.setCurrentEventId(updated.event)
        //       : currentEventAtom.resetCurrentEvent(),
        //   );
        // }

        // Update EPISODE
        // if (state.episode !== updated.episode) {
        //   actions.push(
        //     updated.episode
        //       ? currentEpisodeAtom.setCurrentEpisodeId(updated.episode)
        //       : currentEpisodeAtom.resetCurrentEpisodeId(),
        //   );
        // }

        // Update LAYERS
        // const currentLayers = new Set(state.layers ?? []);
        // const added = (updated.layers ?? []).filter(
        //   (l) => !currentLayers.has(l),
        // );
        // actions.push(logicalLayersRegistryAtom.mountLayers(added));

        // Update MAP position
        // if ((state.map ?? []).join() !== (updated.map ?? []).join()) {
        //   if (updated.map !== undefined) {
        //     actions.push(
        //       currentMapPositionAtom.setCurrentMapPosition({
        //         zoom: Number(updated.map[0]),
        //         lng: Number(updated.map[1]),
        //         lat: Number(updated.map[2]),
        //       }),
        //     );
        //   }
        // }

        // if (actions.length) dispatch(actions);
        // });
      });
    }

    return state;
  },
  'urlStoreAtom',
);
