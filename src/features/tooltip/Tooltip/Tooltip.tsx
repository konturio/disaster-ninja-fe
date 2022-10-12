import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { Close16 } from '@konturio/default-icons';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import { parseLinksAsTags } from '~utils/markdown/parser';
import s from './Tooltip.module.css';
import type { LegacyRef } from 'react';
import type { Coords, Position, TooltipData } from '~core/shared_state/currentTooltip';

function findTooltipPosition(clickPosition?: Coords | null): Position | null {
  if (window.visualViewport === null) return null;
  const { height, width } = window.visualViewport;
  if (!clickPosition) return null;
  // click was on the bottom right side
  if (clickPosition.y > height / 2 && clickPosition.x > width / 2) return 'top-left';
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
  transitionRef,
}: {
  properties: TooltipData | null;
  closeTooltip: () => void;
  transitionRef: LegacyRef<any>;
}) {
  const [position, setPosition] = useState<Position | null>(null);
  const [prevCoords, setPrevCoords] = useState<Coords | null | undefined>(null);
  const { pathname } = useLocation();
  const prevPathname = useRef<string>();

  useEffect(() => {
    if (pathname !== prevPathname.current && properties?.position) {
      closeTooltip();
    }
    prevPathname.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!properties) return null;

  if (
    prevCoords?.x !== properties.position.x ||
    prevCoords?.y !== properties.position.y
  ) {
    if (!properties.position) {
      setPosition(null);
      setPrevCoords(null);
    } else {
      setPosition(
        properties.position.predefinedPosition ||
          findTooltipPosition(properties.position),
      );
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
      ref={transitionRef}
      className={clsx(s.tooltipContainer, properties.hoverBehavior && s.hoverTooltip)}
      onClick={onOuterClick}
    >
      <div
        className={s.tooltipAnchor}
        style={{
          top: properties.position.y || 0,
          right: (window.visualViewport?.width || 0) - properties.position.x || 0,
        }}
      >
        {position && (
          <div className={clsx(s.popup, s[position])}>
            <div
              className={clsx(s.popupContent, properties.popupClasses?.popupContent)}
              onClick={stopPropagation}
            >
              {typeof properties.popup === 'string' ? (
                <ReactMarkdown components={{ a: LinkRenderer }} className={s.markdown}>
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
