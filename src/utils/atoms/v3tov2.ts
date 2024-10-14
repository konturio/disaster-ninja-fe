/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as v3 from '@reatom/core';
import { createAtom } from '~utils/atoms';
import { store as globalStore } from '~core/store/store';
import type { Atom, AtomSelfBinded, Fn, Rec, Store, TrackReducer } from '@reatom/core-v2';

// Define our own AnyAction type
type AnyAction = {
  payload: any;
  type: string;
  v3action: v3.Action<any>;
  targets?: Atom[];
};

// Update the ActionCreatorBinded type
type ActionCreatorBinded<P> = {
  (payload: P): AnyAction;
  type: string;
  dispatch: (payload: P) => void;
  v3action: v3.Action<any>;
};

export function v3toV2<
  State,
  Deps extends Rec<Fn | Atom>,
  V3A extends Record<string, v3.Action<any>>,
  T extends v3.Atom<State> | v3.AtomMut<State>,
>(v3atom: T, v3Actions?: V3A, store: Store = globalStore) {
  const _v2Atom = createAtom<State, Deps>(
    {} as Deps,
    (() => {}) as unknown as TrackReducer<State, Deps>,
    {
      store,
      v3atom,
    },
  );

  // set correct v3atom type, because it's hardcoded in v2 types as v3.Atom
  const v2Atom = _v2Atom as Omit<typeof _v2Atom, 'v3atom'> & { v3atom: T };

  if (v3Actions) {
    Object.entries(v3Actions)
      .map(([name, action]) => actionV3ToV2([name, action], [v2Atom], store))
      .forEach(({ name, actionCreator }) => {
        (v2Atom as any)[name] = actionCreator;
      });
  }

  return v2Atom;
}

let actionIdCounter = 0;

function actionV3ToV2<T extends any[], V>(
  [name, action]: [string, v3.Action<T>],
  targets?: V[],
  store = globalStore,
): { name: string; actionCreator: ActionCreatorBinded<T[0]> } {
  const type = action.__reatom.name ?? `name_${actionIdCounter++}`;

  const actionCreator: ActionCreatorBinded<T[0]> = function (payload: T[0]) {
    return {
      payload,
      type,
      v3action: action,
      targets: targets as Atom[],
    };
  };

  actionCreator.type = type;
  actionCreator.dispatch = (payload: T[0]) => store.dispatch(actionCreator(payload));
  actionCreator.v3action = action;

  return { name, actionCreator };
}

// TEST, to be removed
const a3 = v3.atom(0, 'zoot');
const a2 = v3toV2(a3);
const a3_in_a2 = a2.v3atom;
const aa = v3.atom((_) => _);
const aa2 = v3toV2(aa);
aa2.v3atom;
