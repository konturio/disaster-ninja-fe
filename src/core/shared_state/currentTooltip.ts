import { createAtom } from '~utils/atoms';

export type TooltipData = {
  position: { x: number; y: number };
  popup: string | JSX.Element;
  onOuterClick?: (event, closeTooltip: () => void) => void;
  hoverBehavior?: boolean;
  initiatorId?: string;
};
type currentTooltipAtomState = TooltipData | null;

export const currentTooltipAtom = createAtom(
  {
    setCurrentTooltip: (tooltipData: TooltipData) => tooltipData,
    resetCurrentTooltip: () => null,
    turnOffById: (id: string) => id,
  },
  ({ onAction }, state: currentTooltipAtomState = null) => {
    onAction('setCurrentTooltip', (tooltipData) => (state = tooltipData));
    onAction('resetCurrentTooltip', () => (state = null));
    onAction('turnOffById', (id) => {
      if (state?.initiatorId === id) state = null;
    });

    return state;
  },
  '[Shared state] currentTooltipAtom',
);
