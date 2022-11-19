import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { focusedGeometryAtom } from '~core/shared_state';
import core from '~core/index';
import type { AnalyticsData } from '~core/types';

export const analyticsResourceAtom = createAsyncAtom(
  focusedGeometryAtom,
  async (fGeo, abortController) => {
    if (!fGeo) return null;
    const geometry = fGeo?.geometry as GeoJSON.FeatureCollection;
    if (geometry.features && geometry.features.length == 0) return null;
    let responseData: AnalyticsData[] | null | undefined;
    try {
      responseData = await core.api.apiClient.post<AnalyticsData[] | null>(
        `/polygon_details`,
        fGeo?.geometry,
        false,
        { signal: abortController.signal, errorsConfig: { dontShowErrors: true } },
      );
    } catch (e: unknown) {
      throw new Error(core.i18n.t('analytics_panel.error_loading'));
    }

    // in case there is no error but response data is empty
    if (responseData === undefined) throw new Error(core.i18n.t('no_data_received'));

    return responseData;
  },
  'analyticsResource',
);
