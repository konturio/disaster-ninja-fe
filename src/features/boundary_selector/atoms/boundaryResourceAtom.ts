import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { boundariesClient } from '~core/apiClientInstance';
import { clickCoordinatesAtom } from './clickCoordinatesAtom';

export const boundaryResourceAtom = createAsyncAtom(
  clickCoordinatesAtom,
  async (params) => {
    if (!params) return null;
    const { lng, lat } = params;
    const responseData = await boundariesClient.get<GeoJSON.FeatureCollection | null>(
      '/layers/collections/bounds/itemsByMultipoint',
      { geom: `MULTIPOINT(${lng} ${lat})` },
    );
    if (!responseData) throw 'No data received';
    return responseData;
  },
  'boundaryResourceAtom',
);
