import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';

const AnalyticsPanelHeaderContainer = () => (<AnalyticsPanelHeader
  resourceAtom={analyticsResourceAtom}
  messages={{
    init: 'Select Geometry',
    loading: 'Loading analytics...',
    error: 'Error',
    other: 'Analytics'
  }}
/>);

export default AnalyticsPanelHeaderContainer;
