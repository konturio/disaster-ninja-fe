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
  title,
  controls,
  childrenWithIndent = true,
}: {
  open: boolean;
  onStateChange: (newState: boolean) => void;
  children: JSX.Element | JSX.Element[];
  title: JSX.Element;
  childrenWithIndent?: boolean;
  controls?: JSX.Element | false;
}) {
  return (
    <div>
      <div className={s.foldingHeader}>
        <div onClick={() => onStateChange(open)} className={s.foldingLabel}>
          <CollapseIndicator isOpen={open} indent={childrenWithIndent} />
          <div className={s.foldingTitle}>{title}</div>
        </div>
        <div className={s.foldingControls}>{controls}</div>
      </div>
      {open && <div className={s.foldingContent}>{children}</div>}
    </div>
  );
}
