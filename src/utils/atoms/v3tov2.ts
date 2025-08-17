import * as v3 from '@reatom/framework';
import { createAtom } from '~utils/atoms';
import { store as globalStore } from '~core/store/store';
import type {
  Action,
  ActionCreatorBinded,
  Atom,
  AtomSelfBinded,
  Fn,
  Rec,
  Store,
} from '@reatom/core-v2';

type PayloadOf<V3A extends v3.Action> = V3A extends (
  ctx: unknown,
  ...args: infer A
) => unknown
  ? A extends []
    ? void
    : A[0]
  : void;

type Tov2Actions<V3Actions extends Record<string, v3.Action>> = {
  [K in keyof V3Actions]: (payload?: PayloadOf<V3Actions[K]>) => Action;
};

// [Properties in keyof Type]: Type[Properties]
export function v3toV2<
  State,
  Deps extends Rec<Fn | Atom>,
  V3A extends Record<string, v3.Action>,
>(
  v3atom: v3.Atom<State>,
  v3Actions?: V3A,
  store: Store = globalStore,
): AtomSelfBinded<State, Tov2Actions<V3A>> {
  // @ts-expect-error - actions will be assigned later
  const v2Atom = createAtom<State, Deps>({}, () => {}, { store, v3atom });
  if (v3Actions) {
    Object.entries(v3Actions)
      .map((act) => actionV3ToV2(act, [v2Atom], store))
      .forEach(({ name, actionCreator }) =>
        Object.assign(v2Atom, { [name]: actionCreator }),
      );
  }
  // @ts-expect-error - actions will be assigned later
  return v2Atom;
}

let actionIdCounter = 0;

function actionV3ToV2(
  [name, action]: [string, v3.Action],
  targets?: Atom[],
  store = globalStore,
): { name: string; actionCreator: ActionCreatorBinded } {
  const type = action.__reatom.name ?? `name_${actionIdCounter++}`; // `${actionName}_${v3atom?.__reatom.name}`

  // @ts-expect-error - props will be assigned later
  const actionCreator: ActionCreatorBinded = function (payload) {
    return {
      payload,
      type,
      v3action: action,
      targets: targets,
    };
  };

  actionCreator.type = type;
  actionCreator.dispatch = (...a: unknown[]) => store.dispatch(actionCreator(...a));
  actionCreator.v3action = v3.action(type);
  return { name, actionCreator };
}

/**
 * Wrap a Reatom v3 action into a v2-compatible Action object for manual dispatch.
 *
 * Notes:
 * - Interop helper for the bridge; does not execute v2 reducers or `onAction` handlers.
 * - `payload` is forwarded as the single argument after `ctx` to the v3 action.
 * - `type` is used as the v2 action type and as the internal v3 action name.
 *
 * @param v3action - The v3 action to be invoked by the v2 store
 * @param payload - Single payload object passed to the v3 action (after `ctx`)
 * @param type - V2 action type string
 * @returns V2 Action understood by the v2 store and the bridge
 */
export function v3ActionToV2<Payload = unknown>(
  v3action: v3.Action,
  payload: Payload,
  type: string,
): Action {
  return { v3action, payload, type };
}
