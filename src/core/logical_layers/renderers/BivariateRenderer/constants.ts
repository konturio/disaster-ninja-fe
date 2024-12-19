import type { LineLayerSpecification } from 'maplibre-gl';

export const SOURCE_LAYER_BIVARIATE = 'stats';
export const FALLBACK_BIVARIATE_MIN_ZOOM = 0;
export const FALLBACK_BIVARIATE_MAX_ZOOM = 9;

export const FEATURE_STATES = {
  hover: 'hover',
  active: 'active',
} as const;

/**
 * TODO: move it to MCDA layer config
 * Create layer that will used for hover and click effects
 */

export const H3_HOVER_LAYER: Omit<LineLayerSpecification, 'id' | 'source'> = {
  type: 'line' as const,
  layout: {},
  paint: {
    'line-color': [
      'case',
      // prettier-ignore :active
      ['==', ['feature-state', FEATURE_STATES.active], true],
      'rgba(5, 22, 38, 1)',
      // prettier-ignore :hover
      ['==', ['feature-state', FEATURE_STATES.hover], true],
      'rgba(5, 22, 38, 0.4)',
      // not selected
      'rgba(0, 0, 0, 0)',
    ],
    'line-width': 1,
  },
};
