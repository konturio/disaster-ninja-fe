import { LLMAnalyticsContainer } from '../LLMAnalyticsContainer/LLMAnalyticsContainer';
import styles from './LLMPanelContent.module.css';

export function LLMPanelContent() {
  return (
    <div className={styles.panelBody}>
      <LLMAnalyticsContainer />
    </div>
  );
}
