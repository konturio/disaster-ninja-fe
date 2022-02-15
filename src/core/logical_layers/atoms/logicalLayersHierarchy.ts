import type { LogicalLayerAtom } from '~core/types/layers';
import { createAtom } from '~utils/atoms';
import { logicalLayersRegistryAtom } from './logicalLayersRegistry';

/**
 * This atom contain categories, and groups of atoms
 * Category and group read once when atom added in registry.
 * Don't mutate category and groups in atom, after it was added in registry - it will be ignored
 * Refreshed when atom added or removed from registry
 * Read only
 * */
export type LogicalLayersHierarchy = Record<
  string,
  { id: string; atom: LogicalLayerAtom; group?: string; category?: string }
>;
export const logicalLayersHierarchyAtom = createAtom(
  {
    register: logicalLayersRegistryAtom.registerLayer,
    unregister: logicalLayersRegistryAtom.unregisterLayer,
  },
  ({ onAction, getUnlistedState }, state: LogicalLayersHierarchy = {}) => {
    onAction('register', (layers) => {
      const newState = { ...state };
      layers.forEach((l) => {
        const { layer } = getUnlistedState(l);
        const { group, category } = layer;
        newState[l.id] = {
          id: l.id,
          atom: l,
          group,
          category,
        };
      });
      state = newState;
    });

    onAction('unregister', (layersId) => {
      const newState = { ...state };
      layersId.forEach((layerId) => {
        delete newState[layerId];
      });
      state = newState;
    });

    return state;
  },
  '[Shared state] logicalLayersHierarchyAtom',
);
