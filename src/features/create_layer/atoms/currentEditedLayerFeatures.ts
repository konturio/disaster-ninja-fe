import { createAtom } from '~utils/atoms/createPrimitives';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { apiClient, notificationService } from '~core/index';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { editableLayersListResource } from './editableLayersListResource';
import { selectedIndexesAtom } from '~core/draw_tools/atoms/selectedIndexesAtom';

export const currentEditedLayerFeatures = createAtom(
  {
    readFeaturesFromLayer: (layerId: string) => layerId,
    setFeatures: drawnGeometryAtom.setFeatures,
    addFeature: drawnGeometryAtom.addFeature,
    removeFeature: drawnGeometryAtom.removeByIndexes,
    reset: () => null,
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
    onAction('reset', () => {
      state = null;
    });

    /* I read features only once because layer course can be updated in the meddle of my editing */
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

    onAction('addFeature', (feature) => {
      if (state === null) return;
      const lastIndex = state.length - 1;
      schedule((dispatch) => {
        dispatch(selectedIndexesAtom.setIndexes([lastIndex]));
      });
    });

    onAction('removeFeature', (indexes) => {
      if (state === null) return;
      const newState = Array.from(state);
      indexes.forEach((i) => {
        newState.splice(i, 1);
      });
      state = newState;
    });

    onAction('setFeatureProperty', ({ featureIdx, properties }) => {
      if (state === null) return;
      const newState = Array.from(state);
      newState[featureIdx] = {
        ...newState[featureIdx],
        properties: {
          ...newState[featureIdx].properties,
          ...properties,
        },
      };
      state = newState;
    });

    onAction('save', () => {
      const stateSnapshot = state ? [...state] : null;
      schedule(async (dispatch, ctx) => {
        if (ctx.layerId && stateSnapshot) {
          try {
            await apiClient.put<unknown>(
              `/layers/${ctx.layerId}/items/`,
              new FeatureCollection(stateSnapshot),
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

    // drawnGeometryAtom use 'setFeatures' for update selected point position after drag
    onAction('setFeatures', (features) => {
      if (state === null) return;
      // This features not contain new properties, so I update ONLY positions here
      const featureIdToGeometryMap = new Map<
        string | number,
        GeoJSON.Geometry
      >();
      let featuresWithoutId = 0;
      features.forEach(({ geometry, id }) => {
        if (id === undefined) {
          featuresWithoutId++;
        } else {
          featureIdToGeometryMap.set(id, geometry);
        }
      });

      const newState = Array.from(state);

      state = newState.map((f) => {
        if (f.id === undefined) {
          featuresWithoutId++;
        } else {
          const newGeometry = featureIdToGeometryMap.get(f.id);
          if (newGeometry) {
            return { ...f, geometry: newGeometry };
          }
        }
        return f;
      });

      if (featuresWithoutId)
        console.error('Cannot update position for feature without id');
    });

    return state;
  },
);
