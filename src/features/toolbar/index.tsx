import { Suspense } from 'react';
import { lazily } from 'react-lazily';
import { Tools16 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import type { PanelFeatureInterface } from '~core/types/featuresTypes';

const { ToolbarContent } = lazily(() => import('./components'));
const { ShortToolbarContent } = lazily(() => import('./components'));

export const shortToolbar: () => PanelFeatureInterface = () => ({
  content: (
    <Suspense>
      <ShortToolbarContent />
    </Suspense>
  ),
  panelIcon: <Tools16 />,
  header: i18n.t('toolbar.panel_title'),
  minHeight: 56,
});

export const toolbar: () => PanelFeatureInterface = () => ({
  content: (
    <Suspense>
      <ToolbarContent />
    </Suspense>
  ),
  panelIcon: <Tools16 />,
  header: i18n.t('toolbar.panel_title'),
  minHeight: 121,
});
