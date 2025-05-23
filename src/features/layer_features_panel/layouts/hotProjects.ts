export const hotProjectsLayout = {
  type: 'Card',
  $props: { active: 'active' },
  $context: 'properties',
  children: [
    {
      type: 'Row',
      children: [
        { type: 'Badge', $value: 'projectId' },
        {
          type: 'Badge',
          $value: 'projectPriority',
          props: { variant: 'projectPriority' },
        },
        {
          type: 'Badge',
          $value: 'status',
          $if: 'status',
          overrides: { value: { format: 'text' } },
        },
      ],
    },
    { type: 'Title', $value: 'projectInfo.name' },
    {
      type: 'MappingProgress',
      $props: {
        percentValidated: 'percentValidated',
        percentMapped: 'percentMapped',
      },
    },
    { type: 'Field', $value: 'mappingTypes', overrides: { value: { format: 'join_title' } } },
    { type: 'Field', $value: 'created', overrides: { value: { format: 'date_time' } } },
    { type: 'Field', $value: 'lastUpdated', overrides: { value: { format: 'date_time' } } },
    {
      type: 'Url',
      $value: 'projectLink',
      label: 'Open in Tasking Manager',
    },
  ],
};
