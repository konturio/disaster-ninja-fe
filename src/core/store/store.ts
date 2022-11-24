import { createStore } from '@reatom/core';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import type { TransactionData } from '@reatom/core';

// enable with localStorage.setItem('KONTUR_DEBUG', 'true')
const KONTUR_DEBUG = !!globalThis.window?.localStorage.getItem('KONTUR_DEBUG');

// enable with localStorage.setItem('KONTUR_WARN', 'true')
// will add stacktrace
const KONTUR_WARN = !!globalThis.window?.localStorage.getItem('KONTUR_WARN');

// enable with localStorage.setItem('KONTUR_TRACE_ERROR', '_error')
const KONTUR_TRACE_TYPE = globalThis.window?.localStorage.getItem('KONTUR_TRACE_TYPE');

// dump patch calls with extended info and stacktrace, it's noisy
const KONTUR_TRACE_PATCH =
  !!globalThis.window?.localStorage.getItem('KONTUR_TRACE_PATCH');

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
            if (KONTUR_DEBUG) {
              console.debug(action.type, action.payload);
            }
            if (KONTUR_WARN) {
              console.warn(action.type, action.payload);
            }
          }
        }
      }
    },
  });
}

export const store = configureStore();

function patchTracer(t: TransactionData) {
  const dump = t.actions
    .filter((a) => !a.type.startsWith('invalidate '))
    ?.map((a) => {
      if (a.targets?.length === 1) {
        const target = String(a.targets[0].id)
        if (a.type.endsWith(target)) {
          const action = a.type.substring(0, a.type.length - target.length - 1);
          return target+ ' <' + action + '> ';
        }
      }
      return a.targets?.map((t) => t.id).join(',') + ' <-- ' + a.type;
    })
    .join('\n\t');

  dump && console.warn(`${performance.now()}:>`, dump, t);
}
