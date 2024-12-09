import * as v3 from '@reatom/core';
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

type Tov2Actions<V3Actions extends Record<string, v3.Action>> = {
  [Properties in keyof V3Actions]: (args?: Parameters<V3Actions[Properties]>) => Action;
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
  actionCreator.dispatch = (...a: any[]) => store.dispatch(actionCreator(...a));
  actionCreator.v3action = v3.action(type);
  return { name, actionCreator };
}

export function v3ActionToV2<Payload = any>(
  v3action: v3.Action,
  payload: Payload,
  type: string,
): Action {
  return { v3action, payload, type };
}
