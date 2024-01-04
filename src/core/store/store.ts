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
  return createStore({});
}

export const store = configureStore();

if (import.meta.env.MODE !== 'test') {
  store.v3ctx.subscribe((logs) => {
    for (const patch of logs) {
      if (!patch.proto.isAction) continue;

      const name = patch.proto.name!;

      if (name.includes('invalidate')) continue;

      patch.state.forEach((s) => {
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
      });
    }
  });
}
