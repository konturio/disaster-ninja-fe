import { Edit16 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { useCallback } from 'react';
import { FeatureFlag, featureFlagsAtom } from '~core/shared_state';
import { i18n } from '~core/localization';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import type {
  LogicalLayerActions,
  LogicalLayerState,
} from '~core/logical_layers/types/logicalLayer';

export function EditControl({
  layerState,
  layerActions,
}: {
  layerState: LogicalLayerState;
  layerActions: LogicalLayerActions;
}) {
  const [featureFlags] = useAtom(featureFlagsAtom);

  const editLayer = useCallback(async () => {
    if (layerState.style?.type === 'mcda' && featureFlags[FeatureFlag.MCDA]) {
      dispatchMetricsEvent('mcda_edit');
      import('~features/mcda').then(async ({ editMCDA }) => {
        editMCDA(layerState, layerActions);
      });
    }
  }, [featureFlags, layerActions, layerState]);

  return (
    <LayerActionIcon onClick={editLayer} hint={i18n.t('layer_actions.tooltips.edit')}>
      <Edit16 />
    </LayerActionIcon>
  );
}
