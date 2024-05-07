import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { createAtom } from '~utils/atoms';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { createGeoJSONLayerSource } from '~core/logical_layers/utils/createGeoJSONLayerSource';
import { referenceAreaAtom } from './referenceAreaAtom';

export const createReferenceAreaSourceAtom = (sourceId: string) =>
  createAtom(
    {
      referenceAreaAtom,
    },
    ({ get, schedule }, state = null) => {
      const geometry = get('referenceAreaAtom');
      if (geometry) {
        if (geometry.type === 'FeatureCollection' || geometry.type === 'Feature') {
          schedule((dispatch) => {
            const referenceAreaLayerSource = createGeoJSONLayerSource(sourceId, geometry);

            dispatch(
              layersSourcesAtom.set(
                sourceId,
                createAsyncWrapper(referenceAreaLayerSource),
              ),
            );
          });
        } else {
          console.error(
            '[reference_area]: Only FeatureCollection and Feature supported ',
          );
        }
      } else {
        schedule((dispatch) => {
          const referenceAreaLayerSource = createGeoJSONLayerSource(sourceId, {
            type: 'FeatureCollection',
            features: [],
          });

          dispatch(
            layersSourcesAtom.set(sourceId, createAsyncWrapper(referenceAreaLayerSource)),
          );
        });
      }
    },
    'reference_area:' + sourceId,
  );
