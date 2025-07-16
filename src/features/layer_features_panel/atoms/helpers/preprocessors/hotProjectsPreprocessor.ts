import type { Feature } from 'geojson';

export function hotProjectsPreprocessor(feature: Feature): Feature {
  const properties = feature.properties;
  if (properties?.['status'] === 'ARCHIVED') {
    properties['isArchived'] = true;
  }
  return feature;
}
