import { point as createPointFeature } from '@turf/helpers';
import { Feature } from '~utils/geoJSON/helpers';

/**
 * Draw tools supports only limited subset of geojson:
 * FeatureCollection and Features with type geometry type Point, LineString or Polygon.
 * Here we trying to convert other types to allowed
 */
function normalizeFeatureGeometry(feature: GeoJSON.Feature): Array<GeoJSON.Feature> {
  switch (feature.geometry.type) {
    case 'Point':
    case 'LineString':
    case 'Polygon':
      return [feature];

    case 'MultiPoint':
      return feature.geometry.coordinates.map((coords) => createPointFeature(coords));

    case 'MultiPolygon':
      return feature.geometry.coordinates.map(
        (coords) =>
          new Feature({
            geometry: {
              type: 'Polygon',
              coordinates: coords,
            },
          }),
      );

    case 'MultiLineString':
      return feature.geometry.coordinates.map(
        (coords) =>
          new Feature({
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          }),
      );

    case 'GeometryCollection':
      return feature.geometry.geometries
        .map((geometry) =>
          normalizeFeatureGeometry(
            new Feature({
              geometry,
            }),
          ),
        )
        .flat(1);

    default:
      // @ts-expect-error - check for runtime error
      console.error('Unsupported geometry type: ', feature.geometry.type);
      return [];
  }
}

export function convertToFeatures(geometry: GeoJSON.GeoJSON): Array<GeoJSON.Feature> {
  switch (geometry.type) {
    case 'FeatureCollection':
      return geometry.features.map((f) => normalizeFeatureGeometry(f)).flat(1);

    case 'Feature':
      return normalizeFeatureGeometry(geometry);

    case 'Point':
    case 'LineString':
    case 'Polygon':
    case 'GeometryCollection':
    case 'MultiPoint':
    case 'MultiPolygon':
    case 'MultiLineString':
      return normalizeFeatureGeometry(
        new Feature({
          geometry,
        }),
      );

    default:
      // @ts-expect-error - check for runtime error
      console.error('Unsupported geometry type: ', geometry.type);
      return [];
  }
}
