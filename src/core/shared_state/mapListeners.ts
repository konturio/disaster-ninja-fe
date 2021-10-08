import { createAtom } from '@reatom/core';

type MapListener = () => void;
type MapListenersAtomState = {
  click: MapListener[];
};
type MapEvent = keyof MapListenersAtomState;

const defaultListeners = {
  click: [],
};

export const mapListenersAtom = createAtom(
  {
    addMapListener: (eventType: MapEvent, listener: MapListener) => ({
      eventType,
      listener,
    }),
    removeMapListener: (eventType: MapEvent, listener: MapListener) => ({
      eventType,
      listener,
    }),
  },
  ({ onAction }, state: MapListenersAtomState = defaultListeners) => {
    onAction('addMapListener', ({ eventType, listener }) =>
      state[eventType].push(listener),
    );
    onAction(
      'removeMapListener',
      ({ eventType, listener }) =>
        (state[eventType] = state[eventType].filter((l) => l === listener)),
    );
    return state;
  },
);
