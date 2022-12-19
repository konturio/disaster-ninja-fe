import type { TransactionData } from '@reatom/core';

// enable with localStorage.setItem('KONTUR_DEBUG', 'true')
export const KONTUR_DEBUG = !!globalThis.window?.localStorage.getItem('KONTUR_DEBUG');

// enable with localStorage.setItem('KONTUR_METRICS_DEBUG', 'true')
export const KONTUR_METRICS_DEBUG =
  !!globalThis.window?.localStorage.getItem('KONTUR_METRICS_DEBUG');

// enable with localStorage.setItem('KONTUR_WARN', 'true')
// will add stacktrace
export const KONTUR_WARN = !!globalThis.window?.localStorage.getItem('KONTUR_WARN');

// trace specific action
// enable with localStorage.setItem('KONTUR_TRACE_ERROR', '_error')
export const KONTUR_TRACE_TYPE =
  globalThis.window?.localStorage.getItem('KONTUR_TRACE_TYPE');

// dump patch calls with extended info and stacktrace, it's noisy
export const KONTUR_TRACE_PATCH =
  !!globalThis.window?.localStorage.getItem('KONTUR_TRACE_PATCH');

/**
 * Dump reatom v2 store transaction data
 * format like "atomName <action>" with timing
 * skipping "invalidate" actions
 * @param t
 */
export function patchTracer(t: TransactionData) {
  const dump = t.actions
    .filter((a) => !a.type.startsWith('invalidate '))
    ?.map((a) => {
      if (a.targets?.length === 1) {
        const target = String(a.targets[0].id);
        if (a.type.endsWith(target)) {
          const action = a.type.substring(0, a.type.length - target.length - 1);
          return target + ' <' + action + '> ';
        }
      }
      return a.targets?.map((t) => t.id).join(',') + ' <-- ' + a.type;
    })
    .join('\n\t\t');

  dump && console.warn(`${Math.trunc(performance.now())}>`, dump, t);
}
