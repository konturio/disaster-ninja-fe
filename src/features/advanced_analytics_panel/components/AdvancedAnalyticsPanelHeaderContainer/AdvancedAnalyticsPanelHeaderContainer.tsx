import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import { advancedAnalyticsResourceAtom } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsResource';

const AdvancedAnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={advancedAnalyticsResourceAtom}
    messages={{
      init: 'Select Geometry',
      loading: 'Loading advanced analytics...',
      error: 'Error',
      other: 'Advanced analytics'
    }}
  />);

export default AdvancedAnalyticsPanelHeaderContainer;
