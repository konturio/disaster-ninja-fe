import { createStore } from '@reatom/core';
import { createDevtoolsLogger } from '~utils/debug/reatom-redux-devtools';
import { appMetrics } from '~core/metrics';

// enable with localStorage.setItem('KONTUR_DEBUG', 'true')
const KONTUR_DEBUG = !!localStorage.getItem('KONTUR_DEBUG');
// enable with localStorage.setItem('KONTUR_TRACE_ERROR', 'true')
const KONTUR_TRACE_ERROR = !!localStorage.getItem('KONTUR_TRACE_ERROR');

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
  return createStore({
    onPatch: (t) => {
      if (import.meta.env.MODE !== 'test') {
        for (const action of t.actions) {
          if (!action.type.includes('invalidate')) {
            appMetrics.processEvent(action.type, action.payload);
            if (KONTUR_TRACE_ERROR) {
              if (action.type.includes('_error')) {
                console.trace('ERROR IN:', action.type, t);
              }
            }
            if (KONTUR_DEBUG) {
              console.debug(action.type, action.payload);
            }
          }
        }
      }
    },
  });
}

export const store = configureStore();
