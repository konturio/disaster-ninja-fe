export const hotProjectsLayout = {
  type: 'Card',
  $props: { active: 'active' },
  children: [
    {
      type: 'Row',
      children: [
        {
          type: 'Badge',
          $value: 'projectId',
          props: {
            format: 'hash_id',
          },
        },
        {
          type: 'Badge',
          // isArchived added in preprocessor
          $if: 'isArchived',
          props: {
            value: 'Archived',
            variant: 'faint',
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
      type: 'PropertyGrid',
      children: [
        {
          type: 'Field',
          $value: 'created',
          format: 'date_timezone',
          overrides: { value: { label: 'Creation date' } },
        },
        {
          type: 'Field',
          $value: 'mappingTypes',
          format: 'capitalized_list',
          overrides: { value: { label: 'Mapping types' } },
        },
        {
          type: 'Field',
          $value: 'lastUpdated',
          format: 'date_timezone',
          overrides: { value: { label: 'Last contribution' } },
        },
      ],
    },
    {
      type: 'Url',
      $value: 'projectId',
      props: {
        urlTemplate: 'https://tasks.hotosm.org/projects/{{value}}',
      },
      label: 'Open in Tasking Manager',
      $if: 'active',
    },
  ],
};
