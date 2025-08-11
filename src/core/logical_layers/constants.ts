import { i18n } from '~core/localization';
import type { CategorySettings, GroupSettings } from '../types/layers';

export const LAYER_BIVARIATE_PREFIX = 'bivariate-layer-';
export const SOURCE_BIVARIATE_PREFIX = 'bivariate-source-';

export const categoriesSettings: Record<string, CategorySettings> = {
  overlay: {
    name: i18n.t('categories.overlays'),
    openByDefault: true,
    mutuallyExclusive: false,
    order: 1,
  },
  base: {
    name: i18n.t('categories.basemap'),
    openByDefault: false,
    mutuallyExclusive: true,
    order: 2,
  },
};

export const groupSettings: Record<string, GroupSettings> = {
  layersInSelectedArea: {
    name: i18n.t('groups.layers_in_selected_area'),
    openByDefault: true,
    mutuallyExclusive: false,
    order: 0,
  },
  user_layers: {
    name: i18n.t('groups.your_layers'),
    openByDefault: true,
    mutuallyExclusive: false,
    order: 1,
  },
  bivariate: {
    name: i18n.t('groups.kontur_analytics'),
    openByDefault: true,
    mutuallyExclusive: true,
    order: 2,
  },
  axis: {
    name: i18n.t('groups.indicators'),
    openByDefault: false,
    mutuallyExclusive: true,
    order: 3,
  },
  qa: {
    name: i18n.t('groups.qa'),
    openByDefault: true,
    mutuallyExclusive: false,
    order: 4,
  },
  osmbasedmap: {
    name: i18n.t('groups.osmbasedmap'),
    openByDefault: false,
    mutuallyExclusive: false,
    order: 5,
  },
  other: {
    name: i18n.t('groups.other'),
    openByDefault: false,
    mutuallyExclusive: false,
    order: 999,
  },
  elevation: {
    name: i18n.t('groups.elevation'),
    openByDefault: true,
    mutuallyExclusive: false,
  },
  photo: {
    name: i18n.t('groups.photo'),
    openByDefault: true,
    mutuallyExclusive: false,
  },
  map: {
    name: i18n.t('groups.map'),
    openByDefault: true,
    mutuallyExclusive: false,
  },
};
