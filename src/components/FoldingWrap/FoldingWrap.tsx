import { TriangleDown16 } from '@konturio/default-icons';
import cn from 'clsx';
import s from './FoldingWrap.module.css';

function CollapseIndicator({ isOpen, indent }: { isOpen: boolean; indent: boolean }) {
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
  onClick,
  children,
  title,
  controls,
  childrenWithIndent = true,
  withCollapseIndicator = true,
}: {
  open: boolean;
  onClick?: () => void;
  children: JSX.Element | JSX.Element[];
  title: JSX.Element;
  childrenWithIndent?: boolean;
  controls?: JSX.Element | false;
  withCollapseIndicator?: boolean;
}) {
  return (
    <div>
      <div className={s.foldingHeader}>
        {withCollapseIndicator ? (
          <div onClick={onClick} className={s.foldingLabel}>
            <CollapseIndicator isOpen={open} indent={childrenWithIndent} />
            <div className={s.foldingTitle}>{title}</div>
          </div>
        ) : (
          <div className={s.foldingTitle}>{title}</div>
        )}
        <div className={s.foldingControls}>{controls}</div>
      </div>
      {open && (
        <div className={cn({ [s.childrenIndent]: childrenWithIndent }, s.foldingContent)}>
          {children}
        </div>
      )}
    </div>
  );
}
