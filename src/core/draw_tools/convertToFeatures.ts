import { point as createPointFeature } from '@turf/helpers';
import { Feature } from '~utils/geoJSON/helpers';

/**
 * Draw tools supports only limited subset of geojson:
 * FeatureCollection and Features with type geometry type Point, LineString or Polygon.
 * Here we trying to convert other types to allowed
 */
function normalizeGeometry(feature: GeoJSON.Feature): Array<GeoJSON.Feature> {
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

    case 'GeometryCollection':
      return feature.geometry.geometries
        .map((geometry) =>
          normalizeGeometry(
            new Feature({
              geometry,
            }),
          ),
        )
        .flat(1);

    default:
      console.error('Unsupported geometry type: ', feature.geometry.type);
      return [];
  }
}

export function convertToFeatures(
  geometry: GeoJSON.FeatureCollection | GeoJSON.Feature,
): Array<GeoJSON.Feature> {
  if (geometry.type === 'FeatureCollection') {
    return geometry.features.map((f) => normalizeGeometry(f)).flat(1);
  }

  if (geometry.type === 'Feature') {
    return normalizeGeometry(geometry);
  }

  // @ts-expect-error check for runtime error
  console.error('Unsupported geometry type: ', geometry.type);
  return [];
}
