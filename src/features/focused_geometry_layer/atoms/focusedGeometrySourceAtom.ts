import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import { createAsyncWrapper } from '~core/store/atoms/createAsyncWrapper';
import { createAtom } from '~core/store/atoms';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import type { LayerGeoJSONSource } from '~core/logical_layers/types/source';

function createGeoJSONLayerSource(
  id: string,
  data: LayerGeoJSONSource['source']['data'],
): LayerGeoJSONSource {
  return {
    id,
    source: {
      type: 'geojson',
      data,
    },
  };
}

export const createFocusedGeometrySourceAtom = (sourceId: string) =>
  createAtom(
    {
      focusedGeometryAtom,
    },
    ({ get, schedule }, state = null) => {
      const focusedGeometryAtom = get('focusedGeometryAtom');
      if (focusedGeometryAtom) {
        const { geometry } = focusedGeometryAtom;
        if (
          geometry.type === 'FeatureCollection' ||
          geometry.type === 'Feature'
        ) {
          schedule((dispatch) => {
            const focusedLayerSource = createGeoJSONLayerSource(
              sourceId,
              geometry,
            );

            dispatch(
              layersSourcesAtom.set(
                sourceId,
                createAsyncWrapper(focusedLayerSource),
              ),
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
            layersSourcesAtom.set(
              sourceId,
              createAsyncWrapper(focusedLayerSource),
            ),
          );
        });
      }
    },
  );
