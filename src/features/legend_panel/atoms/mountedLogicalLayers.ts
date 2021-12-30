import { createBindAtom } from '~utils/atoms';
import { logicalLayersRegistryStateAtom } from '~core/logical_layers/atoms/logicalLayersRegistryState';
import { logicalLayersRegistryAtom } from '~core/logical_layers/atoms/logicalLayersRegistry';
import type { LogicalLayerAtom } from '~core/types/layers';

export const mountedLogicalLayersAtom = createBindAtom(
  {
    layersStates: logicalLayersRegistryStateAtom,
  },
  ({ get, getUnlistedState }) => {
    const registry = getUnlistedState(logicalLayersRegistryAtom);
    return Object.values(get('layersStates')).reduce((acc, l) => {
      if (l.isMounted) {
        acc.push(registry[l.id]);
      }
      return acc;
    }, [] as LogicalLayerAtom[]);
  },
);
