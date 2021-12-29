import type { LogicalLayerAtom } from '~core/types/layers';

export interface Layer {
  id: string;
  atom: LogicalLayerAtom;
  group?: string;
  category?: string;
  order?: number;
}

export interface Group {
  id: string;
  isGroup: true;
  children: Layer[];
}

export interface GroupSettings {
  name: string;
  openByDefault: boolean;
  mutuallyExclusive: boolean;
  order?: number;
}

export type GroupWithSettings = Group & GroupSettings;

export interface Category {
  id: string;
  isCategory: true;
  children: GroupWithSettings[];
}

export interface CategorySettings {
  name: string;
  openByDefault: boolean;
  mutuallyExclusive: boolean;
  order?: number;
}

export type CategoryWithSettings = Category & CategorySettings;

export type TreeChildren = CategoryWithSettings | GroupWithSettings | Layer;

export interface Tree {
  children: TreeChildren[];
}

export type { LogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
