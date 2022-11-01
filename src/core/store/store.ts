import { createStore } from '@reatom/core';
import { createDevtoolsLogger } from '~utils/debug/reatom-redux-devtools';
import { appMetrics } from '~core/metrics';

// enable with localStorage.setItem('KONTUR_DEBUG', 'true')
const KONTUR_DEBUG = !!globalThis.window?.localStorage.getItem('KONTUR_DEBUG');
// enable with localStorage.setItem('KONTUR_TRACE_ERROR', '_error')
const KONTUR_TRACE_TYPE = globalThis.window?.localStorage.getItem('KONTUR_TRACE_TYPE');

function configureStore() {
  const devtoolsLogger = createDevtoolsLogger();
  // Must be cutted out in production by terser
  if (import.meta.env.VITE_REDUX_DEV_TOOLS === 'true') {
    return createStore({
      onError: (error, t) => {
        if (KONTUR_DEBUG) {
          console.error('STORE error:', error, t);
        }
        devtoolsLogger(t);
      },
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
            if (KONTUR_TRACE_TYPE) {
              if (action.type.includes(KONTUR_TRACE_TYPE)) {
                console.trace('TRACE:', action.type, t);
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
