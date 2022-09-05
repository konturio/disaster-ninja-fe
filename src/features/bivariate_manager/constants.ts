export const INTERCOM_ELEMENT_ID = 'intercom-lightweight-app';

// hard coded to HOT layers for now (task 7801)
export const IMPORTANT_BIVARIATE_LAYERS = [
  ['count', 'area_km2'],
  ['building_count', 'area_km2'],
  ['highway_length', 'area_km2'],
  ['local_hours', 'area_km2'],
  ['avgmax_ts', 'one'],
  ['days_mintemp_above_25c_1c', 'one'],
  ['population', 'area_km2'],
  ['total_hours', 'area_km2'],
  ['view_count', 'area_km2'],
];

export const GREETINGS_DISABLED_LS_KEY = 'bivariate-greetings-disabled';
