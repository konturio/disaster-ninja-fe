import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { TooltipInfo } from '~core/shared_state/сurrentTooltip'
import s from './Tooltip.module.css'
import { CloseIcon } from '@k2-packages/default-icons';
import { useEffect, useState } from 'react';
import { LinkRenderer } from '~utils/markdown/mdComponents';

export function Tooltip({ info, closeTooltip }: { info: TooltipInfo | null, closeTooltip: () => void }) {
  const [position, setPosition] =
    useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null>(null);

  useEffect(() => {
    if (info) {
      const { height, width } = window.visualViewport
      // Case - click was on the bottom half, put tooltip on top half
      if (info.position.y > (height / 2)) {
        // click was on the rigth side
        if (info.position.x > (width / 2)) setPosition('top-left')
        else setPosition('top-right')
      }
      // click was on the top right side
      else if (info.position.x > (width / 2)) {
        setPosition('bottom-left')
      }
      else setPosition('bottom-right')
    }
    else setPosition(null)

  }, [info?.position]);


  function close() {
    closeTooltip()
  }

  function onContentClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
  }

  if (!info) return null;

  return (
    <div className={s.tooltipContainer} onClick={close}>
      <div
        className={s.tooltipAnchor}
        style={{ top: info.position.y || 0, left: info.position.x || 0 }}
      >
        {position && <div className={clsx(s.popup, s[position])} >
          <div className={s.popupContent} onClick={onContentClick}>
            {typeof info.popup === 'string' ?
              <ReactMarkdown components={{ a: LinkRenderer }} className={s.markdown}>
                {info.popup}
              </ReactMarkdown>
              :
              info.popup
            }
            <div className={s.closeIcon} onClick={close}>
              <CloseIcon />
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}