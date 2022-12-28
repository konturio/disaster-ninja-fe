import { AdvancedAnalyticsContainer } from '../AdvancedAnalyticsContainer/AdvancedAnalyticsContainer';
import s from './PanelContent.module.css';

export function PanelContent() {
  return (
    <div className={s.panelBody}>
      <AdvancedAnalyticsContainer />
    </div>
  );
}
