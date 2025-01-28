import { apiClient } from '~core/apiClientInstance';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import type { AdvancedAnalyticsData, AnalyticsData, LLMAnalyticsData } from '~core/types';

export function getPolygonDetails(
  features: GeoJSON.FeatureCollection,
  abortController: AbortController,
) {
  return apiClient.post<AnalyticsData[] | null>(
    `/polygon_details/v2`,
    {
      appId: configRepo.get().id,
      features,
    },
    {
      signal: abortController.signal,
      errorsConfig: { hideErrors: true },
      authRequirement: apiClient.AUTH_REQUIREMENT.OPTIONAL,
    },
  );
}

export function getAdvancedPolygonDetails(
  geometry: GeoJSON.GeoJSON,
  abortController: AbortController,
) {
  return apiClient.post<AdvancedAnalyticsData[] | null>(
    `/advanced_polygon_details/`,
    geometry,
    {
      signal: abortController.signal,
      errorsConfig: { hideErrors: true },
      authRequirement: apiClient.AUTH_REQUIREMENT.OPTIONAL,
    },
  );
}

export function getLlmAnalysis(
  geometry: GeoJSON.GeoJSON,
  abortController: AbortController,
) {
  return apiClient.post<LLMAnalyticsData>(
    `/llm_analytics`,
    {
      appId: configRepo.get().id,
      features: geometry,
    },
    {
      signal: abortController.signal,
      headers: { 'user-language': i18n.instance.language },
      errorsConfig: { hideErrors: true },
      retry: { attempts: 5 },
      authRequirement: apiClient.AUTH_REQUIREMENT.OPTIONAL,
    },
  );
}
