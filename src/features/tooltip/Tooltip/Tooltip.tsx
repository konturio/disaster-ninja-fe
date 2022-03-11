import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { TooltipData } from '~core/shared_state/currentTooltip';
import s from './Tooltip.module.css';
import { CloseIcon } from '@k2-packages/default-icons';
import { useEffect, useState } from 'react';
import { LinkRenderer } from '~utils/markdown/mdComponents';

export function Tooltip({
  properties,
  closeTooltip,
}: {
  properties: TooltipData | null;
  closeTooltip: () => void;
}) {
  const [position, setPosition] = useState<
    'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null
  >(null);

  useEffect(() => {
    if (properties) {
      const { height, width } = window.visualViewport;
      // Case - click was on the bottom half, put tooltip on top half
      if (properties.position.y > height / 2) {
        // click was on the rigth side
        if (properties.position.x > width / 2) setPosition('top-left');
        else setPosition('top-right');
      }
      // click was on the top right side
      else if (properties.position.x > width / 2) {
        setPosition('bottom-left');
      } else setPosition('bottom-right');
    } else setPosition(null);
  }, [properties?.position]);

  function onOuterClick(e) {
    if (!properties?.hoverBehavior)
      properties?.onOuterClick
        ? properties.onOuterClick(e, closeTooltip)
        : closeTooltip();
  }

  function stopPropagation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
  }

  if (!properties) return null;

  return (
    <div
      className={clsx(
        s.tooltipContainer,
        properties?.hoverBehavior && s.hoverTooltip,
      )}
      onClick={onOuterClick}
    >
      <div
        className={s.tooltipAnchor}
        style={{
          top: properties.position.y || 0,
          left: properties.position.x || 0,
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
                  {properties.popup}
                </ReactMarkdown>
              ) : (
                properties.popup
              )}
              {!properties?.hoverBehavior && (
                <div className={s.closeIcon} onClick={() => closeTooltip()}>
                  <CloseIcon />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
