import { LogicalLayer, LogicalLayerAtomState } from '~core/logical_layers/createLogicalLayerAtom';
import { logicalLayersRegistryStateAtom } from '~core/shared_state';
import { createBindAtom } from '~utils/atoms';

export const bivariateLayersGroupAtom = createBindAtom({
  setBivariateIds: (ids: string[]) => ids,
  registry: logicalLayersRegistryStateAtom
},
  ({ onAction, get, onChange }, state: { ids: string[], activeLayer?: LogicalLayer | null } = { ids: [], activeLayer: null }) => {

    onAction('setBivariateIds', ids => {
      const registry = get('registry')
      state = { ...state, ids, activeLayer: findActiveLayer(ids, registry) }
    })

    onChange('registry', registry => {
      state = { ...state, activeLayer: findActiveLayer(state.ids, registry) }
    })

    return state
  })

function findActiveLayer(ids: string[], registry: Record<string, LogicalLayerAtomState>): LogicalLayer | null | undefined {
  const activeId = ids.find(id => registry[id] && registry[id].isMounted);
  return activeId ? registry[activeId].layer : null;
}
