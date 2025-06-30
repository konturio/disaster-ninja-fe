import { StackedProgressBar } from './Bar';
import { SeverityIndicator } from './Severity';
import { MappingProgress } from './MappingProgress';
import s from './UniComponents.module.css';
import { Text } from '@konturio/ui-kit';
import { PropertiesTable } from './PropertiesTable';

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
    <ComponentsGroup label="PropertiesTable">
      <PropertiesTable>
        {[
          <div>
            <div>Property 1</div>
            <div>Short value</div>
          </div>,
          <div>
            <div>Propert 2</div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis orci
              quis dui elementum tempor.
            </div>
          </div>,
          <div>
            <div>
              This property has no label, so the value takes all the available space.
            </div>
          </div>,
        ]}
      </PropertiesTable>
    </ComponentsGroup>
  </blockquote>
);
