import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import core from '~core/index';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';

const AnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={analyticsResourceAtom}
    loadingMessage={core.i18n.t('analytics_panel.loading')}
  />
);

export default AnalyticsPanelHeaderContainer;
