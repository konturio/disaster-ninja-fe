import { Text } from '@konturio/ui-kit';
import s from './DimensionStep.module.css';

export function DimensionStep({
  textLines: text,
  icon,
}: {
  textLines: string[];
  icon: JSX.Element;
}): JSX.Element {
  return (
    <div className={s.dimensionStep}>
      {icon}
      <div className={s.dimensionStepMultiline}>
        {text.map((line, index) => (
          <Text type="caption" className={s.dimensionStepName} key={`${index}`}>
            {line}
          </Text>
        ))}
      </div>
    </div>
  );
}
