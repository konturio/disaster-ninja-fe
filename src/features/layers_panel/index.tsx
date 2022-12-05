import { lazily } from 'react-lazily';
import { i18n } from '~core/localization';
import { MIN_HEIGHT } from './constants';
import type { PanelFeatureInterface } from 'types/featuresTypes';

const { PanelContent } = lazily(() => import('./components'));
const { Layers24 } = lazily(() => import('@konturio/default-icons'));

export const layersPanelInterface: PanelFeatureInterface = {
  content: <PanelContent />,
  panelIcon: <Layers24 />,
  header: i18n.t('layers'),
  minHeight: MIN_HEIGHT,
};
