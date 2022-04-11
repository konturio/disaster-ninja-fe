import { createAtom, createBooleanAtom } from '~utils/atoms';
import {
  currentEpisodeAtom,
  currentEventAtom,
  currentMapPositionAtom,
  currentApplicationAtom,
  defaultAppLayersAtom,
  defaultLayersParamsAtom,
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
    defaultAppLayersAtom,
    initFlag: initFlagAtom,
    currentMapPositionAtom,
    currentEventAtom,
    currentEpisodeAtom,
    enabledLayersAtom,
    currentApplicationAtom,
  },
  ({ get, schedule }, state: UrlData = urlStore.readCurrentState()) => {
    const initFlag = get('initFlag');
    if (!initFlag) {
      /* Initialization */
      /* If layers in url absent, take default layers form user settings */
      const noLayersInUrl =
        state.layers === undefined || state.layers.length === 0;
      if (noLayersInUrl) {
        const defaultLayers = get('defaultAppLayersAtom');
        if (
          defaultLayers.data === null &&
          !defaultLayers.loading &&
          !defaultLayers.error
        ) {
          schedule((dispatch) => dispatch(defaultLayersParamsAtom.request()));
          return;
        }

        if (defaultLayers.loading) {
          return; // Wait default layers
        }

        if (defaultLayers.data !== null) {
          state = {
            ...state,
            layers: defaultLayers.data,
          };
        }
        // Continue in case of error
      }

      /* Finish Initialization */
      /* Setup atom state from initial url */
      schedule((dispatch) => {
        const actions: Action[] = [];

        // Apply layers
        console.log('%c⧭ apply new layers', 'color: #9c66cc', state.layers);
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

        // Apply application id
        if (state.app) {
          actions.push(currentApplicationAtom.set(state.app));
        }

        // Done
        actions.push(initFlagAtom.setTrue());
        if (actions.length) dispatch(actions);
      });
    } else {
      /* After initialization finished - write new changes from state back to url */
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

      const currentApplication = get('currentApplicationAtom');
      newState.app = currentApplication ?? undefined;

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
      });
    }

    return state;
  },
  'urlStoreAtom',
);
