import { createBindAtom } from '~utils/atoms/createBindAtom';
import mapLibre from 'maplibre-gl';

// listener that returns `true` allows next listener to run. If returns `false`, no listeners will be executed after
type MapListener = (
  event: mapLibre.MapMouseEvent & mapLibre.EventData,
  map?: mapLibre.Map,
) => boolean;
type MapListenersAtomState = {
  click: { listener: MapListener; priority: number }[];
};
type MapEvent = keyof MapListenersAtomState;

const defaultListeners = {
  click: [],
};

export function registerMapListener(
  eventType: MapEvent,
  listener: MapListener,
  priority1to100 = 50,
): () => void {
  mapListenersAtom.addMapListener.dispatch(eventType, listener, priority1to100);
  return () => mapListenersAtom.removeMapListener.dispatch(eventType, listener);
}

export const mapListenersAtom = createBindAtom(
  {
    addMapListener: (
      eventType: MapEvent,
      listener: MapListener,
      priority: number,
    ) => ({
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

      // Push listener by priorities or just push it if it's firt
      if (!listenerCategory.length)
        listenerCategory.push({ listener, priority });
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
        (state[eventType] = state[eventType].filter(
          (l) => l.listener !== listener,
        )),
    );
    return state;
  },
  '[Shared state] mapListenersAtom',
);
