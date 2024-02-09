import { createStore } from '@reatom/core-v2';
import { connectLogger, createLogBatched } from '@reatom/logger';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import {
  KONTUR_DEBUG,
  KONTUR_TRACE_PATCH,
  KONTUR_TRACE_TYPE,
  KONTUR_WARN,
  patchTracer,
} from '~utils/debug';
import type { Logs } from '@reatom/core';

function configureStore() {
  return createStore({});
}

export const store = configureStore();

if (import.meta.env.MODE !== 'test') {
  store.v3ctx.subscribe(logger);
}

function logger(logs: Logs) {
  let err: Error;
  let group = '';

  if (KONTUR_WARN) {
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
          .replace('https://localhost:3000/src', '~')
          .replace('at ', '')
          .replace(/\?t=\d+/, ''),
      );
    if (0 < (stack?.length ?? 0)) {
      group = `\x1b[94m${Math.trunc(performance.now())}\x1b[m [${logs.filter((d) => d.proto.isAction).length}]: ${stack?.at(0)}`;
      console.groupCollapsed(group);
      console.trace();
    }
  }

  for (const patch of logs) {
    if (!patch.proto.isAction) continue;

    const name = patch.proto.name!;

    if (name.includes('invalidate')) continue;

    patch.state.forEach((s) => {
      const { payload } = patch.state.at(-1)!;

      dispatchMetricsEvent(name, payload);

      if (KONTUR_TRACE_PATCH) {
        connectLogger(store.v3ctx, { showCause: true, devtools: true });
      }
      if (KONTUR_TRACE_TYPE) {
        if (name.includes(KONTUR_TRACE_TYPE)) {
          console.trace('TRACE:', name, logs);
        }
      }
      if (KONTUR_DEBUG) {
        console.debug(name, payload);
      }
      KONTUR_WARN && console.info(name, payload);
    });
  }
  group && console.groupEnd();
}
