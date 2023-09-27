import { configRepo } from '~core/config';
import { SmartColumn } from '../../SmartColumn/SmartColumn';
import s from './Laptop.module.css';

export function LaptopLayout({
  firstColumn,
  mapColumn,
  footer,
}: {
  firstColumn: JSX.Element;
  mapColumn: JSX.Element;
  footer: JSX.Element;
}) {
  return (
    <div className={s.contentWrap}>
      <SmartColumn className={s.panelsColumn}>{firstColumn}</SmartColumn>
      <div className={s.mapWrap}>
        <div className={s.mapSpaceBlank} id={configRepo.get().mapBlankSpaceId}></div>
        <div className={s.mapSpaceBottom}>{mapColumn}</div>
      </div>
      <div className={s.footerWrap}>{footer}</div>
    </div>
  );
}
