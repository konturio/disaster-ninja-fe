import s from './Presentation.module.css';
import type { ReactNode } from 'react';

export function PresentationLayout({
  title,
  breadcrumbs,
  sidePanel,
  copyrights,
  scaleAndLogo,
}: {
  title?: ReactNode;
  breadcrumbs?: ReactNode;
  sidePanel?: ReactNode;
  copyrights?: ReactNode;
  scaleAndLogo?: ReactNode;
}) {
  return (
    <div className={s.container}>
      <div className={s.headerRow}>
        <div className={s.breadcrumbs}>{breadcrumbs}</div>
        <div className={s.title}>{title}</div>
      </div>
      <div className={s.sidePanel}>{sidePanel}</div>
      <div className={s.copyrights}>{copyrights}</div>
      <div className={s.scaleAndLogo}>{scaleAndLogo}</div>
    </div>
  );
}
