import appConfig from '~core/app_config';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import {
  LogicalLayerAtom,
  LogicalLayerAtomState,
} from '~utils/atoms/createLogicalLayerAtom';

export const logicalLayersRegistryAtom = createBindAtom(
  {
    registerLayer: (logicalLayer: LogicalLayerAtom | LogicalLayerAtom[]) =>
      Array.isArray(logicalLayer) ? logicalLayer : [logicalLayer],
    unregisterLayer: (logicalLayerId: LogicalLayerAtom['id']) => logicalLayerId,
    mountLayers: (layersIds: string[]) => layersIds,
  },
  (
    { onAction, schedule },
    state: Record<LogicalLayerAtom['id'], LogicalLayerAtom> = {},
  ) => {
    onAction('registerLayer', (logicalLayers) => {
      const willBeReplaced: LogicalLayerAtom[] = [];
      logicalLayers.forEach((logicalLayer) => {
        const alreadyRegistered = state[logicalLayer.id] !== undefined;
        if (alreadyRegistered) willBeReplaced.push(state[logicalLayer.id]);

        state = { ...state, [logicalLayer.id]: logicalLayer };
      });

      const mountedByDefault = logicalLayers.filter((l) =>
        (appConfig.layersByDefault ?? []).includes(l.id),
      );

      schedule((dispatch) =>
        dispatch(
          willBeReplaced
            .map((l) => l.unregister())
            .concat(logicalLayers.map((l) => l.init()))
            .concat(mountedByDefault.map((l) => l.mount())),
        ),
      );
    });

    onAction('unregisterLayer', (logicalLayerId) => {
      const layer = state[logicalLayerId];
      const copy = { ...state };
      delete copy[logicalLayerId];
      state = copy;
      schedule((dispatch) => dispatch(layer.unregister()));
    });

    onAction('mountLayers', (layersIds) => {
      // TODO: implement mount layers by id from registry
    });

    return state;
  },
  '[Shared state] logicalLayersRegistryAtom',
);

/**
 * This atom subscribe to all atoms in registry and save their states.
 * Read only
 * Don't use it if yoi need only one layer state
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

      const [oldAtoms, newAtoms] = Object.values(atomsList).reduce(
        (acc, a) => ((state[a.id] ? acc[0] : acc[1]).push(a), acc),
        atoms,
      );

      schedule((dispatch, ctx: registryStateAtomContext) => {
        ctx.unsubscribes = ctx.unsubscribes ?? {};
        const oldItemsIds = new Set(oldAtoms.map((a) => a.id));
        Object.keys(state).forEach((atomId) => {
          if (!oldItemsIds.has(atomId)) {
            const unsubscribe = ctx.unsubscribes![atomId];
            if (unsubscribe) unsubscribe();
          }
        });

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
