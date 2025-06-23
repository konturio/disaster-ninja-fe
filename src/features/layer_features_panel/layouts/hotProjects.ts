export const hotProjectsLayout = {
  type: 'Card',
  $props: { active: 'active' },
  $context: 'properties',
  children: [
    {
      type: 'Row',
      children: [
        {
          type: 'Badge',
          $value: 'projectId',
          props: {
            format: 'project_id',
          },
        },
        {
          type: 'Badge',
          $props: {
            value: 'projectPriority',
            variant: 'projectPriority',
          },
          props: {
            format: 'priority_level',
            mapping: {
              low: 'neutral',
              medium: 'info',
              high: 'warning',
              urgent: 'error',
            },
          },
        },
      ],
    },
    {
      type: 'Title',
      $value: 'projectInfo.name',
    },
    {
      type: 'MappingProgress',
      $props: {
        percentValidated: 'percentValidated',
        percentMapped: 'percentMapped',
      },
    },
    {
      type: 'Field',
      $value: 'mappingTypes',
      showLabel: true,
    },
    {
      type: 'Field',
      $value: 'created',
    },
    {
      type: 'Field',
      $value: 'lastUpdated',
    },
    {
      type: 'Url',
      $value: 'projectId',
      // pre-transform: 'https://tasks.hotosm.org/projects/{value}' -> projectUrl,
      label: 'Open in Tasking Manager',
    },
  ],
};
