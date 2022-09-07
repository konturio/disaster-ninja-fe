import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import { i18n } from '~core/localization';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';

const AnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={analyticsResourceAtom}
    loadingMessage={i18n.t('analytics_panel.loading')}
  />
);

export default AnalyticsPanelHeaderContainer;
