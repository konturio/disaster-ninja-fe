import { Edit16 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { store } from '~core/store/store';
import { mcdaLayerAtom } from '~features/mcda/atoms/mcdaLayer';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { getMutualExcludedActions } from '~core/logical_layers/utils/getMutualExcludedActions';
import { FeatureFlag, featureFlagsAtom } from '~core/shared_state';
import style from './EditControl.module.css';
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
  async function editLayer() {
    if (layerState.style?.type === 'mcda' && featureFlags[FeatureFlag.MCDA]) {
      import('~features/mcda/mcdaConfig').then(async ({ editMCDAConfig }) => {
        {
          const config = await editMCDAConfig(layerState);
          if (config?.id) {
            layerActions.destroy();
            store.dispatch([
              mcdaLayerAtom.createMCDALayer({ ...config, id: config.id }),
              enabledLayersAtom.set(config.id),
              ...getMutualExcludedActions(layerState),
            ]);
          }
        }
      });
    }
  }
  return (
    <div className={style.edit} onClick={editLayer}>
      <Edit16 />
    </div>
  );
}
