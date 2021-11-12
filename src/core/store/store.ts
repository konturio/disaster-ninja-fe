import { createStore } from '@reatom/core';
import { createDevtoolsLogger } from '~utils/debug/reatom-redux-devtools';

function configureStore() {
  const devtoolsLogger = createDevtoolsLogger();
  // Must be cutted out in production by terser
  if (import.meta.env.DEV) {
    return createStore({
      // @ts-expect-error - have bad typings since it experimental;
      onError: (error, t) => devtoolsLogger(t, error),
      onPatch: (t) => devtoolsLogger(t),
      now: globalThis.performance?.now.bind(performance) ?? Date.now,
    });
  }
  return createStore();
}

export const store = configureStore();
