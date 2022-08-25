import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import { advancedAnalyticsResourceAtom } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsResource';

const AdvancedAnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={advancedAnalyticsResourceAtom}
    messages={{
      init: 'analytics_panel.init',
      loading: 'advanced_analytics_panel.loading',
      error: 'analytics_panel.error',
      other: 'advanced_analytics_panel.other',
    }}
  />
);

export default AdvancedAnalyticsPanelHeaderContainer;
