import { Suspense } from 'react';
import { lazily } from 'react-lazily';
import { i18n } from '~core/localization';
import { MIN_HEIGHT } from './constants';
import type { PanelFeatureInterface } from '~core/types/featuresTypes';

const { PanelContent } = lazily(() => import('./components/PanelContent/PanelContent'));

export const advancedAnalyticsPanel = (): PanelFeatureInterface => ({
  content: (
    <Suspense>
      <PanelContent />
    </Suspense>
  ),
  header: i18n.t('advanced_analytics_panel.header_title'),
  minHeight: MIN_HEIGHT,
  resize: 'none',
});
