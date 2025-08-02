import { Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import s from './LayerFeaturesPanel.module.css';

export function EmptyState({ hasGeometry }: { hasGeometry: boolean }) {
  return (
    <div className={s.noFeatures}>
      <Text type="short-l">
        {hasGeometry
          ? i18n.t('layer_features_panel.no_features')
          : i18n.t('layer_features_panel.empty')}
      </Text>
    </div>
  );
}
