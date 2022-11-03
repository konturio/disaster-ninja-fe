import { SmartColumn } from '../../SmartColumn/SmartColumn';
import s from './Desktop.module.css';

export function DesktopLayout({
  analyticsColumn,
  advancedAnalyticsColumn,
  layersColumn,
  mapColumn,
  footer,
}) {
  return (
    <div className={s.contentWrap}>
      <SmartColumn>{analyticsColumn}</SmartColumn>

      <div className={s.advancedAnalyticsColumn}>{advancedAnalyticsColumn}</div>

      <div className={s.mapWrap}>
        <div className={s.mapSpaceBlank}></div>
        <div className={s.mapSpaceBottom}>{mapColumn}</div>
      </div>

      <SmartColumn>
        {layersColumn}
        <div className={s.intercomPlaceholder}></div>
      </SmartColumn>

      <div className={s.footer}>{footer}</div>
    </div>
  );
}
