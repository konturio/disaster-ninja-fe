import { Logo } from '@k2-packages/ui-kit';
import s from './KonturLogo.module.css';

const logoId = 'kontur_header_logo_id';
export function OriginalLogo() {
  return (
    <div className={s.invisible}>
      <Logo id={'kontur_header_logo_id'} compact={false} height={24} />
    </div>
  );
}
export function VisibleLogo() {
  return (
    <a
      href="https://www.kontur.io/"
      target="_blank"
      title="kontur.io"
      rel="noreferrer"
      className={s.logoRef}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="80"
        height="24"
      >
        <use xlinkHref="#kontur_header_logo_id" className={s.visible}></use>
      </svg>
    </a>
  );
}
