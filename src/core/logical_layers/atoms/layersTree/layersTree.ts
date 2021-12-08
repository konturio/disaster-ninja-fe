import { logicalLayersHierarchyAtom } from '~core/shared_state';
import { createBindAtom } from '~utils/atoms';
import { layersCategoriesSettingsAtom } from '~core/shared_state/layersCategoriesSettings';
import { layersGroupsSettingsAtom } from '~core/shared_state/layersGroupsSettings';
import { createTree } from './createTree';
import { sortChildren } from './sortTree';

export const layersTreeAtom = createBindAtom(
  {
    registry: logicalLayersHierarchyAtom,
    categoriesSettings: layersCategoriesSettingsAtom,
    groupsSettings: layersGroupsSettingsAtom,
  },
  ({ get }, state = { children: [] }) => {
    const registry = get('registry');
    const categoriesSettings = get('categoriesSettings');
    const groupsSettings = get('groupsSettings');
    const layers = Object.values(registry);
    const tree = createTree(layers, { categoriesSettings, groupsSettings });
    tree.children = sortChildren(tree.children, {
      order: ['isGroup', 'isCategory'],
      inClusterSortField: 'order',
    });
    return tree;
  },
);
