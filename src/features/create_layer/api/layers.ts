import { apiClient } from '~core/apiClientInstance';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import type { EditableLayers } from '../types';

export function createLayer(data: any) {
  return apiClient.post<EditableLayers>(`/layers`, data, {
    authRequirement: apiClient.AUTH_REQUIREMENT.MUST,
  });
}

export function updateLayer(data: any) {
  return apiClient.put<EditableLayers>(`/layers/${data.id}`, data, {
    authRequirement: apiClient.AUTH_REQUIREMENT.MUST,
  });
}

export function deleteLayer(id: string) {
  return apiClient.delete<unknown>(`/layers/${id}`, {
    authRequirement: apiClient.AUTH_REQUIREMENT.MUST,
  });
}

export function saveFeaturesToLayer(layerId: string, features: GeoJSON.Feature[]) {
  return apiClient.put<unknown>(
    `/layers/${layerId}/items/`,
    new FeatureCollection(features),
    {
      authRequirement: apiClient.AUTH_REQUIREMENT.MUST,
    },
  );
}
