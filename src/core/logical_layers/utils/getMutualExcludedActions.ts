import { enabledLayersAtom } from '../atoms/enabledLayers';
import { layersSettingsAtom } from '../atoms/layersSettings';

import { layersGroupsSettingsAtom } from '~core/shared_state/layersGroupsSettings';
import { layersCategoriesSettingsAtom } from '~core/shared_state/layersCategoriesSettings';

// import { LogicalLayersHierarchy, logicalLayersHierarchyAtom } from '../atoms/layersHierarchy';
import type { CategorySettings, GroupSettings } from '~core/types/layers';
import type { LogicalLayerState } from '../types/logicalLayer';
import { LayerSettings } from '../types/settings';
import { AsyncState } from '../types/asyncState';

export const getMutualExcludedActions = (() => {
  let groupsSettings: Record<string, GroupSettings> | null = null;
  layersGroupsSettingsAtom.subscribe((s) => (groupsSettings = s));

  let categorySettings: Record<string, CategorySettings> | null = null;
  layersCategoriesSettingsAtom.subscribe((s) => (categorySettings = s));

  let enabledLayers: Set<string> | null = null;
  enabledLayersAtom.subscribe((s) => (enabledLayers = s));

  let layersSettings: Map<string, AsyncState<LayerSettings | null>> | null =
    null;
  layersSettingsAtom.subscribe((s) => (layersSettings = s));

  return (state: LogicalLayerState) => {
    if (
      !groupsSettings ||
      !categorySettings ||
      !enabledLayers ||
      !layersSettings
    ) {
      return [];
    }
    const targetLayerCategory = state.settings?.category;
    const targetLayerGroup = state.settings?.group;
    const isInMutuallyExclusiveCategory =
      targetLayerCategory &&
      categorySettings[targetLayerCategory]?.mutuallyExclusive;
    const isInMutuallyExclusiveGroup =
      targetLayerGroup && groupsSettings[targetLayerGroup]?.mutuallyExclusive;

    if (!isInMutuallyExclusiveCategory && !isInMutuallyExclusiveGroup) {
      return [];
    }

    const mutualExcludeIds: Set<string> = new Set();

    enabledLayers.forEach((enabledLayerId) => {
      if (state.id === enabledLayerId) return; // Don't disable yourself

      const enabledLayerSettings = layersSettings!.get(enabledLayerId);
      if (!enabledLayerSettings) return;

      if (isInMutuallyExclusiveCategory) {
        if (enabledLayerSettings.data?.category === targetLayerCategory) {
          mutualExcludeIds.add(enabledLayerId);
        }
      }
      // If layer in mutuallyExclusive category mutuallyExclusive group setting can be ignored
      else if (isInMutuallyExclusiveGroup) {
        if (enabledLayerSettings.data?.group === targetLayerGroup) {
          mutualExcludeIds.add(enabledLayerId);
        }
      }
    });

    return Array.from(mutualExcludeIds).map((id) =>
      enabledLayersAtom.delete(id),
    );
  };
})();
