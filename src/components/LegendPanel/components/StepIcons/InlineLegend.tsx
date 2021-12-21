import { useMemo } from 'react';
import { HexIcon } from '~components/LegendPanel/icons/HexIcon';
import { CircleIcon } from '~components/LegendPanel/icons/CircleIcon';
import { SquareIcon } from '~components/LegendPanel/icons/SquareIcon';
import { SimpleLegend } from '~core/logical_layers/createLogicalLayerAtom/types';

export function InlineLegend({ legend }: { legend: SimpleLegend }) {
  const step = useMemo(() => legend?.steps[0], [legend]);

  if (!step) return null;
  if (step.stepShape === 'hex')
    return <HexIcon styles={step.style} size="normal" />;
  if (step.stepShape === 'circle')
    return <CircleIcon styles={step.style} size="normal" />;
  if (step.stepShape === 'square')
    return <SquareIcon styles={step.style} size="normal" />;

  return null;
}
