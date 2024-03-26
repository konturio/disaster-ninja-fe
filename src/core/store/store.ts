import { createStore } from '@reatom/core-v2';
//import { declareAction, declareAtom } from '@reatom/core';
import { createCtx } from '@reatom/core';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import {
  KONTUR_DEBUG,
  KONTUR_TRACE_PATCH,
  KONTUR_TRACE_TYPE,
  KONTUR_WARN,
  patchTracer,
} from '~utils/debug';
import type { AtomCache, Logs } from '@reatom/core';

// Define an initial state and simple actions/atoms for demonstration
const initialState = { counter: 0 };

// const incrementAction = declareAction();
// const counterAtom = declareAtom(['counter'], initialState, on => [
//   on(incrementAction, state => ({ ...state, counter: state.counter + 1 }))
// ]);

// Create the Reatom store
//const store = createStore(counterAtom);

// Function to connect Reatom to Redux DevTools
function connectReatomToReduxDevTools(store) {
  const devTools =
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect();

  // Dispatch initial state to Redux DevTools
  devTools.init({});

  // Subscribe to store changes
  store.v3ctx.subscribe((state) => {
    // Dispatch each state update to Redux DevTools
    devTools.send({ type: 'STATE_UPDATE', state }, state);
  });
}

// Example of dispatching an action
//store.dispatch(incrementAction());

function configureStore() {
  return createStore({});
}

export const store = configureStore();

// Connect to Redux DevTools
//connectReatomToReduxDevTools(store);
import { connectLogger, createLogBatched } from '@reatom/logger';
const ctx = createCtx();

connectLogger(store.v3ctx);

// OR

connectLogger(
  ctx,
  // optional configuration
  {
    // the length of the atom history (patches) to store
    // history: 10,
    // `false` by default to made your logs short
    showCause: false,
    // `true` by default to made your logs clear
    skipUnnamed: true,
    // fine tuning :)
    skip: (patch: AtomCache) => false,
    // `createLogBatched` by default to not spam you a lot
    // you could pass regular `console.log` here
    log: createLogBatched(
      // optional configuration
      {
        // 500ms by default
        debounce: 500,
        // 5000ms by default, it helps to not stuck with WS and so on
        limit: 5000,
        // `toLocaleTimeString` by default
        getTimeStamp: () => new Date().toLocaleTimeString(),

        /* eslint-disable no-console */
        log: console.log,
        /* eslint-enable no-console */
        // `true` by default to group logs by name
        shouldGroup: true,
      },
    ),
    // You could customize a logs group: `Reatom ${domain}N transactions`
    domain: '',
  },
);

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
          .replace('https://localhost:3000/src', '~')
          .replace('at ', '')
          .replace(/\?t=\d+/, ''),
      );
    if (0 < (stack?.length ?? 0)) {
      group = `\x1b[94m${Math.trunc(performance.now())}\x1b[0m [${logs.filter((d) => d.proto.isAction).length}]: ${stack?.at(0)}`;
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
      KONTUR_DEBUG && console.debug(name, payload);
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
