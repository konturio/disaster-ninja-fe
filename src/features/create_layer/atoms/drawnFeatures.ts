import { createAtom } from '~utils/atoms';
import { Feature } from 'geojson';
import { Action } from '@reatom/core';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';

export const drawnFeaturesAtom = createAtom(
  {
    addEditableFeature: (feature: Feature) => feature,
    updateEditableFeature: (feature: Feature) => feature,
    saveEditableFeature: (feature: Feature) => feature,
    editFeature: (feature: Feature, index: number) => ({ feature, index }),
    removeFeature: (index: number) => index,
    setFeatures: (features: Feature[]) => features,
    clearFeatures: () => null,
  },
  ({ onAction, schedule }, state: Feature[] = []) => {
    const actions: Action[] = [];

    onAction('updateEditableFeature', (editableFeature) => {
      // if there're 2+ features replace second feature from behind with the last feature
      // which represents updated current position
      if (!editableFeature.properties)
        editableFeature.properties = { isSelected: true };
      editableFeature.properties.isSelected = true;
      const stateCopy = [...state, editableFeature];
      if (stateCopy.length > 1) {
        stateCopy[stateCopy.length - 2] = editableFeature;
        stateCopy.length = state.length - 1;
      }

      // update drawn geometry, making the last point selected
      actions.push(drawnGeometryAtom.setFeatures(state));
      state = stateCopy;
    });

    onAction('removeFeature', (index) => {
      const stateCopy = [...state];
      stateCopy.splice(index, 1);
      actions.push(drawnGeometryAtom.removeByIndexes([index]));
      state = stateCopy;
    });

    onAction('setFeatures', (features) => (state = features));

    actions.length &&
      schedule((dispatch) => {
        dispatch(actions);
      });

    return state;
  },
  'drawnFeaturesAtom',
);
