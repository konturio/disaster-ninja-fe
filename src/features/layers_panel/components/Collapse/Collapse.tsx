import cn from 'clsx';
import s from './Collapse.module.css';

function CollapseIndicator({ isOpen }: { isOpen: boolean }) {
  return (
    <button className={cn(s.collapseIndicator, { [s.close]: !isOpen })}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="6"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path fill="currentColor" d="M0 0l5 6 5-6" />
      </svg>
    </button>
  );
}

export function Collapse({
  open,
  onStateChange,
  children,
  label,
}: {
  open: boolean;
  onStateChange: (newState: boolean) => void;
  children: JSX.Element | JSX.Element[];
  label: JSX.Element;
}) {
  return (
    <div className={s.collapse}>
      <div className={s.collapseControl} onClick={() => onStateChange(open)}>
        <CollapseIndicator isOpen={open} />
        <div>{label}</div>
      </div>
      {open && <div className={s.collapseContent}>{children}</div>}
    </div>
  );
}
