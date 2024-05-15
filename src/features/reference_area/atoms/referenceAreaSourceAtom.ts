import { atom } from '@reatom/core';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { createGeoJSONLayerSource } from '~core/logical_layers/utils/createGeoJSONLayerSource';
import { v3toV2 } from '~utils/atoms/v3tov2';
import { store } from '~core/store/store';
import { referenceAreaAtom } from '~core/shared_state/referenceArea';

export const createReferenceAreaSourceAtom = (sourceId: string) =>
  v3toV2(
    atom((ctx) => {
      const geometry = ctx.spy(referenceAreaAtom);
      if (geometry) {
        if (geometry.type === 'FeatureCollection' || geometry.type === 'Feature') {
          const referenceAreaLayerSource = createGeoJSONLayerSource(sourceId, geometry);
          store.dispatch(
            layersSourcesAtom.set(sourceId, createAsyncWrapper(referenceAreaLayerSource)),
          );
        } else {
          console.error(
            '[reference_area]: Only FeatureCollection and Feature supported ',
          );
        }
      } else {
        ctx.schedule(() => {
          const referenceAreaLayerSource = createGeoJSONLayerSource(sourceId, {
            type: 'FeatureCollection',
            features: [],
          });
          store.dispatch(
            layersSourcesAtom.set(sourceId, createAsyncWrapper(referenceAreaLayerSource)),
          );
        });
      }
      return geometry;
    }, 'createReferenceAreaSourceAtom'),
  );
