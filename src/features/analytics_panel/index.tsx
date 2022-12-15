import { Analytics24 } from '@konturio/default-icons';
import { lazily } from 'react-lazily';
import { i18n } from '~core/localization';
import { MIN_HEIGHT } from './constants';
import type { PanelFeatureInterface } from 'types/featuresTypes';

export { AnalyticsPanel } from './components/AnalyticsPanel/AnalyticsPanel';

const { PanelContent } = lazily(() => import('./components/PanelContent/PanelContent'));

export const analyticsPanel: PanelFeatureInterface = {
  content: <PanelContent />,
  panelIcon: <Analytics24 />,
  header: i18n.t('analytics_panel.header_title'),
  minHeight: MIN_HEIGHT,
  skipAutoResize: true,
};
