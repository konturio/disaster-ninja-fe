import { Download16 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';

export function DownloadControl({ startDownload }: { startDownload: () => void }) {
  return (
    <LayerActionIcon
      onClick={startDownload}
      hint={i18n.t('layer_actions.tooltips.download')}
    >
      <Download16 />
    </LayerActionIcon>
  );
}
