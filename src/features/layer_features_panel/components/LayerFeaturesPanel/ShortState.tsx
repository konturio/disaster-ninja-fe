import { Button, Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { UniLayoutRenderer } from '~components/Uni/Layout/UniLayoutRenderer';
import s from './LayerFeaturesPanel.module.css';
import type { UniLayoutComponentNode } from '~components/Uni/Layout/types';
import type { Feature } from 'geojson';
import type { LayerFeature } from '../../types/layerFeature';

export interface ShortStateProps {
  openFullState: Parameters<typeof Button>[0]['onClick'];
  feature?: LayerFeature;
  layout: UniLayoutComponentNode;
}

export function ShortState({ openFullState, feature, layout }: ShortStateProps) {
  const featureInfo = feature && (
    <UniLayoutRenderer node={layout} data={{ ...feature, active: true }} />
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
