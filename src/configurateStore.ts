import {
  Action,
  Causes,
  Fn,
  Patch,
  Rec,
  TransactionResult,
} from '@reatom/core';

type StoreOnPatch = Fn<
  [
    transactionResult: TransactionResult & { start: number; end: number },
    error?: unknown,
  ]
>;

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

  // TODO
  // @ts-ignore
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

    // @ts-expect-error
    delete action.targets;

    // console.log({ DEBUG: { action, state: displayState } })

    try {
      devTools.send(JSON.parse(JSON.stringify(action)), displayState);
    } catch (error) {
      console.log(`Devtools error`, error);
    }
  };
};
