import { configRepo } from '~core/config';
import { SmartColumn } from '../../SmartColumn/SmartColumn';
import s from './Presentation.module.css';
import type { ReactNode } from 'react';

export function PresentationLayout({
  analyticsColumn,
  layersColumn,
  mapColumnTop,
  mapColumnBottom,
  footer,
}: {
  analyticsColumn: ReactNode;
  layersColumn: ReactNode;
  mapColumnTop: ReactNode;
  mapColumnBottom: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className={s.contentWrap}>
      <SmartColumn className={s.analytics}>{analyticsColumn}</SmartColumn>

      <div className={s.mapWrap}>
        <div className={s.mapSpaceTop}>{mapColumnTop}</div>
        <div className={s.mapSpaceBlank} id={configRepo.get().mapBlankSpaceId}></div>
        <div className={s.mapSpaceBottom}>{mapColumnBottom}</div>
      </div>

      <SmartColumn>{layersColumn}</SmartColumn>

      <div className={s.footerWrap}>{footer}</div>
    </div>
  );
}
