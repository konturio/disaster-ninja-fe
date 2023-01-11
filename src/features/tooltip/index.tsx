import { useAtom } from '@reatom/react';
import { useCallback } from 'react';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import {
  CSSTransitionWrapper,
  fadeClassNames,
} from '~components/CssTransitionWrapper/CssTransitionWrapper';
import { Tooltip } from './Tooltip/Tooltip';
import { closeOnLocationChangeAtom } from './atoms/closeOnLocationChangeAtom';

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

  if (!tooltip) return null;

  return (
    <CSSTransitionWrapper in={Boolean(tooltip)} timeout={300} classNames={fadeClassNames}>
      {(transitionRef) => (
        <Tooltip
          transitionRef={transitionRef}
          position={tooltip.position}
          hoverBehavior={tooltip.hoverBehavior}
          getPlacement={tooltip.position.predefinedPosition}
          content={tooltip.popup}
          classes={tooltip.popupClasses}
          onClose={closeHandler}
          onOuterClick={outerClickHandler}
        />
      )}
    </CSSTransitionWrapper>
  );
}
