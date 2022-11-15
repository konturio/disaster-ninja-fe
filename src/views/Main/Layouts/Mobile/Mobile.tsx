import s from './Mobile.module.css';

export function MobileLayout({ firstColumn, mapColumn, footer, drawToolbox }) {
  return (
    <div className={s.contentWrap}>
      <div className={s.toolbox}>{drawToolbox}</div>
      <div className={s.panelsColumn}>{firstColumn}</div>
      <div className={s.mapWrap}>
        <div className={s.mapSpaceRight}>{mapColumn}</div>
      </div>
      <div className={s.footerWrap}>{footer}</div>
    </div>
  );
}
