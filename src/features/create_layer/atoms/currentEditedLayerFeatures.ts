import { apiClient, notificationService } from '~core/index';
import { createAtom } from '~utils/atoms/createPrimitives';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { editableLayersListResource } from './editableLayersListResource';

interface SafeCallbacks {
  onSuccess: () => void;
  onError: () => void;
}

export const currentEditedLayerFeatures = createAtom(
  {
    readFeaturesFromLayer: (layerId: string) => layerId,
    setFeatures: drawnGeometryAtom.setFeatures,
    addFeature: drawnGeometryAtom.addFeature,
    removeFeature: drawnGeometryAtom.removeByIndexes,
    drawnGeometryAtom,
    reset: () => null,
    save: (safeCallbacks?: SafeCallbacks) => safeCallbacks,
    setFeatureProperty: (
      featureIdx: number,
      properties: GeoJSON.GeoJsonProperties,
    ) => ({ featureIdx, properties }),
  },
  (
    { onAction, getUnlistedState, schedule, get },
    state: null | GeoJSON.Feature[] = null,
  ): typeof state => {
    state = get('drawnGeometryAtom').features;

    onAction('reset', () => {
      state = null;
      schedule((dispatch, ctx = {}) => {
        dispatch(drawnGeometryAtom.setFeatures([]));
      });
    });

    /* I read features only once because layer course can be updated in the middle of my editing */
    onAction('readFeaturesFromLayer', (layerId) => {
      /* Read layer source */
      const layersSources = getUnlistedState(layersSourcesAtom);
      const layerSource = layersSources.get(layerId);
      const sourceData = layerSource?.data?.source;
      let features: GeoJSON.Feature[] = [];
      if (sourceData?.type === 'geojson') {
        const sourceDataCopy = deepCopy(sourceData);
        if (sourceDataCopy.data.type === 'Feature') {
          features = [sourceDataCopy.data];
        }
        if (sourceDataCopy.data.type === 'FeatureCollection') {
          features = sourceDataCopy.data.features;
        }
      }

      /**
       * Note that i'am not set state here.
       * This is because it will be done later in onAction('setFeatures', ...)
       * where features will be with id's
       */
      schedule((dispatch, ctx = {}) => {
        ctx.layerId = layerId;
        if (state) dispatch(drawnGeometryAtom.setFeatures(features));
      });
    });

    onAction('addFeature', (feature) => {
      if (state === null) return;

      /**
       * This not working because selectedIndexesAtom !== selectedFeature
       * In fact after feature selected selectedIndexesAtom reset
       */
      // const lastIndex = state.length - 1;
      // schedule((dispatch) => {
      //   dispatch(selectedIndexesAtom.setIndexes([lastIndex]));
      // });
    });

    onAction('setFeatureProperty', ({ featureIdx, properties }) => {
      schedule((dispatch, ctx = {}) => {
        if (state === null) return;
        const newState = Array.from(state);
        newState[featureIdx] = {
          ...newState[featureIdx],
          properties: {
            ...newState[featureIdx].properties,
            ...properties,
          },
        };
        if (state) dispatch(drawnGeometryAtom.setFeatures(newState));
      });
    });

    onAction('save', (safeCallbacks) => {
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
            if (safeCallbacks) safeCallbacks.onSuccess();
            dispatch(editableLayersListResource.refetch());
          } catch (e) {
            if (safeCallbacks) safeCallbacks.onError();
            notificationService.error({ title: 'Failed to save features' });
            console.error(e);
          }
        }
      });
    });

    return state;
  },
);
