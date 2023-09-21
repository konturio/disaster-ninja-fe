import { appConfig } from '~core/app_config';
import { SmartColumn } from '../../SmartColumn/SmartColumn';
import s from './Desktop.module.css';

export function DesktopLayout({
  analyticsColumn,
  layersColumn,
  mapColumn,
  footer,
}: {
  analyticsColumn: JSX.Element;
  layersColumn: JSX.Element;
  mapColumn: JSX.Element;
  footer: JSX.Element;
}) {
  return (
    <div className={s.contentWrap}>
      <SmartColumn className={s.analytics}>{analyticsColumn}</SmartColumn>

      <div className={s.mapWrap}>
        <div className={s.mapSpaceBlank} id={appConfig.mapBlankSpaceId}></div>
        <div className={s.mapSpaceBottom}>{mapColumn}</div>
      </div>

      <SmartColumn>{layersColumn}</SmartColumn>

      <div className={s.footerWrap}>{footer}</div>
    </div>
  );
}
