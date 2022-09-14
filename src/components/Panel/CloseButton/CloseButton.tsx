import { ChevronDown24, ChevronUp24 } from '@konturio/default-icons';
import s from './CloseButton.module.css';

export function PanelCloseButton({ isOpen }: { isOpen: boolean }) {
  return <div className={s.closeBtn}>{isOpen ? <ChevronUp24 /> : <ChevronDown24 />}</div>;
}
