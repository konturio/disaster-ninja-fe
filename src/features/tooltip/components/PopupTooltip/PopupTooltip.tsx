import { useAtom } from '@reatom/react-v2';
import { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tooltip } from '@konturio/ui-kit';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import {
  CSSTransitionWrapper,
  fadeClassNames,
} from '~components/CssTransitionWrapper/CssTransitionWrapper';
import { parseLinksAsTags } from '~utils/markdown/parser';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import { closeOnLocationChangeAtom } from '../../atoms/closeOnLocationChangeAtom';
import s from './PopupTooltip.module.css';

export function PopupTooltip() {
  const [tooltip, { resetCurrentTooltip }] = useAtom(currentTooltipAtom);
  useAtom(closeOnLocationChangeAtom);

  const closeHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      resetCurrentTooltip();
      tooltip?.onClose?.(e, resetCurrentTooltip);
    },
    [resetCurrentTooltip, tooltip],
  );

  const outerClickHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      tooltip?.onOuterClick?.(e, resetCurrentTooltip);
    },
    [resetCurrentTooltip, tooltip],
  );

  return (
    <CSSTransitionWrapper in={Boolean(tooltip)} timeout={300} classNames={fadeClassNames}>
      {(transitionRef) => (
        <>
          {tooltip && (
            <Tooltip
              transitionRef={transitionRef}
              position={tooltip.position}
              hoverBehavior={tooltip.hoverBehavior}
              getPlacement={tooltip.position.predefinedPosition}
              classes={tooltip.popupClasses}
              onClose={closeHandler}
              onOuterClick={outerClickHandler}
            >
              {typeof tooltip.popup === 'string' ? (
                <ReactMarkdown components={{ a: LinkRenderer }} className={s.markdown}>
                  {parseLinksAsTags(tooltip.popup)}
                </ReactMarkdown>
              ) : (
                tooltip.popup
              )}
            </Tooltip>
          )}
        </>
      )}
    </CSSTransitionWrapper>
  );
}
