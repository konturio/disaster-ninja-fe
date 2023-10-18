import { configRepo } from '~core/config';
import s from './Mobile.module.css';

export function MobileLayout({
  firstColumn,
  mapColumnTop,
  mapColumnBottom,
  footer,
}: {
  firstColumn: JSX.Element;
  mapColumnTop: JSX.Element;
  mapColumnBottom: JSX.Element;
  footer: JSX.Element;
}) {
  return (
    <div className={s.contentWrap}>
      <div className={s.panelsColumn}>{firstColumn}</div>
      <div className={s.mapWrap}>
        <div className={s.mapSpaceRight} id={configRepo.get().mapBlankSpaceId}>
          {mapColumnTop}
          {mapColumnBottom}
        </div>
      </div>
      <div className={s.footerWrap}>{footer}</div>
      <div className={s.bottomBorder}></div>
    </div>
  );
}
