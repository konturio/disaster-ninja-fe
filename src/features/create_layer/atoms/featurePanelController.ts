import { createAtom } from '~utils/atoms/createPrimitives';
import { Geometry } from 'geojson';
import { editTargetAtom } from './editTarget';
import { EditTargets } from '../constants';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { activeDrawModeAtom } from '~core/draw_tools/atoms/activeDrawMode';
import { drawModes } from '~core/draw_tools/constants';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';

const currentEditedLayerFeatures = createAtom(
  {
    editTargetAtom,
    layersSourcesAtom,
  },
  ({ get }, state: null | GeoJSON.Feature[] = null): typeof state => {
    const editTargetAtom = get('editTargetAtom');
    if (
      editTargetAtom.type !== EditTargets.features ||
      editTargetAtom.layerId === undefined
    ) {
      return null;
    }
    const layersSources = get('layersSourcesAtom');
    const layerSource = layersSources.get(editTargetAtom.layerId);
    const sourceData = layerSource?.data?.source;
    if (sourceData?.type === 'geojson') {
      if (sourceData.data.type === 'Feature') {
        return [sourceData.data];
      }
      if (sourceData.data.type === 'FeatureCollection') {
        return sourceData.data.features;
      }
    }
    return null;
  },
);

const currentSelectedPoint = createAtom(
  {
    currentEditedLayerFeatures,
    drawnGeometryAtom,
    activeDrawModeAtom,
    remove: () => null,
  },
  (
    { get, onChange, schedule, getUnlistedState },
    state: null | GeoJSON.Feature = null,
  ): typeof state => {
    const features = get('currentEditedLayerFeatures');
    const drawToolsActivated = get('activeDrawModeAtom');

    if (features === null) {
      if (drawToolsActivated) {
        schedule((dispatch) => {
          // TODO fix that logic in layer.setMode() in #9782
          dispatch([
            drawModeLogicalLayerAtom.enable(),
            activeDrawModeAtom.setDrawMode(null),
            drawnGeometryAtom.setFeatures([]),
          ]);
        });
      }
    } else {
      if (!drawToolsActivated) {
        schedule((dispatch) => {
          // TODO fix that logic in layer.setMode() in #9782
          dispatch([
            drawModeLogicalLayerAtom.enable(),
            toolboxAtom.setAvalibleModes(['DrawPointMode']),
            activeDrawModeAtom.setDrawMode(drawModes.ModifyMode),
            activeDrawModeAtom.setDrawMode(drawModes.DrawPointMode),
            drawnGeometryAtom.setFeatures(features),
          ]);
        });
      }
    }

    const drawnGeometry = get('drawnGeometryAtom');
    console.log('drawnGeometry'), drawnGeometry;
    return drawnGeometry.features.find((f) => f.properties?.isSelected) ?? null;
  },
);

currentSelectedPoint.subscribe((s) => console.log(s));
// interface SelectedPoint {
//   id: string;
//   position: [number, number];
//   properties: Record<string, string | number | boolean | null>;
// }

type FeaturePanelMode = 'add' | 'edit';
type StateType = {
  featurePanelMode: FeaturePanelMode;
  geometry: Geometry | null;
  [featureProperties: string]: any;
};
const defaultState: StateType = {
  featurePanelMode: 'add',
  geometry: null,
};

export const featurePanelControllerAtom = createAtom(
  {
    editFeatures: (layerId: string) => layerId,
    editTargetAtom,
    setPanelMode: (mode: FeaturePanelMode) => mode,
    setFeatureGeometry: (
      geometry: Geometry | null,
      mode: FeaturePanelMode = 'add',
    ) => ({ geometry, mode }),
    setPropertyNames: (properties: string[]) => properties,
    changeProperty: (key: string, value: string) => ({ key, value }),
    startEditMode: (
      geometry: Geometry,
      properties: { [key: string]: string },
    ) => ({ geometry, properties }),
    resetPanel: () => null,
  },
  ({ onAction, schedule, onChange, get }, state: StateType = defaultState) => {
    onAction('editFeatures', (layerId) => {
      schedule((dispatch) => {
        dispatch(
          editTargetAtom.set({
            type: EditTargets.features,
            layerId,
          }),
        );
      });
    });
    /* Load draw tools for editable layer */
    onChange('editTargetAtom', (next, prev) => {
      if (next.type !== EditTargets.features || next.layerId === undefined) {
        if (false) {
          // TODO: Check that draw tool activated
          // Deactivate draw tools
        }
        return;
      }

      if (false) {
        // TODO: Check that draw tool NOT activated
        // Get current layer features
      }
      // Load current layer features to draw tools
    });

    /**
     * Check what in draw as selected feature
     */
    const currentSelectedFeature = get('editTargetAtom');
    const currentSelectedFeatureIsPoint = false; // TODO
    if (currentSelectedFeatureIsPoint) {
      // Set form name - EDIT
      // load this feature properties to form
    } else {
      {
        // Set form name - ADD
      }
    }

    onAction('startEditMode', ({ geometry, properties }) => {
      state = {
        featurePanelMode: 'edit',
        geometry,
        ...properties,
      };
    });

    return state;
  },
  'featurePanelControllerAtom',
);
