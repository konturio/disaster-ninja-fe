import { GroupSettings, CategorySettings } from '../types/layers';

export const categoriesSettings: Record<string, CategorySettings> = {
  'Layers in selected area': {
    name: 'Layers in selected area',
    openByDefault: true,
    mutuallyExclusive: false,
    order: 0,
  },
  overlay: {
    name: 'Overlays',
    openByDefault: true,
    mutuallyExclusive: false,
    order: 1,
  },
  base: {
    name: 'Basemap',
    openByDefault: false,
    mutuallyExclusive: true,
    order: 2,
  },
};

export const groupSettings: Record<string, GroupSettings> = {
  bivariate: {
    name: 'Bivariate',
    openByDefault: true,
    mutuallyExclusive: true,
    order: 1,
  },
  Other: {
    name: 'Other',
    openByDefault: false,
    mutuallyExclusive: false,
    order: 999,
  },
  Kontur: {
    name: 'Kontur',
    openByDefault: true,
    mutuallyExclusive: true,
    order: 2,
  },
};
