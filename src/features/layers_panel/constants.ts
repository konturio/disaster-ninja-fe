import {
  ContextMenuDeleteLayerItem,
  ContextMenuEditItem,
  ContextMenuEditLayerFeaturesItem,
} from '~features/layers_panel/types';
import type { ContextMenuItemType } from '~features/layers_panel/types';

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

export const LAYERS_PANEL_FEATURE_ID = 'layers-panel';
