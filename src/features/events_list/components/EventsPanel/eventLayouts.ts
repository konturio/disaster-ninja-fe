// use with eventData
export const eventCardLayoutTemplate = {
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
      $if: 'active',
    },
    {
      type: 'IconButton',
      icon: 'Play24',
      value: 'Play episodes',
      action: 'playEpisodes',
      $if: 'showEpisodesButton',
    },
    {
      type: 'Row',
      $if: 'active',
      children: [
        {
          $value: 'externalUrls',
          $template: {
            type: 'Url',
          },
        },
      ],
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
