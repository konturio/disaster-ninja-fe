import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { Close16 } from '@konturio/default-icons';
import { useState } from 'react';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import { parseLinksAsTags } from '~utils/markdown/parser';
import s from './Tooltip.module.css';
import type { TooltipData } from '~core/shared_state/currentTooltip';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type Coords = { x: number; y: number };

function findTooltipPosition(clickPosition?: Coords | null): Position | null {
  const { height, width } = window.visualViewport;
  if (!clickPosition) return null;
  // click was on the bottom right side
  if (clickPosition.y > height / 2 && clickPosition.x > width / 2)
    return 'top-left';
  // click was on the bottom left side
  if (clickPosition.y > height / 2) return 'top-right';
  // click was on the top right side
  if (clickPosition.x > width / 2) return 'bottom-left';
  // click was on the top right side
  return 'bottom-right';
}

export function Tooltip({
  properties,
  closeTooltip,
}: {
  properties: TooltipData | null;
  closeTooltip: () => void;
}) {
  const [position, setPosition] = useState<Position | null>(null);
  const [prevCoords, setPrevCoords] = useState<Coords | null | undefined>(null);

  if (!properties) return null;

  if (
    prevCoords?.x !== properties.position.x &&
    prevCoords?.y !== properties.position.y
  ) {
    if (!properties.position) {
      setPosition(null);
      setPrevCoords(null);
    } else {
      setPosition(findTooltipPosition(properties.position));
      setPrevCoords(properties.position);
    }
  }

  function onOuterClick(e) {
    if (!properties?.hoverBehavior)
      properties?.onOuterClick
        ? properties.onOuterClick(e, closeTooltip)
        : closeTooltip();
  }

  function stopPropagation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
  }

  return (
    <div
      className={clsx(
        s.tooltipContainer,
        properties.hoverBehavior && s.hoverTooltip,
      )}
      onClick={onOuterClick}
    >
      <div
        className={s.tooltipAnchor}
        style={{
          top: properties.position.y || 0,
          right: window.visualViewport.width - properties.position.x || 0,
        }}
      >
        {position && (
          <div className={clsx(s.popup, s[position])}>
            <div className={s.popupContent} onClick={stopPropagation}>
              {typeof properties.popup === 'string' ? (
                <ReactMarkdown
                  components={{ a: LinkRenderer }}
                  className={s.markdown}
                >
                  {parseLinksAsTags(properties.popup)}
                </ReactMarkdown>
              ) : (
                properties.popup
              )}
              {!properties.hoverBehavior && (
                <div className={s.closeIcon} onClick={() => closeTooltip()}>
                  <Close16 />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
