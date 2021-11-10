import { useAtom } from '@reatom/react';
import { AnalyticsPanel } from '~features/analytics_panel/components/AnalyticsPanel/AnalyticsPanel';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/AnalyticsResource';
import { focusedGeometryAtom } from '~core/shared_state';

export function Analytics() {
  const [focusedGeometry] = useAtom(focusedGeometryAtom);
  const [analyticsResource] = useAtom(analyticsResourceAtom);

  return focusedGeometry ? (
    <AnalyticsPanel
      error={analyticsResource.error}
      loading={analyticsResource.loading}
      analyticsDataList={analyticsResource.data}
    />
  ) : null;
}
