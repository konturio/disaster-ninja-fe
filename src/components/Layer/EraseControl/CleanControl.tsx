import { Rubber16 } from '@konturio/default-icons';
import { useCallback } from 'react';
import { i18n } from '~core/localization';
import { LayerActionIcon } from '~components/LayerActionButton/LayerActionIcon';
import type {
  LogicalLayerActions,
  LogicalLayerState,
} from '~core/logical_layers/types/logicalLayer';

export function CleanControl({ layerActions }: { layerActions: LogicalLayerActions }) {
  const cleanLayer = useCallback(
    async function () {
      if (layerActions?.clean) {
        layerActions.clean();
      }
    },
    [layerActions],
  );

  return (
    <LayerActionIcon onClick={cleanLayer} hint={i18n.t('tooltips.erase')}>
      <Rubber16 />
    </LayerActionIcon>
  );
}
