import { createAtom } from '~utils/atoms';

export type TooltipCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type Coords = {
  x: number;
  y: number;
  // TODO: rename to `corner`
  predefinedPosition?: TooltipCorner;
};

export type TooltipData = {
  position: Coords;
  popup: string | JSX.Element;
  popupClasses?: { popupContent?: string };
  onOuterClick?: (event, closeTooltip: () => void) => void;
  onClose?: (event, closeTooltip: () => void) => void;
  hoverBehavior?: boolean;
  initiatorId?: string;
};
export const currentTooltipAtom = createAtom(
  {
    setCurrentTooltip: (tooltipData: TooltipData) => tooltipData,
    resetCurrentTooltip: () => null,
    turnOffById: (id: string) => id,
  },
  ({ onAction }, state: TooltipData | null = null) => {
    onAction('setCurrentTooltip', (tooltipData) => (state = tooltipData));
    onAction('resetCurrentTooltip', () => (state = null));
    onAction('turnOffById', (id) => {
      if (state?.initiatorId === id) state = null;
    });

    return state;
  },
  '[Shared state] currentTooltipAtom',
);
