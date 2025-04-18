import { Edit16 } from '@konturio/default-icons';
import { useCallback } from 'react';
import { i18n } from '~core/localization';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import type {
  LogicalLayerActions,
  LogicalLayerState,
} from '~core/logical_layers/types/logicalLayer';

const featureFlags = configRepo.get().features;

export function EditControl({
  layerState,
  layerActions,
}: {
  layerState: LogicalLayerState;
  layerActions: LogicalLayerActions;
}) {
  const editLayer = useCallback(async () => {
    if (layerState.style?.type === 'mcda' && featureFlags[AppFeature.MCDA]) {
      const config = layerState.style?.config;
      dispatchMetricsEvent('mcda_edit');
      import('~features/mcda').then(async ({ editMCDA }) => {
        editMCDA(config, layerActions);
      });
    }
    if (
      layerState.style?.type === 'multivariate' &&
      featureFlags[AppFeature.MULTIVARIATE_ANALYSIS]
    ) {
      const config = layerState.style?.config;
      import('~features/multivariate_layer').then(async ({ editMultivariateLayer }) => {
        editMultivariateLayer(config, layerActions);
      });
    }
  }, [layerActions, layerState]);

  return (
    <LayerActionIcon onClick={editLayer} hint={i18n.t('layer_actions.tooltips.edit')}>
      <Edit16 />
    </LayerActionIcon>
  );
}
