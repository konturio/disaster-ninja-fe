import { atom } from '@reatom/core';
import { onConnect, reatomAsync, withDataAtom, withErrorAtom } from '@reatom/framework';
import { groupSettings } from '~core/logical_layers/constants';
import { getLayerGroups } from '~core/api/layers';
import type { GroupSettings } from '../types/layers';

const defaultSettings: Record<string, GroupSettings> = groupSettings;

// returns a default settings value if specific group isn't found
const settingsProxy = (settings: Record<string, GroupSettings>) =>
  new Proxy(settings, {
    get(target, prop, receiver) {
      const originalValue = Reflect.get(target, prop, receiver);
      if (originalValue) return originalValue;
      return {
        name: prop,
        openByDefault: true,
        mutuallyExclusive: false,
        order: 100,
      };
    },
    set(target, prop, val, receiver) {
      return Reflect.set(target, prop, val, receiver);
    },
  });

export const layersGroupsSettingsAtom = atom((ctx) => {
  const groups = ctx.spy(layerGroupsResource.dataAtom)?.groups;
  return settingsProxy(groups ?? defaultSettings);
}, 'layersGroupsSettingsAtom');

const layerGroupsResource = reatomAsync((ctx) => {
  return getLayerGroups(ctx.controller);
}, 'categoriesAndGroupsResource').pipe(withDataAtom(null), withErrorAtom());

onConnect(layerGroupsResource, (ctx) => {
  const data = ctx.get(layerGroupsResource.dataAtom);
  const errorRaw = ctx.get(layerGroupsResource.errorAtom);
  if (!data || errorRaw) {
    // if no data yet, or if the previous fetch failed, refetch the data
    layerGroupsResource(ctx);
  }
});
