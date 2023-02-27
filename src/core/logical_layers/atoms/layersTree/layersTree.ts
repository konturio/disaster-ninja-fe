import { createAtom } from '~utils/atoms/createPrimitives';
import { layersCategoriesSettingsAtom } from '~core/shared_state/layersCategoriesSettings';
import { layersGroupsSettingsAtom } from '~core/shared_state/layersGroupsSettings';
import { logicalLayersHierarchyAtom } from '../layersHierarchy';
import { createTree } from './createTree';
import { sortChildren } from './sortTree';

export const layersTreeAtom = createAtom(
  {
    logicalLayersHierarchyAtom,
    layersCategoriesSettingsAtom,
    layersGroupsSettingsAtom,
  },
  ({ get }, state = { children: [] }) => {
    const hierarchy = get('logicalLayersHierarchyAtom');
    const categoriesSettings = get('layersCategoriesSettingsAtom');
    const groupsSettings = get('layersGroupsSettingsAtom');
    const layers = Object.values(hierarchy);
    const tree = createTree(layers, { categoriesSettings, groupsSettings });
    tree.children = sortChildren(tree.children, {
      order: ['isGroup', 'isCategory'],
      inClusterSortField: 'order',
    });
    return tree;
  },
  'layersTreeAtom',
);
