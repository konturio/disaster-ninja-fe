import cn from 'clsx';
import s from './FoldingWrap.module.css';

function CollapseIndicator({ isOpen, absoluteIndicator }: { isOpen: boolean, absoluteIndicator?: boolean }) {
  return (
    <button className={cn(s.collapseIndicator, { [s.close]: !isOpen, [s.absoluteIndicator]: absoluteIndicator,  })}>
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

export function FoldingWrap({
  open,
  onStateChange,
  children,
  label,
  absoluteIndicator
}: {
  open: boolean;
  onStateChange: (newState: boolean) => void;
  children: JSX.Element | JSX.Element[];
  label: JSX.Element;
  absoluteIndicator?: boolean
}) {
  return (
    <div className={s.folding}>
      <div className={s.foldingControl} onClick={() => onStateChange(open)}>
        <CollapseIndicator isOpen={open} absoluteIndicator={absoluteIndicator}/>
        <div className={s.foldingLabel}>{label}</div>
      </div>
      {open && <div className={s.foldingContent}>{children}</div>}
    </div>
  );
}
