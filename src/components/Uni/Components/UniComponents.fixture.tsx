import { typedObjectEntries } from '~core/types/entry';
import { StackedProgressBar } from './Bar';
import { SeverityIndicator } from './Severity';

export default (
  <blockquote style={{ width: 390 }}>
    {[
      <StackedProgressBar
        value={[
          { title: '% processed', value: 57, color: 'green' },
          { title: '% received', value: 75, color: 'orange' },
        ]}
        caption="Stacked Progress Bar"
      />,
      <StackedProgressBar
        value={[{ title: '%', value: 33, color: 'red' }]}
        caption="Progress"
      />,
      <StackedProgressBar
        value={[
          { title: '% jaw', value: 7, color: 'green' },
          { title: '% drip', value: 26, color: 'orange' },
          { title: '% flock', value: 75, color: 'red' },
          { title: '% mass', value: 95, color: 'blue' },
        ]}
        caption="5 step Progress"
      />,
      <SeverityIndicator value="MODERATE" />,
      <SeverityIndicator value="UNKNOWN" />,
    ].map((Element) => [Element, <hr />])}
  </blockquote>
);
