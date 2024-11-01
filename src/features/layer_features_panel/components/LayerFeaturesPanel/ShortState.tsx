import { Button, Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { LayerFeaturesCard } from '../LayerFeaturesCard';
import s from './LayerFeaturesPanel.module.css';
import type { FeatureCardCfg } from '../CardElements';

export function ShortState({
  openFullState,
  feature,
}: {
  openFullState: Parameters<typeof Button>[0]['onClick'];
  feature: FeatureCardCfg | null;
}) {
  const featureInfo = feature && <LayerFeaturesCard feature={feature} isActive={true} />;

  const panelContent = featureInfo || (
    <div className={s.noFeatures}>
      <Text type="short-l">{i18n.t('layer_features_panel.noFeatureSelected')}</Text>
      <div className={s.callToAction}>
        <Button variant="invert-outline" size="small" onClick={openFullState}>
          {i18n.t('layer_features_panel.chooseFeature')}
        </Button>
      </div>
    </div>
  );

  return <div className={s.shortPanel}>{panelContent}</div>;
}
