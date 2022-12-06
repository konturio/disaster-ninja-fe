import { lazily } from 'react-lazily';
import { Legend24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { MIN_HEIGHT } from './constants';
import type { PanelFeatureInterface } from 'types/featuresTypes';

const { PanelContent } = lazily(() => import('./components/PanelContent/PanelContent'));

export const legendPanel: PanelFeatureInterface = {
  content: <PanelContent />,
  panelIcon: <Legend24 />,
  header: i18n.t('legend'),
  minHeight: MIN_HEIGHT,
};
