import { AnalyticsContainer } from '../AnalyticsContainer/AnalyticsContainer';
import styles from './PanelContent.module.css';

export function PanelContent() {
  return (
    <div className={styles.panelBody}>
      <AnalyticsContainer />
    </div>
  );
}
