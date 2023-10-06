import union from '@turf/union';
import type { Position, BBox } from 'geojson';

// eslint-disable-next-line import/prefer-default-export
export function createGeoJSONSource(
  featureCollection: GeoJSON.FeatureCollection | GeoJSON.Feature = {
    type: 'FeatureCollection' as const,
    features: [],
  },
) {
  return {
    type: 'geojson' as const,
    data: featureCollection,
  };
}

export class FeatureCollection {
  type = 'FeatureCollection' as const;
  features: GeoJSON.Feature[];
  constructor(features: GeoJSON.Feature[]) {
    this.features = features;
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
