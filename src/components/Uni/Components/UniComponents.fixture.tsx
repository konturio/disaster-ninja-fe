import { typedObjectEntries } from '~core/types/entry';
import { StackedProgressBar } from './Bar';
import { SeverityIndicator } from './Severity';

export default (
  <blockquote style={{ width: 390 }}>
    {[
      <StackedProgressBar
        key="p1"
        value={[
          { title: '% processed', value: 57, color: 'green' },
          { title: '% received', value: 75, color: 'orange' },
        ]}
        caption="Progress"
      />,
      <StackedProgressBar
        key="p2"
        value={[
          { title: ' F-ty', value: 57, color: 'green' },
          // { title: '% sx', value: 75, color: 'orange' },
        ]}
        caption="Progress"
      />,
      <StackedProgressBar
        key="p2"
        value={[
          { title: ' F-ty', value: 57, color: 'green' },
          // { title: '% sx', value: 75, color: 'orange' },
        ]}
        // caption="Progress"
      />,
      <StackedProgressBar
        key="p3"
        value={[
          { title: '% jaw', value: 7, color: 'green' },
          { title: '% drip', value: 26, color: 'orange' },
          { title: '% flock', value: 75, color: 'red' },
          { title: '% mass', value: 95, color: 'blue' },
        ]}
        caption="5 step Progress"
      />,
      <hr />,
      <SeverityIndicator key="s1" value="MODERATE" />,
      <hr />,
      <SeverityIndicator key="s2" value="UNKNOWN" />,
    ]}
  </blockquote>
);
