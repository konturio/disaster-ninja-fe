import { createBindAtom } from '~utils/atoms/createBindAtom';
import { LogicalLayerAtom } from '~utils/atoms/createLogicalLayerAtom';

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
        if (alreadyRegistered) {
          willBeReplaced.push(state[logicalLayer.id]);
        }
        state = { ...state, [logicalLayer.id]: logicalLayer };
      });

      schedule((dispatch) =>
        dispatch(
          willBeReplaced
            .map((logicalLayer) => logicalLayer.unregister())
            .concat(logicalLayers.map((logicalLayer) => logicalLayer.init())),
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
