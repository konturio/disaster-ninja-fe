/* eslint-disable react/display-name */
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
  /* Reatom change devtools api */
  // TODO: Use new devtool reatom api
  return () => [];
};
