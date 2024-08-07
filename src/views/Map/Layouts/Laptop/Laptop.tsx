import { configRepo } from '~core/config';
import { SmartColumn } from '../../SmartColumn/SmartColumn';
import s from './Laptop.module.css';
import type { ReactNode } from 'react';

export function LaptopLayout({
  firstColumn,
  mapColumnTop,
  mapColumnBottom,
  footer,
}: {
  firstColumn: ReactNode;
  mapColumnTop: ReactNode;
  mapColumnBottom: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className={s.contentWrap}>
      <SmartColumn className={s.panelsColumn}>{firstColumn}</SmartColumn>
      <div className={s.mapWrap}>
        <div className={s.mapSpaceTop}>{mapColumnTop}</div>
        <div className={s.mapSpaceBlank} id={configRepo.get().mapBlankSpaceId}></div>
        <div className={s.mapSpaceBottom}>{mapColumnBottom}</div>
      </div>
      <div className={s.footerWrap}>{footer}</div>
    </div>
  );
}
