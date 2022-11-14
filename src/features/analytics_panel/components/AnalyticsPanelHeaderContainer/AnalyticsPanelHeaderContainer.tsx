import AnalyticsPanelHeader from '~components/Analytics/AnalyticsPanelHeader/AnalyticsPanelHeader';
import { i18n } from '~core/localization';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';

const LOADING_MESSAGE = i18n.t('analytics_panel.loading');

const AnalyticsPanelHeaderContainer = () => (
  <AnalyticsPanelHeader
    resourceAtom={analyticsResourceAtom}
    loadingMessage={LOADING_MESSAGE}
  />
);

export default AnalyticsPanelHeaderContainer;
