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
      <div className={s.analyticsColumn}>{analyticsColumn}</div>
      <div className={s.advancedAnalyticsColumn}>{advancedAnalyticsColumn}</div>
      <div className={s.mapWrap}>
        <div className={s.mapSpaceBlank}></div>
        <div className={s.mapSpaceBottom}>{mapColumn}</div>
      </div>

      <div className={s.layersColumn}>
        {layersColumn}
        <div className={s.intercomPlaceholder}></div>
      </div>

      <div className={s.footer}>{footer}</div>
    </div>
  );
}
