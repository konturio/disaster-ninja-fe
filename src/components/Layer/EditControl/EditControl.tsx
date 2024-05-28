import { Edit16 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
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
      import('~features/mcda').then(async ({ editMCDA }) => {
        editMCDA(layerState, layerActions);
      });
    }
  }
  return (
    <Tooltip placement="top">
      <TooltipTrigger asChild>
        <div className={style.edit} onClick={editLayer}>
          <Edit16 />
        </div>
      </TooltipTrigger>
      <TooltipContent>Edit</TooltipContent>
    </Tooltip>
  );
}
