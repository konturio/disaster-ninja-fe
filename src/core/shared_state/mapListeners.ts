import { createAtom } from '~utils/atoms';
import type * as MapLibre from 'maplibre-gl';

// listener that returns `true` allows next listener to run. If returns `false`, no listeners will be executed after
export type MapListener = (event: MapLibre.MapMouseEvent, map?: MapLibre.Map) => boolean;
type MapListenersAtomState = {
  click: { listener: MapListener; priority: number }[];
  mousemove: { listener: MapListener; priority: number }[];
  mouseleave: { listener: MapListener; priority: number }[];
  move: { listener: MapListener; priority: number }[];
  movestart: { listener: MapListener; priority: number }[];
  moveend: { listener: MapListener; priority: number }[];
};
type MapEvent = keyof MapListenersAtomState;

const defaultListeners = {
  click: [],
  mousemove: [],
  mouseleave: [],
  move: [],
  movestart: [],
  moveend: [],
};

export function registerMapListener(
  eventType: MapEvent,
  listener: MapListener,
  priority1to100 = 50,
  layerId?: string,
): () => void {
  mapListenersAtom.addMapListener.dispatch(eventType, listener, priority1to100);
  return () => {
    mapListenersAtom.removeMapListener.dispatch(eventType, listener);
  };
}

export const mapListenersAtom = createAtom(
  {
    addMapListener: (eventType: MapEvent, listener: MapListener, priority: number) => ({
      eventType,
      listener,
      priority,
    }),
    removeMapListener: (eventType: MapEvent, listener: MapListener) => ({
      eventType,
      listener,
    }),
  },
  ({ onAction }, state: MapListenersAtomState = defaultListeners) => {
    onAction('addMapListener', ({ eventType, listener, priority }) => {
      const listenerCategory = [...state[eventType]];

      // Push listener by priorities or just push it if it's first
      if (!listenerCategory.length) listenerCategory.push({ listener, priority });
      else
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

      state = { ...state, [eventType]: listenerCategory };
    });
    onAction(
      'removeMapListener',
      ({ eventType, listener }) =>
        (state[eventType] = state[eventType].filter((l) => l.listener !== listener)),
    );
    return state;
  },
  '[Shared state] mapListenersAtom',
);
