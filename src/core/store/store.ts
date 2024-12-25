/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createStore } from '@reatom/core-v2';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { KONTUR_TRACE_PATCH, KONTUR_TRACE_TYPE, KONTUR_WARN } from '~utils/debug';
import type { AtomCache, Logs } from '@reatom/framework';

export const store = createStore({});

// TODO: refactor, see #19346
const loggingEnabled = KONTUR_TRACE_PATCH || KONTUR_TRACE_TYPE || KONTUR_WARN;

if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
  store.v3ctx.subscribe(logger);
}

function logger(logs: Logs) {
  let err: Error;
  let group = '';

  if (KONTUR_TRACE_PATCH) {
    try {
      throw new Error();
    } catch (e) {
      err = e as Error;
    }
    const stack = err?.stack
      ?.split('\n')
      .slice(4)
      .filter((a) => a.includes('/src/'))
      .map((a) =>
        String(a)
          .trim()
          .replace(`https://localhost:3000${import.meta.env.BASE_URL}src`, '~')
          .replace('at ', '')
          .replace(/\?t=\d+/, ''),
      );
    const na = logs.filter((d) => d.proto.isAction).length;
    if (0 < (stack?.length ?? 0) && na > 0) {
      group = `\x1b[94m${Math.trunc(performance.now())}\x1b[0m [${na}]: ${stack?.at(0)}`;
      console.groupCollapsed(group);
      console.trace();
    }
  }

  for (const patch of logs) {
    if (!patch.proto.isAction) continue;

    const name = patch.proto.name!;

    if (name.includes('invalidate')) continue;

    KONTUR_TRACE_PATCH &&
      patch?.cause?.cause &&
      console.info(
        `\x1b[1;32mCause: ${causeChain(patch?.cause?.cause)?.join(' 👈 ')}\x1b[m`,
      ); // 👉

    patch.state.forEach((s) => {
      const { payload } = patch.state.at(-1)!;

      dispatchMetricsEvent(name, payload);

      if (KONTUR_TRACE_TYPE) {
        if (name.includes(KONTUR_TRACE_TYPE)) {
          console.trace('TRACE:', name, logs);
        }
      }
      KONTUR_WARN && console.warn(name, payload);
      KONTUR_TRACE_PATCH && console.info(name, payload);
    });
  }
  group && console.groupEnd();
}

function causeChain(cause: AtomCache) {
  const res: any[] = [];
  const cb = (e: AtomCache) => {
    res.push(e?.proto?.name);
    e.cause && cb(e.cause);
  };
  cb(cause);
  return res;
}
