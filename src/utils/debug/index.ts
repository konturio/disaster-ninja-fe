import { localStorage } from '~utils/storage';
import type { TransactionData } from '@reatom/core-v2';

// enable with localStorage.setItem('KONTUR_DEBUG', 'true')
export const KONTUR_DEBUG = !!localStorage.getItem('KONTUR_DEBUG');

// enable with localStorage.setItem('KONTUR_METRICS_DEBUG', 'true')
export const KONTUR_METRICS_DEBUG = !!localStorage.getItem('KONTUR_METRICS_DEBUG');

// enable with localStorage.setItem('KONTUR_WARN', 'true')
// will add stacktrace
export const KONTUR_WARN = !!localStorage.getItem('KONTUR_WARN');

// trace specific action
// enable with localStorage.setItem('KONTUR_TRACE_ERROR', '_error')
export const KONTUR_TRACE_TYPE = localStorage.getItem('KONTUR_TRACE_TYPE');

// dump patch calls with extended info and stacktrace, it's noisy
export const KONTUR_TRACE_PATCH = !!localStorage.getItem('KONTUR_TRACE_PATCH');

/**
 * Dump reatom v2 store transaction data
 * format like "atomName <action>" with timing
 * skipping "invalidate" actions
 * @param t
 */
export function patchTracer(t: TransactionData) {
  const now = `\x1b[94m${Math.trunc(performance.now())}\x1b[m `;
  const dump = t.actions
    .filter((a) => !a.type.startsWith('invalidate '))
    ?.map((a) => {
      if (a.targets?.length === 1) {
        const target = String(a.targets[0].id);
        if (a.type.endsWith(target)) {
          const action = a.type.substring(0, a.type.length - target.length - 1);
          const prefix =
            { _error: '\x1b[30;101m', _done: '\x1b[30;102m' }[action] ?? '\x1b[22;31m';
          console.warn(`${now}\x1b[1;32m${target} ${prefix}${action}\x1b[m`, a.payload, {
            '+': t.causes,
          });
        }
      } else
        console.warn(`${now}\x1b[1;32m${a.type}\x1b[m`, a.payload, a.targets, {
          '+': t.causes,
        });
    });
}
