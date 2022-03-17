import { createAtom } from '~utils/atoms';

export type TooltipData = {
  position: { x: number; y: number };
  popup: string | JSX.Element;
  onOuterClick?: (event, closeTooltip: () => void) => void;
  hoverBehavior?: boolean;
};
type currentTooltipAtomState = TooltipData | null;

export const currentTooltipAtom = createAtom(
  {
    setCurrentTooltip: (tooltipData: TooltipData) => tooltipData,
    resetCurrentTooltip: () => null,
  },
  ({ onAction }, state: currentTooltipAtomState = null) => {
    onAction('setCurrentTooltip', (tooltipData) => (state = tooltipData));
    onAction('resetCurrentTooltip', () => (state = null));

    return state;
  },
  '[Shared state] currentTooltipAtom',
);
