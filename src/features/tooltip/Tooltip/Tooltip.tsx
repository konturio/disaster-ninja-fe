import clsx from 'clsx';
import { useCallback } from 'react';
import { TooltipView } from '../TooltipView/TooltipView';
import { TooltipContent } from '../TooltipContent/TooltipContent';
import { findTooltipCorner } from './findTooltipCorner';
import { useCorner } from './useCorner';
import s from './Tooltip.module.css';
import type { LegacyRef } from 'react';
import type { CornerFn, TooltipCoords, TooltipCorner } from '../types';

type MouseClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

const stopPropagation = (e: MouseClickEvent) => e.stopPropagation();

export function Tooltip({
  transitionRef,
  position,
  content,
  getCorner = findTooltipCorner,
  classes,
  hoverBehavior,
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
  const corner = useCorner(getCorner, position);

  const onClickOuter = useCallback(
    (e: MouseClickEvent) => {
      if (onOuterClick && hoverBehavior !== true) {
        console.error('`onOuterClick` ignored when `hoverBehavior` disabled');
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
        <TooltipView
          anchor={{
            top: position.y || 0,
            right: (window.visualViewport?.width || 0) - position.x || 0,
          }}
          corner={corner}
          onClick={stopPropagation}
        >
          <TooltipContent className={classes?.popupContent} onClose={onClose}>
            {content}
          </TooltipContent>
        </TooltipView>
      )}
    </div>
  );
}
