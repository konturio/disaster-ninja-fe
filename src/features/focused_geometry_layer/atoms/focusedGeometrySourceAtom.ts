import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { createAtom } from '~utils/atoms';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { createGeoJSONLayerSource } from '~core/logical_layers/utils/createGeoJSONLayerSource';

export const createFocusedGeometrySourceAtom = (sourceId: string) =>
  createAtom(
    {
      focusedGeometryAtom,
    },
    ({ get, schedule }, state = null) => {
      const focusedGeometryAtom = get('focusedGeometryAtom');
      if (focusedGeometryAtom) {
        const { geometry } = focusedGeometryAtom;
        if (geometry.type === 'FeatureCollection' || geometry.type === 'Feature') {
          schedule((dispatch) => {
            const focusedLayerSource = createGeoJSONLayerSource(sourceId, geometry);

            dispatch(
              layersSourcesAtom.set(sourceId, createAsyncWrapper(focusedLayerSource)),
            );
          });
        } else {
          console.error(
            '[focused_geometry_layer]: Only FeatureCollection and Feature supported ',
          );
        }
      } else {
        schedule((dispatch) => {
          const focusedLayerSource = createGeoJSONLayerSource(sourceId, {
            type: 'FeatureCollection',
            features: [],
          });

          dispatch(
            layersSourcesAtom.set(sourceId, createAsyncWrapper(focusedLayerSource)),
          );
        });
      }
    },
    'focusedGeometrySourceAtom:' + sourceId,
  );
