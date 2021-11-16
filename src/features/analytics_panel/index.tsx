import { useAtom } from '@reatom/react';
import { AnalyticsPanel } from '~features/analytics_panel/components/AnalyticsPanel/AnalyticsPanel';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';

export function Analytics() {
  const [analyticsResource] = useAtom(analyticsResourceAtom);

  return (
    <AnalyticsPanel
      error={analyticsResource.error}
      loading={analyticsResource.loading}
      analyticsDataList={analyticsResource.data}
    />
  );
}
