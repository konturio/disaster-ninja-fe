import { createAtom, createBooleanAtom } from '~utils/atoms';
import { createStringAtom } from '~utils/atoms/createPrimitives';
import { configRepo } from '~core/config';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
import {
  currentEventAtom,
  scheduledAutoSelect,
  scheduledAutoFocus,
} from '~core/shared_state/currentEvent';
import { currentEventFeedAtom } from '~core/shared_state/currentEventFeed';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { URLStore } from '../URLStore';
import { urlEncoder } from '../encoder';
import type { UrlData } from '../types';
import type { Action } from '@reatom/core-v2';

const urlStore = new URLStore(urlEncoder);

const initFlagAtom = createBooleanAtom(false, 'urlStore:initFlagAtom');
let lastVersion = 0;

export const searchStringAtom = createStringAtom('', 'urlStore:searchStringAtom');

/* Compose shared state values into one atom */
export const urlStoreAtom = createAtom(
  {
    initFlag: initFlagAtom,
    currentMapPositionAtom,
    currentEventAtom,
    enabledLayersAtom,
    currentEventFeedAtom,
    _setState: (state: UrlData | null) => state,
    init: (initialState: UrlData) => initialState,
  },
  (
    { get, schedule, onAction, onInit, create, getUnlistedState },
    state: UrlData | null = null,
  ) => {
    const isFeedSelectorEnabled =
      configRepo.get().features['events_list__feed_selector'] ||
      configRepo.get().features['feed_selector'];

    onAction('init', (initialState) => {
      schedule(async (dispatch) => {
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
        if (initialState.bbox) {
          actions.push(currentMapPositionAtom.setCurrentMapBbox(initialState.bbox));
        } else if (initialState.map) {
          actions.push(
            currentMapPositionAtom.setCurrentMapPosition({
              // adjustments performed in url decoder
              zoom: Number(initialState.map[0]),
              lat: Number(initialState.map[1]),
              lng: Number(initialState.map[2]),
            }),
          );
        }

        // Apply event
        if (initialState.event) {
          actions.push(currentEventAtom.setCurrentEventId(initialState.event));
        }

        // Apply feed
        if (initialState.feed && isFeedSelectorEnabled) {
          actions.push(currentEventFeedAtom.setCurrentFeed(initialState.feed));
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
    if (currentMapPosition && 'lng' in currentMapPosition) {
      // formatting performed in url encoder
      newState.map = [
        Number(currentMapPosition.zoom),
        Number(currentMapPosition.lat),
        Number(currentMapPosition.lng),
      ];
    }

    const currentEvent = get('currentEventAtom');
    newState.event = currentEvent?.id ? currentEvent.id : undefined;

    const currentFeed = get('currentEventFeedAtom');
    const feedId = currentFeed && isFeedSelectorEnabled ? currentFeed.id : undefined;
    newState.feed = feedId;

    const enabledLayers = get('enabledLayersAtom');
    newState.layers = Array.from(enabledLayers ?? []);

    const addAppIdToUrl = ['test-apps-ninja', 'localhost'].some((host) =>
      window.location.host.includes(host),
    );
    if (addAppIdToUrl) newState.app = configRepo.get().id;

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
          dispatch(searchStringAtom.set(urlStore.toSearchSting(state)));
        }
      }, 300);
    });

    return state;
  },
  {
    id: 'urlStoreAtom',
    decorators: [],
  },
);
