import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import { i18n } from '~core/localization';
import { advancedAnalyticsResourceAtom } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsResource';

const AdvancedAnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={advancedAnalyticsResourceAtom}
    loadingMessage={i18n.t('advanced_analytics_panel.loading')}
  />
);

export default AdvancedAnalyticsPanelHeaderContainer;
