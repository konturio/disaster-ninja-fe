import { Text } from '@konturio/ui-kit';
import { HexIcon } from '~components/SimpleLegend/icons/HexIcon';
import { CircleIcon } from '~components/SimpleLegend/icons/CircleIcon';
import { SquareIcon } from '~components/SimpleLegend/icons/SquareIcon';
import s from './SimpleLegend.module.css';
import type { LegendIconSize } from '~core/types';
import type { SimpleLegend as SimpleLegendType } from '~core/logical_layers/types/legends';
import type { CSSProperties } from 'react';

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

function icon(
  type: string,
  styles: Flatten<SimpleLegendType['steps']>['style'],
  fill?: string,
  stroke?: string,
  iconSize: LegendIconSize = 'small',
) {
  if (!type) return null;
  const className = iconSize === 'normal' ? s.normalIcon : s.smallIcon;
  if (type === 'hex')
    return (
      <HexIcon
        styles={styles}
        size={iconSize}
        fill={fill}
        stroke={stroke}
        className={className}
      />
    );
  if (type === 'circle')
    return (
      <CircleIcon
        styles={styles}
        size={iconSize}
        fill={fill}
        stroke={stroke}
        className={className}
      />
    );
  if (type === 'square')
    return (
      <SquareIcon
        styles={styles}
        size={iconSize}
        fill={fill}
        stroke={stroke}
        className={className}
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
      {icon(
        step.stepShape,
        step.style,
        step.stepIconFill,
        step.stepIconStroke,
        step.stepIconSize,
      )}
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
