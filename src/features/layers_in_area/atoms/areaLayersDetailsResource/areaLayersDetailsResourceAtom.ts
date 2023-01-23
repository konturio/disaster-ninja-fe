import { apiClient } from '~core/apiClientInstance';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { areaLayersDetailsParamsAtom } from './areaLayersDetailsParamsAtom';
import { areaLayersDetailsResourceAtomCache } from './areaLayersDetailsResourceAtomCache';
import type { LayerInAreaDetails } from '../../types';

export const areaLayersDetailsResourceAtom = createAsyncAtom(
  areaLayersDetailsParamsAtom,
  async (params, abortController) => {
    if (params === null) return null;
    if (params.skip) return []; // When all 100% layers in cache we still need to trigger ResourceAtomState to run listeners
    // exclude layersToRetrieveWithEventId from body - in needed just for cache invalidation
    const { layersToRetrieveWithEventId, ...body } = params;
    const request = await apiClient.post<LayerInAreaDetails[]>(
      '/layers/details',
      body,
      true,
      {
        signal: abortController.signal,
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
