import { expect, test } from 'vitest';
import { translateByCenter } from './translateByCenter';
import type { Feature as TurfFeature, Geometry } from '@turf/helpers';
// I used types from geojson because they're generic and helps me with intellisense
import type {
  Feature as GenericFeature,
  Point,
  MultiPoint,
  LineString,
  Polygon,
  MultiPolygon,
} from 'geojson';

type Feature = TurfFeature<Geometry>;

test('Point coordinates in right format', () => {
  const feature: GenericFeature<Point> = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0, 0],
    },
    properties: {},
  };
  const result = translateByCenter(
    feature as Feature,
    100,
    100,
  ) as GenericFeature<Point>;
  expect(result.geometry.coordinates).toBeTypeOf('object');
  expect(result.geometry.coordinates.length).toBeDefined();
});

test('MultiPoint coordinates in right format', () => {
  const feature: GenericFeature<MultiPoint> = {
    type: 'Feature',
    geometry: {
      type: 'MultiPoint',
      coordinates: [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    },
    properties: {},
  };
  const result = translateByCenter(
    feature as Feature,
    100,
    100,
  ) as GenericFeature<MultiPoint>;
  expect(result.geometry.coordinates[0]).toBeTypeOf('object');
  expect(result.geometry.coordinates[0].length).toBeDefined();
  expect(result.geometry.coordinates[1]).toBeTypeOf('object');
  expect(result.geometry.coordinates[1].length).toBeDefined();
  expect(result.geometry.coordinates[2]).toBeTypeOf('object');
  expect(result.geometry.coordinates[2].length).toBeDefined();
});

test('LineString coordinates in right format', () => {
  const feature: GenericFeature<LineString> = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [1, 1],
        [2, 2],
      ],
    },
    properties: {},
  };
  const result = translateByCenter(
    feature as Feature,
    100,
    100,
  ) as GenericFeature<LineString>;
  expect(result.geometry.coordinates[0]).toBeTypeOf('object');
  expect(result.geometry.coordinates[0].length).toBeDefined();
  expect(result.geometry.coordinates[1]).toBeTypeOf('object');
  expect(result.geometry.coordinates[1].length).toBeDefined();
});

test('Polygon coordinates in right format', () => {
  const feature: GenericFeature<Polygon> = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [0, 1],
          [2, 2],
        ],
      ],
    },
    properties: {},
  };
  const result = translateByCenter(
    feature as Feature,
    100,
    100,
  ) as GenericFeature<Polygon>;
  expect(result.geometry.coordinates[0][0]).toBeTypeOf('object');
  expect(result.geometry.coordinates[0][0].length).toBeDefined();
  expect(result.geometry.coordinates[0][1]).toBeTypeOf('object');
  expect(result.geometry.coordinates[0][1].length).toBeDefined();
  expect(result.geometry.coordinates[0][2]).toBeTypeOf('object');
  expect(result.geometry.coordinates[0][2].length).toBeDefined();

  expect(result.geometry.coordinates[0][3]).toBeUndefined();
  expect(result.geometry.coordinates[1]).toBeUndefined();
});

test('Polygon coordinates in right format', () => {
  const feature: GenericFeature<MultiPolygon> = {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [0, 0],
            [0, 1],
            [2, 2],
          ],
          [
            [3, 3],
            [5, 3],
            [5, 5],
          ],
        ],
      ],
    },
    properties: {},
  };
  const result = translateByCenter(
    feature as Feature,
    100,
    100,
  ) as GenericFeature<MultiPolygon>;
  expect(result.geometry.coordinates[0][0][0]).toBeTypeOf('object');
  expect(result.geometry.coordinates[0][0][0].length).toBeDefined();
  expect(result.geometry.coordinates[0][0][1]).toBeTypeOf('object');
  expect(result.geometry.coordinates[0][0][1].length).toBeDefined();
  expect(result.geometry.coordinates[0][0][2]).toBeTypeOf('object');
  expect(result.geometry.coordinates[0][0][2].length).toBeDefined();
  expect(result.geometry.coordinates[0][1][2]).toBeTypeOf('object');
  expect(result.geometry.coordinates[0][1][2].length).toBeDefined();

  expect(result.geometry.coordinates[0][1][3]).toBeUndefined();
  expect(result.geometry.coordinates[0][2]).toBeUndefined();
});
