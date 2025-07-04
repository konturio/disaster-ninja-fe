import { Button, Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { LayerFeaturesCard } from '../LayerFeaturesCard';
import s from './LayerFeaturesPanel.module.css';
import type { FeaturesPanelItem } from './types';

export function ShortState({
  openFullState,
  feature,
  layout,
}: {
  openFullState: Parameters<typeof Button>[0]['onClick'];
  feature?: FeaturesPanelItem;
  layout: any;
}) {
  const featureInfo = feature && (
    <div>
      <LayerFeaturesCard feature={feature} isActive={true} layout={layout} />
    </div>
  );

  const panelContent = featureInfo || (
    <div className={s.noFeatures}>
      <Text type="short-l">{i18n.t('layer_features_panel.noFeatureSelected')}</Text>
      <div className={s.callToAction}>
        <Button
          variant="invert-outline"
          size="small"
          onClick={openFullState}
          className="knt-panel-button"
        >
          {i18n.t('layer_features_panel.chooseFeature')}
        </Button>
      </div>
    </div>
  );

  return <div className={s.shortPanel}>{panelContent}</div>;
}
