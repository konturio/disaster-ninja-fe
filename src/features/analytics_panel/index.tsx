import { Analytics24 } from '@konturio/default-icons';
import { lazily } from 'react-lazily';
import { Suspense } from 'react';
import { i18n } from '~core/localization';
import { MAX_HEIGHT, MIN_HEIGHT } from './constants';
import type { PanelFeatureInterface } from 'types/featuresTypes';

export const analyticsPanel = (
  isStandardAnalyticsOn: boolean,
  isLLMAnalyticsOn: boolean,
): PanelFeatureInterface => {
  const contentComponents: (() => JSX.Element)[] = [];
  if (isStandardAnalyticsOn) {
    const { PanelContent: AnalyticsPanelContent } = lazily(
      () => import('./components/PanelContent/PanelContent'),
    );
    contentComponents.push(AnalyticsPanelContent);
  }
  if (isLLMAnalyticsOn) {
    // TODO: importing from another feature is bad. We should reorganize the panel probably
    const { LLMPanelContent } = lazily(() => import('~features/llm_analytics'));
    contentComponents.push(LLMPanelContent);
  }

  return {
    content: (
      <Suspense>
        {contentComponents.map((Item, index) => (
          <Item key={`analytics_${index}`} />
        ))}
      </Suspense>
    ),
    panelIcon: <Analytics24 />,
    header: i18n.t('analytics_panel.header_title'),
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
    skipAutoResize: true,
    resize: 'vertical',
  };
};
