import { createAtom } from '~utils/atoms/createPrimitives';
import { layersRegistryAtom } from '../atoms/layersRegistry';
import { layersSettingsAtom } from '../atoms/layersSettings';
import type { LayerAtom } from '../types/logicalLayer';

/**
 * This atom contain list of layers with their group and category settings
 * Useful for create tree of nested layers,
 * */
export type LogicalLayersHierarchy = Record<
  string,
  { id: string; atom: LayerAtom; group?: string; category?: string; order?: number }
>;
export const logicalLayersHierarchyAtom = createAtom(
  {
    layersRegistryAtom,
    layersSettingsAtom,
  },
  ({ get }, state: LogicalLayersHierarchy = {}) => {
    const registry = get('layersRegistryAtom');
    const settings = get('layersSettingsAtom');
    const newState: LogicalLayersHierarchy = {};

    registry.forEach((layer) => {
      const settingsData = settings.get(layer.id)?.data;
      newState[layer.id] = {
        id: layer.id,
        atom: layer,
        group: settingsData?.group,
        category: settingsData?.category,
        order: settingsData?.order,
      };
    });

    return newState;
  },
  '[Shared state] logicalLayersHierarchyAtom',
);
