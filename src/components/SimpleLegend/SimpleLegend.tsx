import { Text } from '@konturio/ui-kit';
import Letter from '@konturio/default-icons/tslib/figma-icons/Letter.js';
import { HexIcon } from '~components/SimpleLegend/icons/HexIcon';
import { CircleIcon } from '~components/SimpleLegend/icons/CircleIcon';
import { SquareIcon } from '~components/SimpleLegend/icons/SquareIcon';
import s from './SimpleLegend.module.css';
import type { SimpleLegend as SimpleLegendType } from '~core/logical_layers/types/legends';
import type { CSSProperties } from 'react';

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

function icon(step: Flatten<SimpleLegendType['steps']>) {
  const { stepShape, style, stepIconFill, stepIconStroke } = step;

  if (!stepShape) return null;
  if (stepShape === 'letter') {
    const color = style['text-color'] || stepIconStroke || stepIconFill || '#000000';
    return <Letter width={12} height={12} style={{ color }} />;
  }
  if (stepShape === 'hex')
    return (
      <HexIcon styles={style} size="small" fill={stepIconFill} stroke={stepIconStroke} />
    );
  if (stepShape === 'circle')
    return (
      <CircleIcon
        styles={style}
        size="small"
        fill={stepIconFill}
        stroke={stepIconStroke}
      />
    );
  if (stepShape === 'square')
    return (
      <SquareIcon
        styles={style}
        size="normal"
        fill={stepIconFill}
        stroke={stepIconStroke}
      />
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
      {icon(step)}
      {!onlyIcon && (
        <Text type="caption">
          <span className={s.stepName} style={style}>
            {step.stepName}
          </span>
        </Text>
      )}
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
          <SimpleLegendStep key={step.stepName || i} step={step} />
        ))}
      </div>
    </div>
  );
}
