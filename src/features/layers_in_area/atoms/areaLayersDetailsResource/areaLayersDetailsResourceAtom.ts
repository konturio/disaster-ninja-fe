import { apiClient } from '~core/apiClientInstance';
import { configRepo } from '~core/config';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { areaLayersDetailsParamsAtom } from './areaLayersDetailsParamsAtom';
import { areaLayersDetailsResourceAtomCache } from './areaLayersDetailsResourceAtomCache';
import type { LayerDetailsDto } from '~core/logical_layers/types/source';

export const areaLayersDetailsResourceAtom = createAsyncAtom(
  areaLayersDetailsParamsAtom,
  async (params, abortController) => {
    if (params.skip) return []; // When all 100% layers in cache we still need to trigger ResourceAtomState to run listeners
    // exclude layersToRetrieveWithEventId from body - in needed just for cache invalidation
    const { layersToRetrieveWithEventId, ...body } = params;
    const request = await apiClient.post<LayerDetailsDto[]>(
      '/layers/details',
      { ...body, appId: configRepo.get().id },
      {
        headers: { 'user-language': configRepo.get().initialUser.language },
        signal: abortController.signal,
        authRequirement: apiClient.AUTH_REQUIREMENT.OPTIONAL,
      },
    );
    return request ?? null;
  },
  'areaLayersDetailsResourceAtom',
  {
    onSuccess: (dispatch, request, response) => {
      if (response === null) return;
      if (request === null) return;
      if (response.length === 0) return;
      dispatch(areaLayersDetailsResourceAtomCache.update(request, response));
    },
  },
);
