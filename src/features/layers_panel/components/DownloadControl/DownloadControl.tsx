import { Download16 } from '@konturio/default-icons';
import s from './DownloadControl.module.css';

export function DownloadControl({ startDownload }: { startDownload: () => any }) {
  function downloadLayer() {
    startDownload();
  }
  return (
    <div className={s.download} onClick={downloadLayer}>
      <Download16 />
    </div>
  );
}
