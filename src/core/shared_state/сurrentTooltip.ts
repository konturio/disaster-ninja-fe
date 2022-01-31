import { createBindAtom } from '~utils/atoms/createBindAtom';

export type TooltipData = {
  position: { x: number; y: number };
  popup: string | JSX.Element;
  onOuterClick?: (event, closeTooltip: () => void) => void;
  hoverBehabiour?: boolean;
};
type currentTooltipAtomState = TooltipData | null;

export const currentTooltipAtom = createBindAtom(
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
