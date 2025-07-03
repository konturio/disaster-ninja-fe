import { atom, action } from '@reatom/framework';
import { store } from '~core/store/store';
import { currentMapAtom } from './currentMap';
import type * as MapLibre from 'maplibre-gl';
import type { Ctx } from '@reatom/framework';

// listener that returns `true` allows next listener to run. If returns `false`, no listeners will be executed after
export type MapListener = (event: MapLibre.MapMouseEvent, map?: MapLibre.Map) => boolean;

const MAP_EVENTS = [
  'click',
  'mousemove',
  'mouseleave',
  'move',
  'movestart',
  'moveend',
] as const;

type MapListenersAtomState = {
  [K in (typeof MAP_EVENTS)[number]]: { listener: MapListener; priority: number }[];
};

type MapEvent = keyof MapListenersAtomState;

const defaultListeners: MapListenersAtomState = MAP_EVENTS.reduce(
  (acc, event) => ({ ...acc, [event]: [] }),
  {} as MapListenersAtomState,
);

const registeredHandlers = new Map<string, (event: any) => void>();

function updateMapEventHandlers(
  ctx: Ctx,
  eventType: MapEvent,
  listeners: { listener: MapListener; priority: number }[],
) {
  const map = ctx.get(currentMapAtom.v3atom);
  if (!map) return;

  // Remove existing handler
  const existingHandler = registeredHandlers.get(eventType);
  if (existingHandler) {
    map.off(eventType, existingHandler);
    registeredHandlers.delete(eventType);
  }

  // Add new handler if there are listeners
  if (listeners.length > 0) {
    // Sort by priority (higher priority = earlier execution)
    const sortedListeners = listeners.sort((a, b) => b.priority - a.priority);

    const chainHandler = (event: any) => {
      for (const { listener } of sortedListeners) {
        const shouldContinue = listener(event, event.target);
        if (!shouldContinue) break; // Priority chain stops
      }
    };

    map.on(eventType, chainHandler);
    registeredHandlers.set(eventType, chainHandler);
  }
}

// Initialize all event handlers when map becomes available
const initializeMapEventHandlers = action((ctx) => {
  const map = ctx.get(currentMapAtom.v3atom);
  if (!map) return;

  const state = ctx.get(mapListenersAtom);

  // Set up handlers for all event types that have listeners
  MAP_EVENTS.forEach((eventType) => {
    const listeners = state[eventType];
    if (listeners.length > 0) {
      updateMapEventHandlers(ctx, eventType, listeners);
    }
  });
}, 'initializeMapEventHandlers');

// Auto-initialize when map becomes available
currentMapAtom.v3atom.onChange((ctx, map) => {
  if (map) {
    initializeMapEventHandlers(ctx);
  }
});

export const mapListenersAtom = atom<MapListenersAtomState>(
  defaultListeners,
  '[Shared state] mapListenersAtom',
);

export const addMapListener = action(
  (ctx, eventType: MapEvent, listener: MapListener, priority: number) => {
    const state = ctx.get(mapListenersAtom);
    const listenerCategory = [...state[eventType]];

    // Push listener by priorities or just push it if it's first
    if (!listenerCategory.length) {
      listenerCategory.push({ listener, priority });
    } else {
      for (let i = 0; i < listenerCategory.length; i++) {
        const listenerWrap = listenerCategory[i];
        if (priority < listenerWrap.priority) {
          listenerCategory.splice(i, 0, { listener, priority });
          break;
        } else if (listenerWrap.priority === priority) {
          // if priorities are equal - let the first added be more prioritized
          listenerCategory.splice(i + 1, 0, { listener, priority });
          break;
        } else if (!listenerCategory[i + 1]) {
          listenerCategory.push({ listener, priority });
          break;
        } else if (
          priority > listenerWrap.priority &&
          priority < listenerCategory[i + 1].priority
        ) {
          listenerCategory.splice(i + 1, 0, { listener, priority });
          break;
        }
      }
    }

    mapListenersAtom(ctx, { ...state, [eventType]: listenerCategory });

    updateMapEventHandlers(ctx, eventType, listenerCategory);
  },
  'addMapListener',
);

export const removeMapListener = action(
  (ctx, eventType: MapEvent, listener: MapListener) => {
    const state = ctx.get(mapListenersAtom);
    const filteredListeners = state[eventType].filter((l) => l.listener !== listener);

    mapListenersAtom(ctx, { ...state, [eventType]: filteredListeners });

    updateMapEventHandlers(ctx, eventType, filteredListeners);
  },
  'removeMapListener',
);

export function registerMapListener(
  eventType: MapEvent,
  listener: MapListener,
  priority1to100 = 50,
  layerId?: string,
): () => void {
  addMapListener(store.v3ctx, eventType, listener, priority1to100);
  return () => {
    removeMapListener(store.v3ctx, eventType, listener);
  };
}
