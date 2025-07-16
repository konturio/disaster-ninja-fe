import type { FeaturesPanelItem } from '~features/layer_features_panel/components/LayerFeaturesPanel/types';

// TODO: rewrite using path accessor so we can use nested properties
export function sortByNumericProperty(
  featureItems: FeaturesPanelItem[],
  propertyName: string,
  direction: 'asc' | 'desc' = 'desc',
) {
  const comparator = (a: FeaturesPanelItem, b: FeaturesPanelItem) =>
    direction === 'desc'
      ? -(a.properties?.[propertyName] - b.properties?.[propertyName])
      : a.properties?.[propertyName] - b.properties?.[propertyName];

  return featureItems.sort(comparator);
}
