/**
 * @vitest-environment happy-dom
 */
import { test, expect } from 'vitest';
import { createBivariateQuery } from './createBivariateGraphQLQuery';
import type { FeatureCollection } from 'geojson';
import type { FocusedGeometry, GeometrySource } from '~core/focused_geometry/types';

test('createBivariateQuery - cleans prefilled properties', () => {
  const geometry: FocusedGeometry = {
    geometry: {
      type: 'FeatureCollection',
      hash: 'test_hash',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'GeometryCollection',
            geometries: [
              {
                type: 'Point',
                coordinates: [20.295271289, 9.005330067],
              },
            ],
          },
          properties: { a: 1 },
        },
      ],
    },
    source: { type: 'event', meta: {} } as GeometrySource,
  };
  const body = createBivariateQuery(geometry.geometry);

  expect(body.importantLayers.length).toBeGreaterThan(0);
  expect((body.geoJSON as FeatureCollection).features?.[0]?.properties).toEqual({});
});
