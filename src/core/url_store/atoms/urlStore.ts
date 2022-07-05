import { createAtom, createBooleanAtom } from '~utils/atoms';
import {
  currentEpisodeAtom,
  currentEventAtom,
  currentMapPositionAtom,
  currentApplicationAtom,
  defaultAppLayersAtom,
  defaultLayersParamsAtom,
  currentEventFeedAtom,
} from '~core/shared_state';
import { scheduledAutoSelect } from '~core/shared_state/currentEvent';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { URLStore } from '../URLStore';
import { URLDataInSearchEncoder } from '../dataInURLEncoder';
import type { UrlData } from '../types';
import type { Action } from '@reatom/core';

const urlStore = new URLStore(
  new URLDataInSearchEncoder({
    order: ['map', 'app', 'event', 'feed', 'layers'], // Doc #1168
    transformers: {
      map: {
        decode: (str: string) => str.split('/').map((s) => Number(s)),
        encode: (position: [number, number, number]) => position.join('/'),
      },
      layers: {
        decode: (str: string) => str.split(','),
        encode: (layers: string[]) => (layers.length ? layers.join(',') : null), // null means - not add this parameter
      },
    },
  }),
);
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
    currentEventFeedAtom,
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
        } else {
          // Auto select event from event list when url not contain that
          schedule((dispatch) => {
            dispatch(scheduledAutoSelect.setTrue());
          });
        }

        // Apply feed
        if (state.feed) {
          actions.push(currentEventFeedAtom.setCurrentFeed(state.feed));
        }

        // Apply episode
        if (state.episode) {
          actions.push(currentEpisodeAtom.setCurrentEpisodeId(state.episode));
        }

        // Apply application id
        actions.push(currentApplicationAtom.init(state.app));

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
      newState.event = currentEvent?.id ? currentEvent.id : undefined;

      const currentFeed = get('currentEventFeedAtom');
      newState.feed = currentFeed ? currentFeed.id : undefined;

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
         **/
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
