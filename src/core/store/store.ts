/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createStore } from '@reatom/core-v2';
import { connectLogger } from '@reatom/framework';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { KONTUR_TRACE_PATCH, KONTUR_TRACE_TYPE, KONTUR_WARN } from '~utils/debug';

export const store = createStore({});

if (KONTUR_TRACE_PATCH) {
  connectLogger(store.v3ctx, {
    historyLength: 5,
    showCause: KONTUR_TRACE_PATCH,
    skipUnnamed: true,
    domain: 'Kontur',
  });
}
const WILL_LOG = KONTUR_WARN || KONTUR_TRACE_TYPE;
store.v3ctx.subscribe((patches) => {
  const tag = `Reatom logged ${patches.length} transaction(s)`;
  WILL_LOG && console.groupCollapsed(tag);
  patches?.forEach((patch) => {
    const atomName = patch.proto?.name;
    if (atomName) {
      const { state, ...rest } = patch;
      dispatchMetricsEvent(atomName, patch?.state);

      KONTUR_WARN && console.warn(atomName, state, { patch: rest });
      if (KONTUR_TRACE_TYPE) {
        if (atomName.includes(KONTUR_TRACE_TYPE)) {
          console.trace('TRACE:', atomName, state, { patch: rest });
        }
      }
    }
  });
  WILL_LOG && console.groupEnd();
});
