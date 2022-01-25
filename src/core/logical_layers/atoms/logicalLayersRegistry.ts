import { createBindAtom } from '~utils/atoms/createBindAtom';
import { LogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import { enabledLayersAtom } from '~core/shared_state';

export const logicalLayersRegistryAtom = createBindAtom(
  {
    registerLayer: (logicalLayer: LogicalLayerAtom | LogicalLayerAtom[]) =>
      Array.isArray(logicalLayer) ? logicalLayer : [logicalLayer],
    unregisterLayer: (logicalLayerId: LogicalLayerAtom['id']) => logicalLayerId,
    mountLayers: (layersIds: string[]) => layersIds,
  },
  (
    { onAction, schedule, getUnlistedState },
    state: Record<LogicalLayerAtom['id'], LogicalLayerAtom> = {},
  ) => {
    onAction('registerLayer', (logicalLayers) => {
      const willBeReplaced: LogicalLayerAtom[] = [];
      logicalLayers.forEach((logicalLayer) => {
        const alreadyRegistered = state[logicalLayer.id] !== undefined;
        if (alreadyRegistered) willBeReplaced.push(state[logicalLayer.id]);

        state = { ...state, [logicalLayer.id]: logicalLayer };
      });

      const enabledLayers = getUnlistedState(enabledLayersAtom);
      let alreadyEnabled: typeof logicalLayers = [];
      if (enabledLayers) {
        alreadyEnabled = logicalLayers.filter((l) => enabledLayers.has(l.id));
      }

      schedule((dispatch) =>
        dispatch(
          willBeReplaced
            .map((l) => l.unregister())
            .concat(logicalLayers.map((l) => l.init()))
            .concat(alreadyEnabled.map((l) => l.mount())),
        ),
      );
    });

    onAction('unregisterLayer', (logicalLayerId) => {
      const layer = state[logicalLayerId];
      if (!layer) return console.warn('no layer with id', logicalLayerId);
      const copy = { ...state };
      delete copy[logicalLayerId];
      state = copy;
      schedule((dispatch) => {
        dispatch(layer.unregister());
      });
    });

    onAction('mountLayers', (layersIds) => {
      // TODO: implement mount layers by id from registry
    });

    return state;
  },
  '[Shared state] logicalLayersRegistryAtom',
);
