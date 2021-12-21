import { SimpleLegend } from '~core/logical_layers/createLogicalLayerAtom/types';
import { Text } from '@k2-packages/ui-kit';
import { HexIcon } from '~components/LegendPanel/icons/HexIcon';
import { CircleIcon } from '~components/LegendPanel/icons/CircleIcon';
import { LegendStepStyle } from '~components/LegendPanel/types';
import { SquareIcon } from '~components/LegendPanel/icons/SquareIcon';
import s from './MultiStepsLegend.module.css';

function icon(type: string, styles: LegendStepStyle) {
  if (!type) return null;
  if (type === 'hex') return <HexIcon styles={styles} size="small" />;
  if (type === 'circle') return <CircleIcon styles={styles} size="small" />;
  if (type === 'square') return <SquareIcon styles={styles} size="normal" />;
}

export function MultiStepsLegend({ legend }: { legend: SimpleLegend }) {
  return (
    <div className={s.multiStepsLegend}>
      <Text type="short-m">{legend.name}</Text>
      <div className={s.multiSteps}>
        {legend.steps
          .filter((s) => s.stepName)
          .map((step, i) => {
            return (
              <div className={s.legendStep} key={step.stepName + i}>
                {icon(step.stepShape, step.style)}
                <Text type="caption">
                  <span
                    className={s.stepName}
                    style={
                      step.style['text-color']
                        ? { color: step.style['text-color'] }
                        : {}
                    }
                  >
                    {step.stepName}
                  </span>
                </Text>
              </div>
            );
          })}
      </div>
    </div>
  );
}
