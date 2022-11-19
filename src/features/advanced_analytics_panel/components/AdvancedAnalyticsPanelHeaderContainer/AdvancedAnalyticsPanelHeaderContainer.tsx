import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import core from '~core/index';
import { advancedAnalyticsResourceAtom } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsResource';

const AdvancedAnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={advancedAnalyticsResourceAtom}
    loadingMessage={core.i18n.t('advanced_analytics_panel.loading')}
  />
);

export default AdvancedAnalyticsPanelHeaderContainer;
