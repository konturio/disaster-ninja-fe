import type { FeatureCollection } from 'geojson';

export const SEARCH_HIGHLIGHT_LAYER_ID = 'search-highlight';
export const SEARCH_HIGHLIGHT_COLOR = '#000000';
export const EMPTY_HIGHLIGHT: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};
