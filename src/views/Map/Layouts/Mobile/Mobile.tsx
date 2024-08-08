import cn from 'clsx';
import { configRepo } from '~core/config';
import s from './Mobile.module.css';
import type { ReactNode } from 'react';

export function MobileLayout({
  firstColumn,
  topColumn,
  mapColumnBottom,
  footer,
}: {
  firstColumn: ReactNode;
  topColumn: ReactNode;
  mapColumnBottom: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className={s.contentWrap}>
      <div className={s.panelsColumn}>{firstColumn}</div>
      <div className={s.topColumn}>{topColumn}</div>
      <div className={s.mapWrap}>
        <div
          className={cn(s.mapSpaceRight, s.greedy)}
          id={configRepo.get().mapBlankSpaceId}
        >
          {mapColumnBottom}
        </div>
      </div>
      <div className={s.footerWrap}>{footer}</div>
      <div className={s.bottomBorder}></div>
    </div>
  );
}
