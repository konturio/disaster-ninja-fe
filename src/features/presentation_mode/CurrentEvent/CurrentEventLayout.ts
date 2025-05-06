export const currentEventLayout = {
  type: 'Card',
  action: 'focusEvent',
  $props: { active: 'active' },
  children: [
    {
      type: 'Row',
      children: [
        { type: 'Title', $value: 'eventName' },
        { type: 'Severity', $value: 'severity' },
      ],
    },
    {
      type: 'Text',
      $value: 'location',
    },
    {
      type: 'Row',
      children: [
        { type: 'Field', $value: 'affectedPopulation' },
        { type: 'Field', $value: 'settledArea' },
        { type: 'Field', $value: 'osmGaps' },
        { type: 'Field', $value: 'loss' },
      ],
    },
    {
      type: 'Text',
      $value: 'description',
    },
    {
      type: 'Field',
      $value: 'startedAt',
    },
    {
      type: 'Field',
      $value: 'updatedAt',
    },
  ],
};
