import { configRepo } from '~core/config';
import { apiClient } from '~core/apiClientInstance';
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
    false,
    { signal: abortController.signal },
  );
}

// Advanced Analytics for authenticated user
export function getAdvancedPolygonDetails(
  geometry: GeoJSON.GeoJSON,
  abortController: AbortController,
) {
  return apiClient.post<AdvancedAnalyticsData[] | null>(
    `/advanced_polygon_details/`,
    geometry,
    true,
    { signal: abortController.signal },
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
    true,
    {
      signal: abortController.signal,
      headers: { 'user-language': i18n.instance.language },
      retryAfterTimeoutError: {
        times: 5,
        delayMs: 1000,
      },
    },
  );
}
