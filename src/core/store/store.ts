import { createStore } from '@reatom/core-v2';
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
    // onPatch: (t) => {
    //   if (import.meta.env.MODE !== 'test') {
    //     if (KONTUR_TRACE_PATCH) {
    //       patchTracer(t);
    //     }
    //     for (const action of t.actions) {
    //       if (!action.type.includes('invalidate')) {
    //         dispatchMetricsEvent(action.type, action.payload);
    //         if (KONTUR_TRACE_TYPE) {
    //           if (action.type.includes(KONTUR_TRACE_TYPE)) {
    //             console.trace('TRACE:', action.type, t);
    //           }
    //         }
    //         if (KONTUR_DEBUG) {
    //           console.debug(action.type, action.payload);
    //         }
    //         if (KONTUR_WARN) {
    //           console.warn(action.type, action.payload);
    //         }
    //       }
    //     }
    //   }
    // },
  });
}

export const store = configureStore();

if (import.meta.env.MODE !== 'test') {
  store.v3ctx.subscribe((logs) => {
    for (const patch of logs) {
      if (!patch.proto.isAction) continue;

      const name = patch.proto.name!;

      if (name.includes('invalidate')) continue;

      const { payload } = patch.state.at(-1)!;

      dispatchMetricsEvent(name, payload);

      if (KONTUR_TRACE_TYPE) {
        if (name.includes(KONTUR_TRACE_TYPE)) {
          console.trace('TRACE:', name, logs);
        }
      }
      if (KONTUR_DEBUG) {
        console.debug(name, payload);
      }
      if (KONTUR_WARN) {
        console.warn(name, payload);
      }
    }
  });
}
