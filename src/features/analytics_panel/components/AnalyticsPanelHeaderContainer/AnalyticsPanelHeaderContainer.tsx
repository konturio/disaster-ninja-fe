import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';

const AnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={analyticsResourceAtom}
    messages={{
      init: 'analytics_panel_header.init',
      loading: 'analytics_panel_header.loading',
      error: 'analytics_panel_header.error',
      other: 'analytics_panel_header.other',
    }}
  />
);

export default AnalyticsPanelHeaderContainer;
