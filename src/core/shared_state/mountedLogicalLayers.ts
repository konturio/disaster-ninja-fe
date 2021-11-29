import { createBindAtom } from '~utils/atoms/createBindAtom';
import { logicalLayersRegistryStateAtom } from './logicalLayersRegistry';

/**
 * Mounted layers
 * Read only
 **/
export const mountedLogicalLayersAtom = createBindAtom(
  {
    registryState: logicalLayersRegistryStateAtom,
  },
  ({ onChange }, state: string[] = []) => {
    onChange('registryState', (reg) => {
      const currentIds = Object.values(reg).reduce(
        (acc, lState) => (lState.isMounted && acc.push(lState.id), acc),
        [] as string[],
      );
      if (currentIds.length === state.length) {
        // Maybe similar. Need additional check
        const currentIdsSet = new Set(currentIds);
        if (state.every((id) => currentIdsSet.has(id))) {
          // Nothing changed, skip updated
          return state;
        }
      }
      state = currentIds;
    });
    return state;
  },
  '[Shared state] mountedLogicalLayersAtom',
);
