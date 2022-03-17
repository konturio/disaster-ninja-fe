import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/shared_state';
import { Feature, FeatureCollection } from 'geojson';
import { point as createPointFeature } from '@turf/helpers';
import {
  FocusedGeometry,
  FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
} from '~core/shared_state/focusedGeometry';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { activeDrawModeAtom } from '~core/draw_tools/atoms/activeDrawMode';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';

const defaultState: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

export const watcherAtom = createAtom(
  {
    focusedGeometryAtom,
    activeDrawModeAtom,
    toolboxAtom,
  },
  (
    { schedule, onChange, get, getUnlistedState },
    state: FeatureCollection = defaultState,
  ) => {
    // if draw tools were turned off - stop watching atoms
    const { mode } = get('toolboxAtom');
    if (!mode) return;

    /**
     * While draw mode is active, some geometry can be uploaded which will be received by focusedGeometryAtom
     * this listener intercepts geometry in such case
     */

    onChange('focusedGeometryAtom', (incoming) => {
      const mode = get('activeDrawModeAtom');
      if (!mode) return;

      if (incoming?.source.type === 'uploaded')
        schedule((dispatch) => {
          const actions: any[] = [];
          updateFromGeometry(incoming, actions);
          dispatch(actions);
        });
    });

    onChange('activeDrawModeAtom', (activeMode, previousActiveMode) => {
      const focusedFeatures = getUnlistedState(focusedGeometryAtom);
      if (activeMode && !previousActiveMode && focusedFeatures) {
        schedule((dispatch) => {
          const actions: any[] = [
            enabledLayersAtom.delete(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID),
          ];
          updateFromGeometry(focusedFeatures, actions);
          dispatch(actions);
        });
      } else if (!activeMode && previousActiveMode) {
        // if draw mode was turned off after being turned on
        schedule((dispatch) => {
          dispatch([
            focusedGeometryAtom.setFocusedGeometry({ type: 'drawn' }, state),
            enabledLayersAtom.set(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID),
          ]);
          state = defaultState;
        });
      }
    });

    return state;
  },
  'drawnGeometryAtom',
);

// here I use deepCopy to modify feature.properties object later
function updateFromGeometry(focusedGeometry: FocusedGeometry, actions: any[]) {
  if (focusedGeometry.geometry.type === 'FeatureCollection') {
    const noMultipoints: Feature[] = focusedGeometry.geometry.features.reduce(
      (result: Feature[], currentFeature) => {
        if (currentFeature.geometry.type === 'MultiPoint') {
          currentFeature.geometry.coordinates.forEach((coordinate) =>
            result.push(createPointFeature(coordinate)),
          );
        } else result.push(deepCopy(currentFeature));
        return result;
      },
      [],
    );

    actions.push(drawnGeometryAtom.setFeatures(noMultipoints));
  } else if (focusedGeometry.geometry.type === 'Feature') {
    actions.push(
      drawnGeometryAtom.setFeatures([deepCopy(focusedGeometry.geometry)]),
    );
  } else {
    console.warn('wrong type of data imported or the type is not supported');
  }
}
