import { HOT_PROJECTS_LAYER_ID } from '~features/layer_features_panel/constants';
import { sortByNumber } from '~utils/common/sorting';
import type { FeaturesPanelItem } from '~features/layer_features_panel/components/LayerFeaturesPanel/types';

export function sortFeaturesPanelItems(
  features: FeaturesPanelItem[],
  featuresPanelLayerId?: string,
): void {
  switch (featuresPanelLayerId) {
    case HOT_PROJECTS_LAYER_ID:
      sortByNumber(features, (feature) => feature.properties?.['projectId'], 'desc');
      break;
    default:
      // do nothing
      break;
  }
}
