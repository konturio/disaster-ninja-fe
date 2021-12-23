import cn from 'clsx';
import s from './FoldingWrap.module.css';

function CollapseIndicator({
  isOpen,
  indent,
}: {
  isOpen: boolean;
  indent: boolean;
}) {
  return (
    <button
      className={cn(s.collapseIndicator, {
        [s.close]: !isOpen,
        [s.absolutePosition]: !indent,
      })}
    >
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
  childrenWithIndent = true,
}: {
  open: boolean;
  onStateChange: (newState: boolean) => void;
  children: JSX.Element | JSX.Element[];
  label: JSX.Element;
  childrenWithIndent?: boolean;
}) {
  return (
    <div>
      <div className={s.foldingControl} onClick={() => onStateChange(open)}>
        <CollapseIndicator isOpen={open} indent={childrenWithIndent} />
        <div className={s.foldingLabel}>{label}</div>
      </div>
      {open && (
        <div
          className={s.foldingContent}
          onClick={(e) => console.log('foldingContent', e)}
        >
          {children}
        </div>
      )}
    </div>
  );
}
