import type { LayerAtom } from '../../types/logicalLayer';
import type { CategorySettings, GroupSettings, Tree } from '~core/types/layers';

export function createTree(
  layers: {
    id: string;
    atom: LayerAtom;
    category?: string;
    group?: string;
    order?: number;
  }[],
  {
    categoriesSettings,
    groupsSettings,
  }: {
    categoriesSettings: { [x: string]: CategorySettings };
    groupsSettings: { [x: string]: GroupSettings };
  },
) {
  const categories = new Map();
  const groups = new Map();
  // Categories may have groups with same names
  const getUniqueGroupKey = (layer: { category?: string; group?: string }) =>
    layer.category ? `${layer.category}__${layer.group}` : layer.group;

  const tree: Tree = {
    children: [],
  };

  layers.forEach((layer) => {
    if (layer.category && !layer.group) {
      // this is error handling case - we expect layers that have category to also have group name
      layer.group = 'Undefined group';
    }
    if (!layer.group) {
      // It's a root layer, because layer without group can't be children of category too
      tree.children.push(layer);
      return;
    }

    /* Create category if not exist */
    if (layer.category && !categories.has(layer.category)) {
      const categorySettings = categoriesSettings[layer.category] ?? {};
      const category = {
        ...categorySettings,
        isCategory: true as const,
        id: layer.category,
        children: [],
      };
      categories.set(layer.category, category);
      tree.children.push(category);
    }

    /* Create group if not exist */
    const groupKey = getUniqueGroupKey(layer);
    if (!groups.has(groupKey)) {
      const groupSettings = groupsSettings[layer.group] ?? {};
      const group = {
        ...groupSettings,
        isGroup: true as const,
        id: layer.group,
        children: [],
      };
      groups.set(groupKey, group);
      if (layer.category) {
        const category = categories.get(layer.category);
        category.children.push(group);
      } else {
        tree.children.push(group);
      }
    }

    /* Add layer to group */
    const group = groups.get(groupKey);
    group.children.push(layer);
  });

  return tree;
}
