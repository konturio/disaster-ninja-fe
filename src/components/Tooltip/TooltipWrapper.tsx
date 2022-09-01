import { useAction } from '@reatom/react';
import { memo } from 'react';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import type { PointerEvent } from 'react';
import type { TooltipData } from '~core/shared_state/currentTooltip';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = any[];

interface TooltipWrapperProps {
  children: ({
    showTooltip,
    hideTooltip,
  }: {
    showTooltip: (e: PointerEvent<Element>, ...args: Args) => void;
    hideTooltip: () => void;
  }) => JSX.Element;
  tooltipText?: string;
  renderTooltip?: (
    e: PointerEvent<Element>,
    setTooltip: (tooltipData: TooltipData) => void,
    ...args: Args
  ) => void;
  tooltipId?: string;
  hoverBehavior?: boolean;
}

const TooltipWrapper = memo(
  ({
    children,
    tooltipText,
    renderTooltip,
    tooltipId,
    hoverBehavior = true,
  }: TooltipWrapperProps) => {
    const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
    const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);

    const renderTextTooltip = (e: PointerEvent<Element>) => {
      if (tooltipText) {
        setTooltip({
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

    const showTooltip = (e: PointerEvent<Element>, ...args) => {
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
