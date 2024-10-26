export const ContextMenuEditItem = 'edit_layer';
export const ContextMenuEditLayerFeaturesItem = 'edit_features';
export const ContextMenuDeleteLayerItem = 'delete_layer';

export type ContextMenuEditItemType =
  | typeof ContextMenuEditItem
  | typeof ContextMenuEditLayerFeaturesItem
  | typeof ContextMenuDeleteLayerItem;

export type ContextMenuItemType = {
  name: string;
  type: ContextMenuEditItemType;
};
