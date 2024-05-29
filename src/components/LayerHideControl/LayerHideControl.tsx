import { Eye16, EyeOff16 } from '@konturio/default-icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '~core/tooltips';
import { i18n } from '~core/localization';
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
      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <div onClick={hideLayer} className={s.hideLogo}>
            <Eye16 />
          </div>
        </TooltipTrigger>
        <TooltipContent>{i18n.t('tooltips.hide')}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip placement="top">
      <TooltipTrigger asChild>
        <div onClick={unhideLayer} className={s.unhideLogo}>
          <EyeOff16 />
        </div>
      </TooltipTrigger>
      <TooltipContent>{i18n.t('tooltips.show')}</TooltipContent>
    </Tooltip>
  );
}
