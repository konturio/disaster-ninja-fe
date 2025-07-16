import { HOT_PROJECTS_LAYER_ID } from '~features/layer_features_panel/constants';
import { sortByNumber } from '~utils/common/sorting';
import type { FeaturesPanelItem } from '~features/layer_features_panel/components/LayerFeaturesPanel/types';

// TODO: Temporary solution, sorting should be implemented on BE side.
// Right now, BE can only sort ids alphabetically. HOT projects needs numerical sorting of stringified numbers
export function sortFeaturesPanelItems(
  features: FeaturesPanelItem[],
  featuresPanelLayerId?: string,
): void {
  switch (featuresPanelLayerId) {
    case HOT_PROJECTS_LAYER_ID:
      sortByNumber(features, (feature) => feature.id, 'desc');
      break;
    default:
      // do nothing
      break;
  }
}
