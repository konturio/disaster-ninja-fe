import { TriangleDown16 } from '@konturio/default-icons';
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
      <TriangleDown16 />
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
