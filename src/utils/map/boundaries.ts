import { configRepo } from '~core/config';

export type BoundaryOption = { label: string; value: string | number };

export function getLocalizedFeatureName(
  feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>,
  preferredLanguage: string,
): string {
  if (feature.properties?.tags) {
    const tags = feature.properties.tags;
    // check names for preferred language first

    if (tags[`name:${preferredLanguage}`]) {
      return tags[`name:${preferredLanguage}`];
    }

    // then try international name
    if (tags['int_name']) {
      return tags['int_name'];
    }
  }
  // as a fallback, use feature name or id
  return (feature.properties?.name || feature.id) as string;
}

export function constructOptionsFromBoundaries(
  boundaries: GeoJSON.FeatureCollection | GeoJSON.Feature[],
): BoundaryOption[] {
  const features = Array.isArray(boundaries) ? boundaries : boundaries.features;
  const sortedFeatures = features.sort(
    (f1, f2) => f2.properties?.admin_level - f1.properties?.admin_level,
  );

  const preferredLanguage =
    configRepo.get().user?.language || configRepo.get().defaultLanguage;
  const options: BoundaryOption[] = [];
  for (const feat of sortedFeatures) {
    const id = feat.id;
    if (id !== undefined) {
      options.push({
        label: getLocalizedFeatureName(feat, preferredLanguage),
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
