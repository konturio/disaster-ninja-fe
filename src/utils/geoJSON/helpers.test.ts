import { describe, expect, it } from 'vitest';
import { isGeoJSONEmpty } from './helpers';

describe('isGeoJSONEmpty()', () => {
  it('returns true for geoJSON === undefined', () => {
    const geoJSON = null;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(true);
  });

  it('returns true for a FeatureCollection with empty features array', () => {
    const geoJSON = {
      type: 'FeatureCollection',
      features: [],
    } as GeoJSON.GeoJSON;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(true);
  });

  it('returns false for a FeatureCollection with non-empty features array', () => {
    const geoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [100.0, 100.0],
          },
        },
      ],
    } as GeoJSON.FeatureCollection;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(false);
  });

  it('returns true for a Feature with geometry === null', () => {
    const geoJSON = {
      type: 'Feature',
      geometry: null as unknown as GeoJSON.Geometry,
    } as GeoJSON.Feature;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(true);
  });

  it('returns true for a Feature with empty coordinates array', () => {
    const geoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [],
      } as GeoJSON.Geometry,
    } as GeoJSON.Feature;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(true);
  });

  it('returns false for a Feature with non-empty coordinates array', () => {
    const geoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [100.0, 100.0],
      },
    } as GeoJSON.Feature;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(false);
  });

  it('returns true for a Geometry with empty coordinates', () => {
    const geoJSON = {
      type: 'Polygon',
      coordinates: [],
    } as GeoJSON.Polygon;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(true);
  });

  it('returns false for a Feature with non-empty geometry', () => {
    const geoJSON = {
      type: 'Polygon',
      coordinates: [
        [
          [100.0, 100.0],
          [0, 0],
        ],
      ],
    } as GeoJSON.Polygon;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(false);
  });

  it('returns true for a GeometryCollection with empty geometries array', () => {
    const geoJSON = {
      type: 'GeometryCollection',
      geometries: [],
    } as GeoJSON.GeometryCollection;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(true);
  });

  it('returns false for a GeometryCollection with non-empty geometries array', () => {
    const geoJSON = {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Point',
          coordinates: [40.0, 10.0],
        },
        {
          type: 'LineString',
          coordinates: [
            [10.0, 10.0],
            [20.0, 20.0],
          ],
        },
      ],
    } as GeoJSON.GeometryCollection;
    expect(isGeoJSONEmpty(geoJSON)).toEqual(false);
  });
});
