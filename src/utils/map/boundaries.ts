import { configRepo } from '~core/config';

export type BoundaryOption = { label: string; value: string | number };

function getLocalizedFeatureName(
  feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
): string {
  const configLang = configRepo.get().user?.language;
  if (feature.properties?.tags) {
    const tags = feature.properties.tags;
    // check language from the app config first,
    // then the list of browser's preferred languages
    const preferredLanguages = [configLang, ...navigator.languages];
    for (let i = 0; i < navigator.languages.length; i++) {
      if (tags[`name:${preferredLanguages[i]}`]) {
        return tags[`name:${preferredLanguages[i]}`];
      }
    }
    // then try international name
    if (tags['int_name']) {
      return tags['int_name'];
    }
  }
  // as a fallback, use feature name or if
  return feature.properties?.name || feature.id;
}

export function constructOptionsFromBoundaries(
  boundaries: GeoJSON.FeatureCollection | GeoJSON.Feature,
): BoundaryOption[] {
  const features =
    boundaries.type === 'FeatureCollection' ? boundaries.features : [boundaries];
  const sortedFeatures = features.sort(
    (f1, f2) => f2.properties?.admin_level - f1.properties?.admin_level,
  );
  const options: BoundaryOption[] = [];
  for (const feat of sortedFeatures) {
    const id = feat.id;
    if (id !== undefined) {
      options.push({
        label: getLocalizedFeatureName(feat),
        value: id,
      });
    }
  }
  return options;
}

export function boundarySelector(
  boundaries: GeoJSON.FeatureCollection | GeoJSON.Feature,
) {
  return (id: string) => {
    if (boundaries.type === 'FeatureCollection') {
      const feature = boundaries.features.find((boundary) => boundary.id === id);
      return {
        type: 'FeatureCollection' as const,
        features: feature ? [feature] : [],
      };
    } else {
      const features = boundaries.id === id ? [boundaries] : [];
      return {
        type: 'FeatureCollection' as const,
        features: features,
      };
    }
  };
}
