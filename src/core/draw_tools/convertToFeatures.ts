import { point as createPointFeature } from '@turf/helpers';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import type { Feature } from 'geojson';

export function convertToFeatures(geometry: GeoJSON.FeatureCollection | GeoJSON.Feature) {
  if (geometry.type === 'FeatureCollection') {
    const withoutMultiPoints: Feature[] = geometry.features.reduce(
      (result: Feature[], currentFeature) => {
        if (currentFeature.geometry.type === 'MultiPoint') {
          currentFeature.geometry.coordinates.forEach((coordinate) =>
            result.push(createPointFeature(coordinate)),
          );
        } else {
          result.push(deepCopy(currentFeature));
        }
        return result;
      },
      [],
    );
    return withoutMultiPoints;
  } else if (geometry.type === 'Feature') {
    return [deepCopy(geometry)];
  } else {
    throw Error('Wrong type of data imported or the type is not supported');
  }
}
