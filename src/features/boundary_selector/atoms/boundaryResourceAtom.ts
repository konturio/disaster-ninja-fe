import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { getBoundaries } from '~core/api/boundaries';
import { clickCoordinatesAtom } from './clickCoordinatesAtom';

export const boundaryResourceAtom = createAsyncAtom(
  clickCoordinatesAtom,
  async (params, abortController) => {
    if (!params) return null;
    const { lng, lat } = params;
    const responseData = await getBoundaries([lng, lat], abortController);
    if (!responseData) throw 'No data received';
    return responseData;
  },
  'boundaryResourceAtom',
);
