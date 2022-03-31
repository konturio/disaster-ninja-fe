import type { Action } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';
import type { EditableLayerSettings } from '../types';
import { editableLayersListResource } from './editableLayersListResource';

export const editableLayerSettingsAtom = createAtom(
  {
    editableLayersListResource,
  },
  ({ get }, state = new Map<string, EditableLayerSettings>()) => {
    const { loading, error, data } = get('editableLayersListResource');
    if (loading) return state;
    if (error) return null;
    if (!data) return null;

    return data.reduce((acc, d) => {
      d.featureProperties &&
        acc.set(d.id, {
          name: d.name,
          featureProperties: d.featureProperties,
        });
      return acc;
    }, new Map<string, EditableLayerSettings>());
  },
);
