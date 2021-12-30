import { CategorySettings, GroupSettings } from '../types/layers';

export const categoriesSettings: Record<string, CategorySettings> = {
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
  layersInSelectedArea: {
    name: 'Layers in selected area',
    openByDefault: true,
    mutuallyExclusive: false,
    order: 0,
  },
  bivariate: {
    name: 'Kontur Analytics',
    openByDefault: true,
    mutuallyExclusive: true,
    order: 1,
  },
  qa: {
    name: 'QA',
    openByDefault: true,
    mutuallyExclusive: false,
    order: 2,
  },
  osmbasedmap: {
    name: 'OpenStreetMap Based',
    openByDefault: false,
    mutuallyExclusive: false,
    order: 3,
  },
  other: {
    name: 'Other',
    openByDefault: false,
    mutuallyExclusive: false,
    order: 999,
  },
  elevation: {
    name: 'Elevation',
    openByDefault: true,
    mutuallyExclusive: false,
  },
  photo: {
    name: 'Photo',
    openByDefault: true,
    mutuallyExclusive: false,
  },
  map: {
    name: 'Map',
    openByDefault: true,
    mutuallyExclusive: false,
  },
};
