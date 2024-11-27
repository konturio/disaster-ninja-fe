import union from '@turf/union';
import type { Position, BBox } from 'geojson';

export class FeatureCollection {
  type = 'FeatureCollection' as const;
  features: GeoJSON.Feature[];
  constructor(features: GeoJSON.Feature[]) {
    this.features = features;
  }
}

export class Feature {
  type = 'Feature' as const;
  properties = {};
  geometry: GeoJSON.Geometry;
  constructor({
    geometry,
    properties,
  }: {
    geometry: GeoJSON.Geometry;
    properties?: Record<string, string | number>;
  }) {
    this.geometry = geometry;
    if (properties) this.properties = properties;
  }
}

export function readGeoJSON(file): Promise<GeoJSON.GeoJSON> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (event.target === null) return;
      const string = event.target.result?.toString();
      if (!string) return;
      try {
        const json = JSON.parse(string);
        if (json.type === 'geojson') return res(json.data);
        if (json.type !== 'FeatureCollection' && json.type !== 'Feature') {
          throw new Error('Not geoJSON format');
        }
        res(json);
      } catch (error) {
        rej(error);
      }
    };
    reader.onerror = (error) => rej(error);
    reader.readAsText(file);
  });
}

const isPolygonLike = (
  f: GeoJSON.Feature,
): f is GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> =>
  f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon';

export function mergeFeatureCollection(fc: GeoJSON.FeatureCollection) {
  let acc: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon,
    GeoJSON.GeoJsonProperties
  > | null = null;
  for (let i = 0; i < fc.features.length; i++) {
    const poly = fc.features[i];
    if (poly.geometry) {
      if (isPolygonLike(poly)) {
        if (acc === null) {
          acc = poly;
        } else {
          const mergeResult = union(acc, poly);
          if (mergeResult !== null) {
            acc = mergeResult;
          }
        }
      }
    }
  }
  return acc;
}

export class GeoJSONPoint implements GeoJSON.Point {
  type = 'Point' as const;
  coordinates: Position;
  bbox?: BBox | undefined;

  constructor(coordinates: Position, bbox?: BBox) {
    this.coordinates = coordinates;
    this.bbox = bbox;
  }
}

function isGeometryEmpty(geometry?: GeoJSON.Geometry | null): boolean {
  if (!geometry) return true;
  if (geometry.type !== 'GeometryCollection' && geometry.coordinates?.length) {
    return false;
  }
  if (geometry.type === 'GeometryCollection' && geometry.geometries?.length) {
    return false;
  }
  return true;
}

// Naive check for having any geometry in geojson
export function isGeoJSONEmpty(geoJSON?: GeoJSON.GeoJSON | null): boolean {
  if (!geoJSON) return true;
  switch (geoJSON.type) {
    case 'FeatureCollection':
      return !geoJSON.features?.length;
    case 'Feature':
      return isGeometryEmpty(geoJSON.geometry);
    default:
      return isGeometryEmpty(geoJSON);
  }
}
