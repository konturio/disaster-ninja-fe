import clsx from 'clsx';
import { useAction } from '@reatom/react-v2';
import { InfoOutline16 } from '@konturio/default-icons';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import s from './TooltipTrigger.module.css';

interface TooltipProps {
  tipText: string;
  className?: string;
  showedOnHover?: boolean;
  tooltipId?: string;
  icon?: JSX.Element;
}

export const TooltipTrigger = ({
  icon = <InfoOutline16 />,
  tipText,
  className,
  showedOnHover,
  tooltipId,
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
      initiatorId: tooltipId,
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
      {icon}
    </div>
  );
};
