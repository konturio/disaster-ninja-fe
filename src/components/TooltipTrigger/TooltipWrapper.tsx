import { useAction } from '@reatom/react-v2';
import { memo } from 'react';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import type { TooltipData } from '~core/shared_state/currentTooltip';
import type { MouseEvent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = any[];

interface TooltipWrapperProps {
  children: ({
    showTooltip,
    hideTooltip,
  }: {
    showTooltip: (e: MouseEvent<Element>, ...args: Args) => void;
    hideTooltip: () => void;
  }) => JSX.Element;
  tooltipText?: string | JSX.Element;
  renderTooltip?: (
    e: MouseEvent<Element>,
    setTooltip: (tooltipData: TooltipData) => void,
    ...args: Args
  ) => void;
  tooltipId?: string;
  hoverBehavior?: boolean;
  popupClasses?: { popupContent?: string };
}

const TooltipWrapper = memo(
  ({
    children,
    tooltipText,
    renderTooltip,
    tooltipId,
    hoverBehavior = true,
    popupClasses,
  }: TooltipWrapperProps) => {
    const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
    const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);

    const renderTextTooltip = (e: MouseEvent<Element>) => {
      if (tooltipText) {
        setTooltip({
          popupClasses,
          popup: tooltipText,
          position: { x: e.clientX, y: e.clientY },
          onOuterClick(e, close) {
            close();
          },
          initiatorId: tooltipId,
          hoverBehavior,
        });
      }
    };

    const showTooltip = (e: MouseEvent<Element>, ...args) => {
      if (!renderTooltip) {
        renderTextTooltip(e);
      } else {
        renderTooltip(e, setTooltip, ...args);
      }
    };

    const hideTooltip = () => {
      resetTooltip();
    };

    return children({
      showTooltip,
      hideTooltip,
    });
  },
);

TooltipWrapper.displayName = 'TooltipWrapper';

export { TooltipWrapper };
