import { createBindAtom } from '~utils/atoms/createBindAtom';
import { LogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import { enabledLayersAtom } from '~core/shared_state';
import { Action } from '@reatom/core';

export const logicalLayersRegistryAtom = createBindAtom(
  {
    registerLayer: (logicalLayer: LogicalLayerAtom | LogicalLayerAtom[]) =>
      Array.isArray(logicalLayer) ? logicalLayer : [logicalLayer],
    unregisterLayer: (
      logicalLayerId: LogicalLayerAtom['id'] | LogicalLayerAtom['id'][],
    ) => (Array.isArray(logicalLayerId) ? logicalLayerId : [logicalLayerId]),
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

      const actions = willBeReplaced
        .map((l) => l.unregister())
        .concat(logicalLayers.map((l) => l.init()))
        .concat(alreadyEnabled.map((l) => l.mount()));

      actions.length && schedule((dispatch) => dispatch(actions));
    });

    onAction('unregisterLayer', (logicalLayerIds) => {
      const actions: Action[] = [];
      const copy = { ...state };
      logicalLayerIds.forEach((logicalLayerId) => {
        const layer = state[logicalLayerId];
        if (!layer) return console.warn('no layer with id', logicalLayerId);
        delete copy[logicalLayerId];
        actions.push(layer.unregister(), layer.unmount());
      });
      state = copy;

      actions.length &&
        schedule((dispatch) => {
          dispatch(actions);
        });
    });

    return state;
  },
  '[Shared state] logicalLayersRegistryAtom',
);
