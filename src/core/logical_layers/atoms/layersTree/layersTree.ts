import { atom } from '@reatom/framework';
import { layersCategoriesSettingsAtom } from '~core/shared_state/layersCategoriesSettings';
import { layersGroupsSettingsAtom } from '~core/shared_state/layersGroupsSettings';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { referenceAreaAtom } from '~core/shared_state/referenceArea';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { REFERENCE_AREA_LOGICAL_LAYER_ID } from '~features/reference_area/constants';
import { logicalLayersHierarchyAtom } from '../layersHierarchy';
import { sortChildren } from './sortTree';
import { createTree } from './createTree';
import type { Tree } from '~core/types/layers';

export const layersTreeAtom = atom<Tree>((ctx) => {
  const hierarchy = ctx.spy(logicalLayersHierarchyAtom.v3atom);
  const categoriesSettings = ctx.spy(layersCategoriesSettingsAtom.v3atom);
  const groupsSettings = ctx.spy(layersGroupsSettingsAtom.v3atom);
  const focusedGeometry = ctx.spy(focusedGeometryAtom.v3atom);
  const referenceGeometry = ctx.spy(referenceAreaAtom);

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
}, 'layersTreeAtom');
