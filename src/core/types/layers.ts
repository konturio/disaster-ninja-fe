import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';

export interface Layer {
  id: string;
  atom: LayerAtom;
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

export interface LayerGroupSettingsDTO {
  groups: Record<string, GroupSettings>;
}

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
