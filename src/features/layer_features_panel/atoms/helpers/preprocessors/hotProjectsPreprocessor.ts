export function hotProjectsPreprocessor(properties: object) {
  if (properties?.['status'] === 'ARCHIVED') {
    properties['isArchived'] = true;
  }
  return properties;
}
