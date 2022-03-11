import s from './Tooltip.module.css';
import clsx from 'clsx';
import { useAction } from '@reatom/react';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';

interface TooltipProps {
  tipText: string;
  className?: string;
  showedOnHover?: boolean;
}

export const Tooltip = ({
  tipText,
  className,
  showedOnHover,
}: TooltipProps) => {
  const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setTooltip({
      popup: tipText,
      position: { x: e.clientX, y: e.clientY },
      onOuterClick(e, close) {
        close();
      },
    });
  }

  function onPointerEnter(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (showedOnHover)
      setTooltip({
        popup: tipText,
        position: { x: e.clientX, y: e.clientY },
        hoverBehavior: true,
      });
  }

  function onPointerLeave() {
    if (showedOnHover) resetTooltip();
  }

  return (
    <div
      className={clsx(s.tooltip, className)}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          opacity="0.3"
          d="M6.99984 12.8332C10.2215 12.8332 12.8332 10.2215 12.8332 6.99984C12.8332 3.77818 10.2215 1.1665 6.99984 1.1665C3.77818 1.1665 1.1665 3.77818 1.1665 6.99984C1.1665 10.2215 3.77818 12.8332 6.99984 12.8332Z"
          stroke="#051626"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          opacity="0.3"
          d="M7 9.33333V7"
          stroke="#051626"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          opacity="0.3"
          d="M7 4.6665H7.00667"
          stroke="#051626"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
