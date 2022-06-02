import s from './LayerHideControl.module.css';
import { Eye16, EyeOff16 } from '@konturio/default-icons';

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
        <Eye16 />
      </div>
    );
  }

  return (
    <div onClick={unhideLayer} className={s.unhideLogo}>
      <EyeOff16 />
    </div>
  );
}
