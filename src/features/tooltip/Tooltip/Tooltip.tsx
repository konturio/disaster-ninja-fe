import clsx from 'clsx';
import { useCallback } from 'react';
import { TooltipAnchor } from '../TooltipAnchor/TooltipAnchor';
import { TooltipContent } from '../TooltipContent/TooltipContent';
import s from './Tooltip.module.css';
import type { LegacyRef } from 'react';
import type { CornerFn, TooltipCoords, TooltipCorner } from '../types';

type MouseClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

const stopPropagation = (e: MouseClickEvent) => e.stopPropagation();

export function Tooltip({
  transitionRef,
  position,
  content,
  getCorner,
  classes,
  hoverBehavior = false,
  onOuterClick,
  onClose,
}: {
  onClose: (e: MouseClickEvent) => void;
  transitionRef: LegacyRef<any>;
  position: TooltipCoords;
  content: string | JSX.Element;
  getCorner?: TooltipCorner | CornerFn;
  hoverBehavior?: boolean;
  classes?: { popupContent?: string };
  onOuterClick?: (e: MouseClickEvent) => void;
}) {
  const onClickOuter = useCallback(
    (e: MouseClickEvent) => {
      if (onOuterClick && hoverBehavior === true) {
        return;
      }

      if (onOuterClick) {
        onOuterClick(e);
        return;
      }

      onClose(e);
    },
    [hoverBehavior, onOuterClick, onClose],
  );

  return (
    <div
      ref={transitionRef}
      className={clsx(s.tooltipContainer, hoverBehavior && s.hoverTooltip)}
      onClick={onClickOuter}
    >
      {position && (
        <TooltipAnchor
          position={position}
          onClick={stopPropagation}
          getCorner={getCorner}
        >
          <TooltipContent
            className={classes?.popupContent}
            onClose={hoverBehavior ? undefined : onClose}
          >
            {content}
          </TooltipContent>
        </TooltipAnchor>
      )}
    </div>
  );
}
