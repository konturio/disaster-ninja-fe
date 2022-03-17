// TODO add DownloadIcon to k2 packages
import DownloadIcon from '~core/draw_tools/icons/DownloadIcon';
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
      <DownloadIcon onClick={downloadLayer} stroke="red" />
    </div>
  );
}
