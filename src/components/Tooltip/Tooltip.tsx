import s from './Tooltip.module.css';
import clsx from 'clsx';
import { useAction } from '@reatom/react';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { InfoOutline16 } from '@konturio/default-icons';

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
      <InfoOutline16 />
    </div>
  );
};
