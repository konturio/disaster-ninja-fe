import { Text } from '@konturio/ui-kit';
import s from './MultivariateLegendStep.module.css';

export function MultivariateLegendStep({
  textLines: text,
  icon,
}: {
  textLines: string[];
  icon: JSX.Element;
}): JSX.Element {
  return (
    <div className={s.mvLegendStep}>
      {icon}
      <div className={s.mvLegendStepMultiline}>
        {text.map((line, index) => (
          <Text type="caption" className={s.mvLegendStepText} key={`${index}`}>
            {line}
          </Text>
        ))}
      </div>
    </div>
  );
}
