import { Action } from '@reatom/core';
import {
  layersCategoriesSettingsAtom,
  layersGroupsSettingsAtom,
} from '~core/shared_state';
import { CategorySettings, GroupSettings } from '~core/types/layers';
import {
  LogicalLayersHierarchy,
  logicalLayersHierarchyAtom,
} from '../atoms/logicalLayersHierarchy';

export const getRivalsLayersUnmountActions: (layerId: string) => Action[] =
  (() => {
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
            l.atom.getState().isMounted && acc.push(l.atom.disable());
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
            l.atom.getState().isMounted && acc.push(l.atom.disable());
          }
          return acc;
        }, [] as Action[]);
      }

      return [];
    };
  })();
