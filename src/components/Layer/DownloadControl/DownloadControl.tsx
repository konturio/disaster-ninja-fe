import { Download16 } from '@konturio/default-icons';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import s from './DownloadControl.module.css';

export function DownloadControl({ startDownload }: { startDownload: () => any }) {
  function downloadLayer() {
    startDownload();
  }
  return (
    <div className={s.download} onClick={downloadLayer}>
      <Tooltip placement="top">
        <TooltipTrigger>
          <Download16 />
        </TooltipTrigger>
        <TooltipContent>Download</TooltipContent>
      </Tooltip>
    </div>
  );
}
