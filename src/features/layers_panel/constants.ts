import {
  ContextMenuDeleteLayerItem,
  ContextMenuEditItem,
  ContextMenuEditLayerFeaturesItem,
  ContextMenuItemType,
} from '~features/layers_panel/types';

export const CONTEXT_MENU_ITEMS: ContextMenuItemType[] = [
  {
    name: 'Edit layer',
    type: ContextMenuEditItem,
  },
  {
    name: 'Edit features',
    type: ContextMenuEditLayerFeaturesItem,
  },
  {
    name: 'Delete',
    type: ContextMenuDeleteLayerItem,
  },
];
