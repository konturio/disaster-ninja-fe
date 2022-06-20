import { useEffect, useState } from 'react';

const createGlobalState = (initialState) => {
  let globalState = initialState;
  const listeners = new Set<() => void>();

  const setGlobalState = (nextGlobalState) => {
    globalState = nextGlobalState;
    listeners.forEach((listener) => listener());
  };

  return () => {
    const [state, setState] = useState(globalState);
    useEffect(() => {
      const listener = () => {
        setState(globalState);
      };
      listeners.add(listener);
      listener(); // in case it's already changed
      return () => {
        listeners.delete(listener);
      }; // cleanup
    }, []);
    return [state, setGlobalState];
  };
};

export const useHeadingGlobalState = createGlobalState({
  headingId: '',
});
