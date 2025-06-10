import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { getBoundaries } from '~core/api/boundaries';
import { i18n } from '~core/localization';
import { clickCoordinatesAtom } from './clickCoordinatesAtom';

export const boundaryResourceAtom = createAsyncAtom(
  clickCoordinatesAtom,
  async (params, abortController) => {
    if (!params) return null;
    const { lng, lat } = params;
    const responseData = await getBoundaries([lng, lat], abortController);
    if (!responseData) throw new Error(i18n.t('no_data_received'));
    return responseData;
  },
  'boundaryResourceAtom',
);
