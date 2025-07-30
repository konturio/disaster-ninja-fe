import { describe, it, expect } from 'vitest';
import { filterFeaturesContainingPoint } from './breadcrumbsHelpers';

const featureA: GeoJSON.Feature = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0, 10],
        [10, 10],
        [10, 0],
        [0, 0],
      ],
    ],
  },
  properties: {},
};

const featureB: GeoJSON.Feature = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [10, 10],
        [10, 20],
        [20, 20],
        [20, 10],
        [10, 10],
      ],
    ],
  },
  properties: {},
};

describe('filterFeaturesContainingPoint', () => {
  it('returns all features if point lies inside each', () => {
    const result = filterFeaturesContainingPoint([featureA], [5, 5]);
    expect(result).toEqual([featureA]);
  });

  it('filters out features that do not contain point', () => {
    const result = filterFeaturesContainingPoint([featureA, featureB], [5, 5]);
    expect(result).toEqual([featureA]);
  });

  it('returns empty array when no feature contains point', () => {
    const result = filterFeaturesContainingPoint([featureA], [15, 15]);
    expect(result).toEqual([]);
  });
});
