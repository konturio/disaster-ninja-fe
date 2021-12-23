import { createBindAtom } from '~utils/atoms';
import { logicalLayersRegistryStateAtom } from '~core/logical_layers/atoms/logicalLayersRegistryState';

export const mountedLogicalLayersAtom = createBindAtom(
  {
    layersStates: logicalLayersRegistryStateAtom,
  },
  ({ get }) => {
    return Object.values(get('layersStates')).reduce(
      (acc, l) => (l.isMounted && acc.push(l.id), acc),
      [] as string[],
    );
  },
);
