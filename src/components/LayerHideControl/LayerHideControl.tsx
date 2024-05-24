import { Eye16, EyeOff16 } from '@konturio/default-icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '~core/tooltips';
import s from './LayerHideControl.module.css';

type LayerHideControlType = {
  isVisible: boolean;
  hideLayer: () => void;
  unhideLayer: () => void;
};

export function LayerHideControl({
  isVisible,
  hideLayer,
  unhideLayer,
}: LayerHideControlType) {
  if (isVisible) {
    return (
      <div onClick={hideLayer} className={s.hideLogo}>
        <Tooltip placement="top">
          <TooltipTrigger>
            <Eye16 />
          </TooltipTrigger>
          <TooltipContent>Hide</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div onClick={unhideLayer} className={s.unhideLogo}>
      <Tooltip placement="top">
        <TooltipTrigger>
          <EyeOff16 />
        </TooltipTrigger>
        <TooltipContent>Show</TooltipContent>
      </Tooltip>
    </div>
  );
}
