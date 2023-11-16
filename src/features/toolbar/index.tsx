import { Suspense } from 'react';
import { lazily } from 'react-lazily';
import { Tools24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import type { PanelFeatureInterface } from 'types/featuresTypes';

const { ToolbarContent } = lazily(() => import('./components'));
const { ShortToolbarContent } = lazily(() => import('./components'));

export const shortToolbar: () => PanelFeatureInterface = () => ({
  content: (
    <Suspense>
      <ShortToolbarContent />
    </Suspense>
  ),
  panelIcon: <Tools24 />,
  header: i18n.t('toolbar.panel_title'),
  minHeight: 56,
});

export const toolbar: () => PanelFeatureInterface = () => ({
  content: (
    <Suspense>
      <ToolbarContent />
    </Suspense>
  ),
  panelIcon: <Tools24 />,
  header: i18n.t('toolbar.panel_title'),
  minHeight: 121,
});
