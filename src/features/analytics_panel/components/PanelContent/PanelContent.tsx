import { lazy } from 'react';
import styles from './PanelContent.module.css';

const LazyLoadedAnalyticsContainer = lazy(
  () => import('../AnalyticsContainer/AnalyticsContainer'),
);

export function PanelContent() {
  return (
    <div className={styles.panelBody}>
      <LazyLoadedAnalyticsContainer />
    </div>
  );
}
