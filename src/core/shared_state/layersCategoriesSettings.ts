import { createAtom } from '~utils/atoms';
import { CategorySettings } from '../types/layers';
import { categoriesSettings } from '~core/logical_layers/constants';

const defaultSettings: Record<string, CategorySettings> = categoriesSettings;

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

export const layersCategoriesSettingsAtom = createAtom(
  {},
  ({}, state: Record<string, CategorySettings> = settingsMock) => {
    return state;
  },
  'layersCategoriesSettingsAtom',
);
