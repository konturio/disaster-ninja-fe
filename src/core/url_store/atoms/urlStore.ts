import { memo } from '@reatom/core/experiments';
import { createAtom, createBooleanAtom } from '~core/store/atoms';
import { scheduledAutoSelect, scheduledAutoFocus } from '~core/shared_state/currentEvent';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import core from '~core/index';
import type { UrlData } from '../types';
import type { Action } from '@reatom/core';
import type { URLStore } from '../URLStore';

const initFlagAtom = createBooleanAtom(false, 'urlStore:initFlagAtom');
let lastVersion = 0;


/* Compose shared state values into one atom */
export const createUrlStoreAtom = (urlStore: URLStore, store) =>
  createAtom(
    {
      initFlag: initFlagAtom,
      currentMapPositionAtom: core.sharedState.currentMapPositionAtom,
      currentEventAtom: core.sharedState.currentEventAtom,
      enabledLayersAtom,
      currentEventFeedAtom: core.sharedState.currentEventFeedAtom,
      _setState: (state: UrlData | null) => state,
    },
    ({ get, schedule, onAction, onInit, create }, state: UrlData | null = null) => {
      onInit(() => {
        schedule(async (dispatch) => {
          const initialState = urlStore.readCurrentState();
          const actions: Action[] = [create('_setState', initialState)];

          if (initialState.event === undefined && !initialState.map) {
            // Auto select event from event list when url is empty
            actions.push(scheduledAutoSelect.setTrue());
          }

          if (initialState.map === undefined) {
            // Auto zoom to event if no coordinates in url
            actions.push(scheduledAutoFocus.setTrue());
          }

          // Apply layers
          if (initialState.layers) {
            actions.push(enabledLayersAtom.change(() => new Set(initialState.layers)));
          }

          // Apply map position
          if (initialState.map) {
            actions.push(
              core.sharedState.currentMapPositionAtom.setCurrentMapPosition({
                zoom: Number(initialState.map[0]),
                lng: Number(initialState.map[1]),
                lat: Number(initialState.map[2]),
              }),
            );
          }

          // Apply event
          if (initialState.event) {
            actions.push(core.sharedState.currentEventAtom.setCurrentEventId(initialState.event));
          }

          // Apply feed
          if (initialState.feed) {
            actions.push(core.sharedState.currentEventFeedAtom.setCurrentFeed(initialState.feed));
          }

          // Done
          actions.push(initFlagAtom.setTrue());

          dispatch(actions);
        });
      });

      onAction('_setState', (update) => {
        state = { ...update };
      });

      const ready = get('initFlag');
      if (!ready) return state;

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

      const enabledLayers = get('enabledLayersAtom');
      newState.layers = Array.from(enabledLayers ?? []);

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
          if (state !== null) {
            urlStore.updateUrl(state);
          }
        }, 300);
      });

      return state;
    },
    {
      id: 'urlStoreAtom',
      decorators: [memo()],
      store
    },
  );
