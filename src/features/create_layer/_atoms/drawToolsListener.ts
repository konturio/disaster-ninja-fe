import { createAtom } from '~utils/atoms';
import { Feature } from 'geojson';
import { isModeActiveAtom } from './isModeActive';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { Action } from '@reatom/core';
import { featurePanelAtom } from './featurePanel';
import { drawnFeaturesAtom } from './drawnFeatures';

// So far we're only care about feature with Point type of geometry
export const drawToolsListenerAtom = createAtom(
  {
    isModeActiveAtom,
    drawnGeometryAtom,
    drawnFeaturesAtom,
  },
  ({ schedule, get, onChange, getUnlistedState }, state: Feature[] = []) => {
    // Make changes only when mode is active
    const modeIsActive = get('isModeActiveAtom');
    if (!modeIsActive) return state;

    const actions: Action[] = [];

    onChange('drawnGeometryAtom', ({ features }) => {
      const previousFeatures = getUnlistedState(drawnFeaturesAtom);

      // Case point was deleted
      if (!features.length || previousFeatures.length > features.length) {
        // the only way to delete point is to select it first, so find selected
        // TODO disallow multiple selection for this mode
        const indexToRemove = previousFeatures.findIndex(
          (feature) => feature.properties?.isSelected,
        );
        if (indexToRemove === -1) {
          console.error(`haven't found index`, [...previousFeatures]);
        }
        actions.push(featurePanelAtom.setFeatureGeometry(null));
        actions.push(drawnFeaturesAtom.removeFeature(indexToRemove));
      }

      // Case point was drawn
      else if (features.length > previousFeatures.length) {
        const editableFeature = features[features.length - 1];
        actions.push(
          featurePanelAtom.setFeatureGeometry(editableFeature.geometry),
        );
        actions.push(drawnFeaturesAtom.updateEditableFeature(editableFeature));
      }

      // Case existing feature was selected
      // set mode to editing, let now of features geometry and coords
      else if (previousFeatures.length === features.length) {
        const selectedIndex = features.findIndex(
          (feature) => feature.properties?.isSelected,
        );
        if (selectedIndex === -1)
          console.error(`haven't found index`, [...previousFeatures]);
        actions.push(
          featurePanelAtom.startEditMode(
            features[selectedIndex].geometry,
            features[selectedIndex].properties || {},
          ),
        );
        actions.push(drawnFeaturesAtom.setFeatures(features));
      }
    });

    actions.length &&
      schedule((dispatch) => {
        dispatch(actions);
      });

    return state;
  },
  'drawToolsListenerAtom',
);
