import { Rubber16 } from '@konturio/default-icons';
import { useCallback } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import { i18n } from '~core/localization';
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
    <Tooltip placement="top">
      <TooltipTrigger asChild>
        <div className={style.clean} onClick={cleanLayer}>
          <Rubber16 />
        </div>
      </TooltipTrigger>
      <TooltipContent>{i18n.t('tooltips.erase')}</TooltipContent>
    </Tooltip>
  );
}
