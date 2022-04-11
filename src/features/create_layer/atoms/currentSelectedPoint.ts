import { createAtom } from '~utils/atoms/createPrimitives';
import { FeatureCollection } from '~utils/geoJSON/helpers';

import { editTargetAtom } from './editTarget';
import { EditTargets } from '../constants';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { activeDrawModeAtom } from '~core/draw_tools/atoms/activeDrawMode';
import { drawModes } from '~core/draw_tools/constants';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';
import { apiClient, notificationService } from '~core/index';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { editableLayersListResource } from './editableLayersListResource';

export const currentEditedLayerFeatures = createAtom(
  {
    readFeaturesFromLayer: (layerId: string) => layerId,
    setFeatures: drawnGeometryAtom.setFeatures,
    addFeature: drawnGeometryAtom.addFeature,
    removeFeature: drawnGeometryAtom.removeByIndexes,
    save: () => null,
    setFeatureProperty: (
      featureIdx: number,
      properties: GeoJSON.GeoJsonProperties,
    ) => ({ featureIdx, properties }),
  },
  (
    { onAction, getUnlistedState, schedule },
    state: null | GeoJSON.Feature[] = null,
  ): typeof state => {
    onAction('readFeaturesFromLayer', (layerId) => {
      const layersSources = getUnlistedState(layersSourcesAtom);
      const layerSource = layersSources.get(layerId);
      const sourceData = layerSource?.data?.source;
      if (sourceData?.type === 'geojson') {
        const sourceDataCopy = deepCopy(sourceData);
        if (sourceDataCopy.data.type === 'Feature') {
          state = [sourceDataCopy.data];
        }
        if (sourceDataCopy.data.type === 'FeatureCollection') {
          state = sourceDataCopy.data.features;
        }
      }
      schedule((dispatch, ctx = {}) => {
        ctx.layerId = layerId;
        if (state) dispatch(drawnGeometryAtom.setFeatures(state));
      });
    });

    // drawnGeometryAtom use 'setFeatures' for update selected point position after drag
    onAction('setFeatures', (features) => {
      state = [...features];
    });

    onAction('addFeature', (feature) => {
      state = [...(state ?? []), feature];
      // Attempt to auto select last added feature failed
      // const lastIndex = state.length - 1;
      // schedule(d => {
      //   d(selectedIndexesAtom.setIndexes([lastIndex]));
      // })
    });

    onAction('removeFeature', (indexes) => {
      const newState = state ? Array.from(state) : [];
      indexes.forEach((i) => {
        newState.splice(i, 1);
      });
      state = newState;
    });

    onAction('setFeatureProperty', ({ featureIdx, properties }) => {
      const newState = state ? Array.from(state) : [];
      newState.splice(featureIdx, 1, {
        ...newState[featureIdx],
        properties,
      });
      state = newState;
    });

    onAction('save', () => {
      schedule(async (dispatch, ctx) => {
        if (ctx.layerId && state) {
          try {
            await apiClient.put<unknown>(
              `/layers/${ctx.layerId}/items/`,
              new FeatureCollection(state),
              true,
            );
            notificationService.info({ title: 'Features was saved' }, 3);
            dispatch(editableLayersListResource.refetch());
          } catch (e) {
            notificationService.error({ title: 'Failed to save features' });
            console.error(e);
          }
        }
      });
    });

    return state;
  },
);

// /* Load existing layer features to draw tools */
// createAtom(
//   {
//     currentEditedLayerFeatures,
//   },
//   ({ get, schedule }) => {
//     const currentEditedLayerFeatures = get('currentEditedLayerFeatures');
//     if (currentEditedLayerFeatures) {
//       schedule((dispatch) => {
//         dispatch(drawnGeometryAtom.setFeatures(currentEditedLayerFeatures));
//       });
//     }
//   },
// ).subscribe((s) => null);

const currentSelectedPointIndex = createAtom({ drawnGeometryAtom }, ({ get }) =>
  get('drawnGeometryAtom').features.findIndex((f) => f.properties?.isSelected),
);

/* Enable / Disable draw tools panel */
createAtom(
  {
    editTargetAtom,
  },
  ({ onChange, getUnlistedState, schedule }) => {
    onChange('editTargetAtom', (next) => {
      const { layerId } = next;
      const drawToolsActivated = !!getUnlistedState(activeDrawModeAtom);

      if (next.type === EditTargets.features && layerId !== undefined) {
        if (!drawToolsActivated) {
          schedule((dispatch) => {
            // TODO fix that logic in layer.setMode() in #9782
            dispatch([
              drawModeLogicalLayerAtom.enable(),
              toolboxAtom.setAvalibleModes(['DrawPointMode', 'ModifyMode']),
              activeDrawModeAtom.setDrawMode(drawModes.ModifyMode),
              currentEditedLayerFeatures.readFeaturesFromLayer(layerId),
            ]);
          });
        }
      }

      if (drawToolsActivated && next.type === EditTargets.none) {
        schedule((dispatch) => {
          // TODO fix that logic in layer.setMode() in #9782
          dispatch([
            drawModeLogicalLayerAtom.disable(),
            activeDrawModeAtom.setDrawMode(null),
            drawnGeometryAtom.setFeatures([]),
          ]);
        });
      }
    });
  },
).subscribe((s) => null);

export const currentSelectedPoint = createAtom(
  {
    currentSelectedPointIndex,
    currentEditedLayerFeatures,
    updateProperties: (properties: GeoJSON.GeoJsonProperties) => properties,
    setPosition: (position: { lng: number; lat: number }) => position,
    deleteFeature: () => null,
  },
  (
    { get, onAction, schedule, getUnlistedState },
    state: null | GeoJSON.Feature = null,
  ): typeof state => {
    const currentSelectedPointIndex = get('currentSelectedPointIndex');
    if (currentSelectedPointIndex === -1) return null;

    onAction('updateProperties', (properties) => {
      const currentFeature =
        getUnlistedState(drawnGeometryAtom).features[currentSelectedPointIndex];
      const updatedProperties = {
        ...currentFeature.properties,
        ...properties,
      };
      schedule((d) => {
        d(
          currentEditedLayerFeatures.setFeatureProperty(
            currentSelectedPointIndex,
            updatedProperties,
          ),
        );
      });
    });

    onAction('setPosition', (position) => {
      console.error('setPosition Not implemented yet');
    });

    onAction('deleteFeature', () => {
      schedule((d) => {
        d(drawnGeometryAtom.removeByIndexes([currentSelectedPointIndex]));
      });
    });

    const layerFeatures = get('currentEditedLayerFeatures');
    if (layerFeatures === null) {
      return null;
    }

    return layerFeatures[currentSelectedPointIndex];
  },
);
