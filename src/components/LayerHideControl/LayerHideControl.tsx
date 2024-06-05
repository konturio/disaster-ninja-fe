import { Eye16, EyeOff16 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';

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
      <LayerActionIcon onClick={hideLayer} hint={i18n.t('layer_actions.tooltips.hide')}>
        <Eye16 />
      </LayerActionIcon>
    );
  }

  return (
    <LayerActionIcon onClick={unhideLayer} hint={i18n.t('layer_actions.tooltips.show')}>
      <EyeOff16 />
    </LayerActionIcon>
  );
}
