import { createBindAtom } from '~utils/atoms/createBindAtom';

type MapListener = () => void;
type MapListenersAtomState = {
  click: MapListener[];
};
type MapEvent = keyof MapListenersAtomState;

const defaultListeners = {
  click: [],
};

export const mapListenersAtom = createBindAtom(
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
  '[Shared state] mapListenersAtom',
);
