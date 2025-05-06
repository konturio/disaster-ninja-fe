import { configRepo } from '~core/config';
import { SmartColumn } from '../../SmartColumn/SmartColumn';
import s from './Desktop.module.css';
import type { ReactNode } from 'react';

export function DesktopLayout({
  topContent,
  leftColumn,
  rightColumn,
  mapColumnTop,
  mapColumnBottom,
  bottomLeftContent,
  footer,
}: {
  topContent?: ReactNode;
  leftColumn?: ReactNode;
  bottomLeftContent?: ReactNode;
  rightColumn: ReactNode;
  mapColumnTop?: ReactNode;
  mapColumnBottom?: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className={s.contentWrap}>
      {topContent && <div className={s.topContent}>{topContent}</div>}
      {bottomLeftContent && (
        <div className={s.bottomLeftContent}>{bottomLeftContent}</div>
      )}
      <SmartColumn className={s.leftColumn}>{leftColumn}</SmartColumn>

      <div className={s.mapWrap}>
        <div className={s.mapSpaceTop}>{mapColumnTop}</div>
        <div className={s.mapSpaceBlank} id={configRepo.get().mapBlankSpaceId}></div>
        <div className={s.mapSpaceBottom}>{mapColumnBottom}</div>
      </div>

      <SmartColumn className={s.rightColumn}>{rightColumn}</SmartColumn>

      <div className={s.footerWrap}>{footer}</div>
    </div>
  );
}
