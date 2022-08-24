import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';

const AnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={analyticsResourceAtom}
    messages={{
      init: 'analytics_panel.init',
      loading: 'analytics_panel.loading',
      error: 'analytics_panel.error',
      other: 'analytics_panel.other',
    }}
  />
);

export default AnalyticsPanelHeaderContainer;
