import configRepo from '~core/config';
import s from './Mobile.module.css';

export function MobileLayout({
  firstColumn,
  mapColumn,
  footer,
  drawToolbox,
}: {
  firstColumn: JSX.Element;
  mapColumn: JSX.Element;
  footer: JSX.Element;
  drawToolbox: JSX.Element;
}) {
  return (
    <div className={s.contentWrap}>
      <div className={s.toolbox}>{drawToolbox}</div>
      <div className={s.panelsColumn}>{firstColumn}</div>
      <div className={s.mapWrap}>
        <div className={s.mapSpaceRight} id={configRepo.get().mapBlankSpaceId}>
          {mapColumn}
        </div>
      </div>
      <div className={s.footerWrap}>{footer}</div>
      <div className={s.bottomBorder}></div>
    </div>
  );
}
