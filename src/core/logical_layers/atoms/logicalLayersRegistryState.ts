import { createBindAtom } from '~utils/atoms/createBindAtom';
import { LogicalLayerAtom, LogicalLayerAtomState } from '~core/logical_layers/createLogicalLayerAtom';
import { logicalLayersRegistryAtom } from './logicalLayersRegistry';

/**
 * This atom subscribe to all atoms in registry and save their states.
 * Refreshed every time when one of layer change his state
 * Don't use it if yoi need only one layer state, use layerAtom directly instead
 **/
type registryStateAtomContext = {
  unsubscribes?: Record<string, () => void>;
};

export const logicalLayersRegistryStateAtom = createBindAtom(
  {
    registry: logicalLayersRegistryAtom,
    _updateState: (stateUpdate: LogicalLayerAtomState) => stateUpdate,
  },
  (
    { onChange, schedule, create, onAction },
    state: Record<string, LogicalLayerAtomState> = {},
  ) => {
    onAction('_updateState', (update) => {
      state = { ...state, [update.id]: update };
    });

    onChange('registry', (atomsList) => {
      const atoms: [LogicalLayerAtom[], LogicalLayerAtom[]] = [[], []];

      // oldAtoms - atoms that already in state of this atom
      const [oldAtoms, newAtoms] = Object.values(atomsList).reduce(
        (acc, a) => ((state[a.id] ? acc[0] : acc[1]).push(a), acc),
        atoms,
      );
      const oldAtomsIds = new Set(oldAtoms.map((a) => a.id));
      const deletedAtomsIds = Object.keys(state).filter(
        (atomId) => !oldAtomsIds.has(atomId),
      );

      // Delete old atoms from state
      const stateCopy = { ...state };
      deletedAtomsIds.forEach((id) => {
        delete stateCopy[id];
      });
      state = stateCopy;
      schedule((dispatch, ctx: registryStateAtomContext) => {
        ctx.unsubscribes = ctx.unsubscribes ?? {};

        // Unsubscribe from deleted (unregistered) atoms
        deletedAtomsIds.forEach((atomId) => {
          const unsubscribe = ctx.unsubscribes![atomId];
          if (unsubscribe) {
            unsubscribe();
            delete ctx.unsubscribes![atomId];
          }
        });

        // Subscribe to new atoms
        newAtoms.forEach((atom) => {
          ctx.unsubscribes![atom.id] = atom.subscribe((s) =>
            dispatch(create('_updateState', s)),
          );
        });
      });
    });

    return state;
  },
  '[Shared state] logicalLayersRegistryStateAtom',
);
