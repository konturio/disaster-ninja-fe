export const hotProjectLayoutTemplate = {
  type: 'Card',
  children: [
    {
      type: 'Row',
      children: [
        {
          type: 'Badge',
          $value: 'projectId',
          overrides: {
            value: {
              format: 'text',
              icon: 'Project16',
            },
          },
        },
        // Project priority with proper binding and overrides
        {
          type: 'Badge',
          $props: {
            value: 'projectPriority',
            variant: 'projectPriority',
          },
          props: {
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
      type: 'Text',
      $value: 'projectInfo.shortDescription',
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
      type: 'Text',
      $value: 'mappingEditors',
    },
    {
      type: 'Url',
      $props: {
        value: 'projectId',
      },
      template: 'https://tasks.hotosm.org/projects/{value}',
      label: 'Open in Tasking Manager',
    },
  ],
};
