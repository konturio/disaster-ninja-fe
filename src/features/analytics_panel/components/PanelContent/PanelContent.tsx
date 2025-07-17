import { AnalyticsContainer } from '../AnalyticsContainer/AnalyticsContainer';
import { DownloadCSVControl } from '../DownloadCSVControl/DownloadCSVControl';
import styles from './PanelContent.module.css';

export function PanelContent() {
  return (
    <div className={styles.panelBody}>
      <div className={styles.controls}>
        <DownloadCSVControl />
      </div>
      <AnalyticsContainer />
    </div>
  );
}
