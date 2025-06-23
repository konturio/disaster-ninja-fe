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
      format: 'date_timezone',
    },
    {
      type: 'Field',
      $value: 'lastUpdated',
      format: 'date_timezone',
    },
    {
      type: 'Url',
      $value: 'projectId',
      props: {
        urlTemplate: 'https://tasks.hotosm.org/projects/{{value}}',
      },
      label: 'Open in Tasking Manager',
    },
  ],
};
