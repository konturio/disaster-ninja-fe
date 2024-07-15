import { createAtom } from '~utils/atoms/createPrimitives';
import { layersCategoriesSettingsAtom } from '~core/shared_state/layersCategoriesSettings';
import { layersGroupsSettingsAtom } from '~core/shared_state/layersGroupsSettings';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { referenceAreaAtomV2 } from '~core/shared_state/referenceArea';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { REFERENCE_AREA_LOGICAL_LAYER_ID } from '~features/reference_area/constants';
import { logicalLayersHierarchyAtom } from '../layersHierarchy';
import { sortChildren } from './sortTree';
import { createTree } from './createTree';

export const layersTreeAtom = createAtom(
  {
    logicalLayersHierarchyAtom,
    layersCategoriesSettingsAtom,
    layersGroupsSettingsAtom,
    referenceAreaAtomV2,
    focusedGeometryAtom,
  },
  ({ get }, state = { children: [] }) => {
    const hierarchy = get('logicalLayersHierarchyAtom');
    const categoriesSettings = get('layersCategoriesSettingsAtom');
    const groupsSettings = get('layersGroupsSettingsAtom');
    const focusedGeometry = get('focusedGeometryAtom');
    const referenceGeometry = get('referenceAreaAtomV2');

    const layers = Object.values(hierarchy).filter((layer) => {
      if (layer.id === FOCUSED_GEOMETRY_LOGICAL_LAYER_ID) return focusedGeometry;
      if (layer.id === REFERENCE_AREA_LOGICAL_LAYER_ID) return referenceGeometry;
      else return true;
    });

    const tree = createTree(layers, { categoriesSettings, groupsSettings });
    tree.children = sortChildren(tree.children, {
      order: ['isGroup', 'isCategory'],
      inClusterSortField: 'order',
    });
    return tree;
  },
  'layersTreeAtom',
);
