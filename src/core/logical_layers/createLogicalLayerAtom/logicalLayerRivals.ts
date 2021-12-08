import { Action } from '@reatom/core';
import {
  layersGroupsSettingsAtom,
  layersCategoriesSettingsAtom,
  logicalLayersRegistryAtom,
} from '~core/shared_state';
import { CategorySettings, GroupSettings } from '~core/types/layers';
import {
  logicalLayersHierarchyAtom,
  LogicalLayersHierarchy,
} from '../atoms/logicalLayersHierarchy';

import { logicalLayersRegistryStateAtom } from '../atoms/logicalLayersRegistryState';

export const getRivalsLayersUnmountActions: (layerId: string) => Action[] =
  (() => {
    let registry = {};
    logicalLayersRegistryAtom.subscribe((reg) => (registry = reg));

    let layerStates = {};
    logicalLayersRegistryStateAtom.subscribe(
      (states) => (layerStates = states),
    );

    let hierarchy: LogicalLayersHierarchy = {};
    logicalLayersHierarchyAtom.subscribe(
      (logicalLayersHierarchy) => (hierarchy = logicalLayersHierarchy),
    );

    let categorySettings: Record<string, CategorySettings> = {};
    layersCategoriesSettingsAtom.subscribe(
      (settings) => (categorySettings = settings),
    );

    let groupsSettings: Record<string, GroupSettings> = {};
    layersGroupsSettingsAtom.subscribe(
      (settings) => (groupsSettings = settings),
    );

    return (layerId: string) => {
      // If layer in mutuallyExclusive category (group mutuallyExclusive setting can be ignored)
      const layerCategory = hierarchy[layerId]?.category;
      if (layerCategory && categorySettings[layerCategory]?.mutuallyExclusive) {
        // get all mounted layers in this category excluding layer with layerId;
        return Object.values(hierarchy).reduce((acc, l) => {
          if (l.category === layerCategory && l.id !== layerId) {
            layerStates[l.id].isMounted && acc.push(registry[l.id].unmount());
          }
          return acc;
        }, [] as Action[]);
      }

      // If layer in mutuallyExclusive group
      const layerGroup = hierarchy[layerId]?.group;
      if (layerGroup && groupsSettings[layerGroup]?.mutuallyExclusive) {
        // get all mounted layers in this group excluding layer with layerId;
        return Object.values(hierarchy).reduce((acc, l) => {
          if (l.group === layerGroup && l.id !== layerId) {
            layerStates[l.id].isMounted && acc.push(registry[l.id].unmount());
          }
          return acc;
        }, [] as Action[]);
      }

      return [];
    };
  })();
