import { reatomResource, withDataAtom, withErrorAtom } from '@reatom/async';
import { atom } from '@reatom/core';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { i18n } from '~core/localization';
import { dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { AppFeature } from '~core/auth/types';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { getLlmAnalysis } from '~core/api/insights';
import { referenceAreaAtom } from '~core/shared_state/referenceArea';
import type { LLMAnalyticsData } from '~core/types';

export const llmAnalyticsAtom = atom((ctx) => {
  const fetchLlmAnalyticsResult = ctx.spy(fetchLlmAnalyticsResource.dataAtom);
  const isPending = ctx.spy(fetchLlmAnalyticsResource.pendingAtom) > 0;
  const error = ctx.spy(fetchLlmAnalyticsResource.errorAtom);
  return {
    data: fetchLlmAnalyticsResult,
    loading: isPending,
    error: error?.message ?? null,
  };
}, 'llmAnalyticsAtom');

export const fetchLlmAnalyticsResource = reatomResource<LLMAnalyticsData | null>(
  async (ctx) => {
    const focusedGeometry = ctx.spy(focusedGeometryAtom.v3atom);
    // we spy on referenceAreaAtom because its change needs to trigger new LLM request
    const referenceArea = ctx.spy(referenceAreaAtom);
    const focusedGeoJSON = focusedGeometry?.geometry;
    if (isGeoJSONEmpty(focusedGeoJSON)) {
      return null;
    }
    let responseData: LLMAnalyticsData | null | undefined;
    try {
      responseData = await getLlmAnalysis(
        focusedGeoJSON as GeoJSON.FeatureCollection,
        ctx.controller,
      );
    } catch (e: unknown) {
      dispatchMetricsEventOnce(AppFeature.ANALYTICS_PANEL, false);
      throw new Error(i18n.t('analytics_panel.error_loading'));
    }
    dispatchMetricsEventOnce(AppFeature.ANALYTICS_PANEL, !!responseData);
    // in case there is no error but response data is empty
    if (!responseData?.data) {
      throw new Error(i18n.t('advanced_analytics_empty.no_analytics'));
    }
    return responseData;
  },
  'fetchLlmAnalyticsResource',
).pipe(withDataAtom(null), withErrorAtom());
