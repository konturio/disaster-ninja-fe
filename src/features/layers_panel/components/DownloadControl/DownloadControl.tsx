import { Download16 } from '@k2-packages/default-icons';
import s from './DownloadControl.module.css';

export function DownloadControl({
  startDownload,
}: {
  startDownload: () => any;
}) {
  function downloadLayer() {
    startDownload();
  }
  return (
    <div className={s.download} onClick={downloadLayer}>
      <Download16 onClick={downloadLayer} />
    </div>
  );
}
