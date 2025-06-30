import { typedObjectEntries } from '~core/types/entry';
import { StackedProgressBar } from './Bar';
import { SeverityIndicator } from './Severity';
import { MappingProgress } from './MappingProgress';
import s from './UniComponents.module.css';
import { Text } from '@konturio/ui-kit';

function ComponentsGroup({
  label,
  children,
}: {
  label?: string;
  children?: JSX.Element | JSX.Element[];
}) {
  return (
    <div className={s.componentsGroup}>
      <Text type="label">{label}</Text>
      <div className={s.componentsContainer}>{children}</div>
    </div>
  );
}

export default (
  <blockquote style={{ width: 390 }}>
    <ComponentsGroup label="StackedProgressBar">
      <MappingProgress
        percentValidated={30}
        percentMapped={60}
        caption="MappingProgress"
      />
      <StackedProgressBar
        value={[
          { title: '% processed', value: 57, color: 'green' },
          { title: '% received', value: 75, color: 'orange' },
        ]}
        caption="Stacked Progress Bar"
      />
      <StackedProgressBar
        value={[{ title: '%', value: 33, color: 'red' }]}
        caption="Progress"
      />
      <StackedProgressBar
        value={[
          { title: '% jaw', value: 7, color: 'green' },
          { title: '% drip', value: 26, color: 'orange' },
          { title: '% flock', value: 75, color: 'red' },
          { title: '% mass', value: 95, color: 'blue' },
        ]}
        caption="5 step Progress"
      />
    </ComponentsGroup>
    <ComponentsGroup label="SeverityIndicator">
      <SeverityIndicator value="MODERATE" />
      <SeverityIndicator value="UNKNOWN" />
    </ComponentsGroup>
  </blockquote>
);
