import { Text } from '@konturio/ui-kit';
import { HexIcon } from '~components/SimpleLegend/icons/HexIcon';
import { CircleIcon } from '~components/SimpleLegend/icons/CircleIcon';
import { SquareIcon } from '~components/SimpleLegend/icons/SquareIcon';
import s from './SimpleLegend.module.css';
import type { SimpleLegend as SimpleLegendType } from '~core/logical_layers/types/legends';
import type { CSSProperties } from 'react';

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

function icon(
  type: string,
  styles: Flatten<SimpleLegendType['steps']>['style'],
  fill?: string,
  stroke?: string,
) {
  if (!type) return null;
  if (type === 'hex')
    return (
      <HexIcon
        styles={styles}
        size="small"
        fill={fill}
        stroke={stroke}
        className={s.smallIcon}
      />
    );
  if (type === 'circle')
    return (
      <CircleIcon
        styles={styles}
        size="small"
        fill={fill}
        stroke={stroke}
        className={s.smallIcon}
      />
    );
  if (type === 'square')
    return <SquareIcon styles={styles} size="normal" fill={fill} stroke={stroke} />;
}

function textLine(line: string, style: CSSProperties, key?: string) {
  return (
    <Text type="caption" key={key}>
      <span className={s.stepName} style={style}>
        {line}
      </span>
    </Text>
  );
}

export function SimpleLegendStep({
  step,
  onlyIcon = false,
}: {
  step: Flatten<SimpleLegendType['steps']>;
  onlyIcon?: boolean;
}) {
  const style: CSSProperties = {};
  if (step.style['text-color']) {
    style.color = step.style['text-color'];
  }

  return (
    <div className={s.legendStep}>
      {icon(step.stepShape, step.style, step.stepIconFill, step.stepIconStroke)}
      <div className={s.stepTextMultiline}>
        {!onlyIcon &&
          (Array.isArray(step.stepName)
            ? step.stepName.map((stepName, i) => textLine(stepName, style, stepName + i))
            : textLine(step.stepName, style))}
      </div>
    </div>
  );
}

export function SimpleLegend({
  legend,
  label,
  isHidden = false,
}: {
  legend: SimpleLegendType;
  label?: React.ReactChild;
  isHidden?: boolean;
}) {
  return (
    <div className={isHidden ? s.hidden : ''}>
      {label}
      <div className={s.multiSteps}>
        {legend.steps.map((step, i) => (
          <SimpleLegendStep
            key={`{${Array.isArray(step.stepName) ? step.stepName.join() : step.stepName}${i}`}
            step={step}
          />
        ))}
      </div>
    </div>
  );
}
