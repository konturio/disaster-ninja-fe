import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import { advancedAnalyticsResourceAtom } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsResource';

const AdvancedAnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={advancedAnalyticsResourceAtom}
    messages={{
      init: 'analytics_panel_header.init',
      loading: 'advanced_analytics_panel_header.loading',
      error: 'analytics_panel_header.error',
      other: 'advanced_analytics_panel_header.other',
    }}
  />
);

export default AdvancedAnalyticsPanelHeaderContainer;
