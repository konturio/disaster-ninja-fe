import { createStore } from '@reatom/core';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import {
  KONTUR_DEBUG,
  KONTUR_TRACE_PATCH,
  KONTUR_TRACE_TYPE,
  KONTUR_WARN,
  patchTracer,
} from '~utils/debug';

function configureStore() {
  return createStore({
    onPatch: (t) => {
      if (import.meta.env.MODE !== 'test') {
        if (KONTUR_TRACE_PATCH) {
          patchTracer(t);
        }
        for (const action of t.actions) {
          if (!action.type.includes('invalidate')) {
            dispatchMetricsEvent(action.type, action.payload);

            if (KONTUR_TRACE_TYPE) {
              if (action.type.includes(KONTUR_TRACE_TYPE)) {
                console.trace('TRACE:', action.type, t);
              }
            }
          }
        }
      }
    },
  });
}

export const store = configureStore();
