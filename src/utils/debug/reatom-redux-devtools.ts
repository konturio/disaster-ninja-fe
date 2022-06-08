import type { Action, Causes, Patch, Rec, StoreOnPatch } from '@reatom/core';

function getActionsType(actions: ReadonlyArray<Action>) {
  return actions.length === 1
    ? actions[0].type
    : actions.map(({ type }) => type).join(', ');
}

function parsePatch(patch: Patch) {
  return [...patch].reduce((acc, [atom, cache]) => {
    acc[atom.id] = cache.state;
    return acc;
  }, {} as Record<string, any>);
}

// http://extension.remotedev.io/docs/API/Methods.html#connect
/**
 * @example
 * ```ts
 * function configureStore() {
 *   const devtoolsLogger = createDevtoolsLogger()
 *   const store = createStore({
 *     onError: (error, t) => devtoolsLogger(t, error),
 *     onPatch: (t) => devtoolsLogger(t),
 *     now: globalThis.performance?.now.bind(performance) ?? Date.now,
 *   })
 *
 *   return store
 * }
 * ```
 */
// @ts-ignore
export const createDevtoolsLogger: (config?: Rec) => StoreOnPatch = (
  config = {},
) => {
  const connect = (globalThis as any)?.__REDUX_DEVTOOLS_EXTENSION__?.connect;

  if (!connect) {
    return () => null;
  }

  const devTools = connect(config);
  const state: Record<string, any> = {};

  devTools.init(state);

  return async ({ actions, patch, causes, start, end }, error) => {
    const duration = `${(end - start).toFixed(3)}ms`;
    const stateCauses: Rec = {};
    const displayState = error ? { ...state } : state;

    for (const [{ id }, { cause, state: atomState }] of patch) {
      if (!Object.is(displayState[id], atomState)) stateCauses[id] = cause;
      displayState[id] = atomState;
    }

    let type = getActionsType(actions);

    if (error) type = `ERROR: ${type}`;

    causes = (causes as Causes).map((cause) =>
      typeof cause === 'string'
        ? cause
        : {
            ...cause,
            type: getActionsType(cause.actions),
            patch: parsePatch(cause.patch),
          },
    );

    const action =
      actions.length === 1
        ? {
            ...actions[0],
            type,
            error,
            causes,
            stateCauses,
            duration,
            start,
            end,
          }
        : {
            type,
            actions,
            error: error instanceof Error ? error.message : error,
            causes,
            stateCauses,
            duration,
            start,
            end,
          };

    // @ts-ignore
    delete action.targets;

    // use it if your devtools is slow coz of synthetic events parsing
    // console.log({ DEBUG: { action, state: displayState } })

    try {
      devTools.send(action, displayState);
    } catch (error) {
      console.log(`Devtools error`, error);
    }
  };
};
