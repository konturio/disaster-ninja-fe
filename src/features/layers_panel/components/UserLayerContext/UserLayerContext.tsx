import DownloadIcon from '~features/draw_tools/icons/DownloadIcon';
import s from './UserLayerContext.module.css';

export function UserLayerContext({ startDownload, }: {
  startDownload: () => any;
}) {
  function downloadLayer() {
    startDownload();
  }
  return (
    <div className={s.context} onClick={downloadLayer}>
      <DownloadIcon onClick={downloadLayer} stroke="red" />
    </div>
  );
}
