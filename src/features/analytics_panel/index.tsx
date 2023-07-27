import { Analytics24 } from '@konturio/default-icons';
import { lazily } from 'react-lazily';
import { Suspense } from 'react';
import { i18n } from '~core/localization';
import { MAX_HEIGHT, MIN_HEIGHT } from './constants';
import type { PanelFeatureInterface } from 'types/featuresTypes';

const { PanelContent } = lazily(() => import('./components/PanelContent/PanelContent'));

export const analyticsPanel = (): PanelFeatureInterface => ({
  content: (
    <Suspense>
      <PanelContent />
    </Suspense>
  ),
  panelIcon: <Analytics24 />,
  header: i18n.t('analytics_panel.header_title'),
  minHeight: MIN_HEIGHT,
  maxHeight: MAX_HEIGHT,
  skipAutoResize: true,
  resize: 'vertical',
});
