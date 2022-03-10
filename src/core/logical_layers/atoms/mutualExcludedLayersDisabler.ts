import { createAtom } from '~utils/atoms';
import { enabledLayersAtom } from '../atoms/enabledLayers';
import {
  layersCategoriesSettingsAtom,
  layersGroupsSettingsAtom,
} from '~core/shared_state';
import { logicalLayersHierarchyAtom } from '../atoms/layersHierarchy';

export const mutualExcludedLayersDisablerAtom = createAtom(
  {
    enabledLayersAtom,
  },
  ({ onChange, getUnlistedState, schedule }) => {
    onChange('enabledLayersAtom', (next, prev) => {
      if (prev === undefined) return; // Initial change
      const changeAfterEnableAction = next.size > (prev?.size ?? 0);
      if (changeAfterEnableAction) {
        const layerId = Array.from(next).find((id) => !prev.has(id))!; // Find new id
        const groupsSettings = getUnlistedState(layersGroupsSettingsAtom);
        const categorySettings = getUnlistedState(layersCategoriesSettingsAtom);
        const hierarchy = getUnlistedState(logicalLayersHierarchyAtom);
        schedule((dispatch) => {
          const enabledLayers = next;
          // If layer in mutuallyExclusive category (group mutuallyExclusive setting can be ignored)
          const layerCategory = hierarchy[layerId]?.category;
          let ids: string[] = [];
          if (
            layerCategory &&
            categorySettings[layerCategory]?.mutuallyExclusive
          ) {
            // get all mounted layers in this category excluding layer with layerId;
            ids = Object.values(hierarchy).reduce((acc, l) => {
              if (l.category === layerCategory && l.id !== layerId) {
                enabledLayers.has(l.id) && acc.push(l.id);
              }
              return acc;
            }, [] as string[]);
          }

          // If layer in mutuallyExclusive group
          const layerGroup = hierarchy[layerId]?.group;
          if (layerGroup && groupsSettings[layerGroup]?.mutuallyExclusive) {
            // get all mounted layers in this group excluding layer with layerId;
            ids = Object.values(hierarchy).reduce((acc, l) => {
              if (l.group === layerGroup && l.id !== layerId) {
                enabledLayers.has(l.id) && acc.push(l.id);
              }
              return acc;
            }, [] as string[]);
          }
          if (ids.length) {
            dispatch(ids.map((id) => enabledLayersAtom.delete(id)));
          }
        });
      }
    });
  },
);
