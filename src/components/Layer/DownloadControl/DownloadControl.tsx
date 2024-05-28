import { Download16 } from '@konturio/default-icons';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import s from './DownloadControl.module.css';

export function DownloadControl({ startDownload }: { startDownload: () => any }) {
  function downloadLayer() {
    startDownload();
  }

  return (
    <Tooltip placement="top">
      <TooltipTrigger asChild>
        <div className={s.download} onClick={downloadLayer}>
          <Download16 />
        </div>
      </TooltipTrigger>
      <TooltipContent>Download</TooltipContent>
    </Tooltip>
  );
}
