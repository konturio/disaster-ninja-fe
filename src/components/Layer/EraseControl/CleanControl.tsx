import { Rubber16 } from '@konturio/default-icons';
import { useCallback } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import style from './CleanControl.module.css';
import type {
  LogicalLayerActions,
  LogicalLayerState,
} from '~core/logical_layers/types/logicalLayer';

export function CleanControl({
  layerActions,
}: {
  layerState: LogicalLayerState;
  layerActions: LogicalLayerActions;
}) {
  const cleanLayer = useCallback(
    async function () {
      if (layerActions?.clean) {
        layerActions.clean();
      }
    },
    [layerActions],
  );

  return (
    <div className={style.clean} onClick={cleanLayer}>
      <Tooltip placement="top">
        <TooltipTrigger>
          <Rubber16 />
        </TooltipTrigger>
        <TooltipContent>Erase</TooltipContent>
      </Tooltip>
    </div>
  );
}
