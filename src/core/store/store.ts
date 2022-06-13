import { createStore } from '@reatom/core';
import { createDevtoolsLogger } from '~utils/debug/reatom-redux-devtools';

function configureStore() {
  const devtoolsLogger = createDevtoolsLogger();
  // Must be cutted out in production by terser
  if (import.meta.env.VITE_REDUX_DEV_TOOLS === 'true') {
    return createStore({
      onError: (error, t) => devtoolsLogger(t),
      onPatch: (t) => devtoolsLogger(t),
      now: globalThis.performance?.now.bind(performance) ?? Date.now,
    });
  }
  return createStore();
}

export const store = configureStore();
