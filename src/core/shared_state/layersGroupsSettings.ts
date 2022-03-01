import { createAtom } from '~utils/atoms/createPrimitives';
import { GroupSettings } from '../types/layers';
import { groupSettings } from '~core/logical_layers/constants';

const defaultSettings: Record<string, GroupSettings> = groupSettings;

const settingsMock = new Proxy(defaultSettings, {
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

export const layersGroupsSettingsAtom = createAtom(
  {},
  ({}, state: Record<string, GroupSettings> = settingsMock) => {
    return state;
  },
  'layersGroupsSettingsAtom',
);
