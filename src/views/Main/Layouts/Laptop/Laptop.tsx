import { SmartColumn } from '../SmartColumn';
import s from './Laptop.module.css';

export function LaptopLayout({ firstColumn, mapColumn, footer }) {
  return (
    <div className={s.contentWrap}>
      <SmartColumn>{firstColumn}</SmartColumn>
      <div className={s.mapWrap}>
        <div className={s.mapSpaceBlank}></div>
        <div className={s.mapSpaceBottom}>{mapColumn}</div>
      </div>
      <div>{footer}</div>
    </div>
  );
}
