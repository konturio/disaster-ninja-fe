import { lazily } from 'react-lazily';
import { Layers24 } from '@konturio/default-icons';
import { Suspense } from 'react';
import { i18n } from '~core/localization';
import { MIN_HEIGHT } from './constants';
import type { PanelFeatureInterface } from 'types/featuresTypes';

const { PanelContent } = lazily(() => import('./components'));

export const layersPanel: PanelFeatureInterface = {
  content: (
    <Suspense>
      <PanelContent />
    </Suspense>
  ),
  panelIcon: <Layers24 />,
  header: i18n.t('layers'),
  minHeight: MIN_HEIGHT,
  resize: 'vertical',
};
