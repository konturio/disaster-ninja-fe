import s from './LayerHideControl.module.css'
import {
  EyeBallCrossedIcon,
  EyeBallIcon
} from '@k2-packages/default-icons';

type LayerHideControlType = {
  isVisible: boolean
  hideLayer: () => void
  unhideLayer: () => void
}
export function LayerHideControl({ isVisible, hideLayer, unhideLayer }: LayerHideControlType) {
  if (isVisible) return (
    <div onClick={() => hideLayer()} className={s.hideLogo}>
      <EyeBallIcon />
    </div>
  )
  return (
    <div onClick={() => unhideLayer()} className={s.unhideLogo}>
      <EyeBallCrossedIcon />
    </div>
  )
}
