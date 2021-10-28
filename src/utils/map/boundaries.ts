type Option = { label: string; value: string | number };

export function constructOptionsFromBoundaries(
  boundaries: GeoJSON.FeatureCollection,
): Option[] {
  const { features } = boundaries;
  const sortedFeatures = features.sort(
    (f1, f2) => f2.properties?.admin_level - f1.properties?.admin_level,
  );
  const options: Option[] = [];
  for (const feat of sortedFeatures) {
    const id = feat.id;
    if (id !== undefined) {
      options.push({
        label: feat.properties?.name || id,
        value: id,
      });
    }
  }
  return options;
}

export function boundarySelector(boundaries: GeoJSON.FeatureCollection) {
  return (id: string) => {
    const feature = boundaries.features.find((boundary) => boundary.id === id);
    return {
      type: 'FeatureCollection' as const,
      features: [feature],
    };
  };
}
