import { useAtom } from '@reatom/react';
import { AdvancedAnalyticsPanel } from '~features/advanced_analytics_panel/components/AdvancedAnalyticsPanel/AdvancedAnalyticsPanel';
import { advancedAnalyticsResourceAtom } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsResource';

export function AdvancedAnalytics() {
  const [advancedAnalyticsResource] = useAtom(advancedAnalyticsResourceAtom);

  return (
    <AdvancedAnalyticsPanel
      error={advancedAnalyticsResource.error}
      loading={advancedAnalyticsResource.loading}
      advancedAnalyticsDataList={advancedAnalyticsResource.data}
    />
  );
}
