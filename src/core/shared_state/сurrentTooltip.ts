import { createBindAtom } from '~utils/atoms/createBindAtom';

export type TooltipInfo = {
  position: { x: number, y: number }
  popup: string | JSX.Element
}
type сurrentTooltipAtomState = TooltipInfo | null;

export const сurrentTooltipAtom = createBindAtom(
  {
    setCurrentTooltip: (tooltipInfo: TooltipInfo) => tooltipInfo,
    resetCurrentTooltip: () => null,
  },
  ({ onAction }, state: сurrentTooltipAtomState = null) => {
    onAction('setCurrentTooltip', (tooltipInfo) => {
      (state = tooltipInfo)
    });
    onAction('resetCurrentTooltip', () => (state = null));

    return state;
  },
  '[Shared state] сurrentTooltipAtom',
);
