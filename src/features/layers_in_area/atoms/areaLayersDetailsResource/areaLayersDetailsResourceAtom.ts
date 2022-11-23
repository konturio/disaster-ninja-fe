import { createAsyncAtom } from '~core/store/atoms/createAsyncAtom';
import core from '~core/index';
import { areaLayersDetailsParamsAtom } from './areaLayersDetailsParamsAtom';
import { areaLayersDetailsResourceAtomCache } from './areaLayersDetailsResourceAtomCache';
import type { LayerInAreaDetails } from '../../types';

export const areaLayersDetailsResourceAtom = createAsyncAtom(
  areaLayersDetailsParamsAtom,
  async (params, abortController) => {
    if (params === null) return null;
    // exclude layersToRetrieveWithEventId from body - in needed just for cache invalidation
    const { layersToRetrieveWithEventId, ...body } = params;
    const request = await core.api.apiClient.post<LayerInAreaDetails[]>(
      '/layers/details',
      body,
      true,
      {
        signal: abortController.signal,
        errorsConfig: {
          dontShowErrors: true,
        },
      },
    );
    return request ?? null;
  },
  'areaLayersDetailsResourceAtom',
  {
    onSuccess: (dispatch, request, response) => {
      if (response === null) return;
      if (request === null) return;
      dispatch(areaLayersDetailsResourceAtomCache.update(request, response));
    },
  },
);
