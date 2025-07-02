export const acapsLayout = {
  type: 'Card',
  $props: { active: 'active' },
  $context: 'properties',
  children: [
    // common
    { type: 'Badge', $value: 'acaps_source_dataset' },
    { type: 'Text', $value: 'country', props: { format: 'list' } },
    { type: 'Text', $value: 'adm1_eng_name', props: { format: 'list' } },
    //  risks list
    {
      type: 'Block',
      $if: 'acaps_source_dataset',
      ifCondition: { op: '==', value: 'Risk list' },
      children: [
        { type: 'CardHeader', $value: 'comment' },
        { type: 'Text', $value: 'risk_type' },
        {
          type: 'PropertiesTable',
          children: [
            {
              type: 'Field',
              $value: 'geographic_level',
              overrides: { value: { label: 'geographic_level' } },
            },
            {
              type: 'Field',
              $value: 'impact',
              overrides: { value: { label: 'impact' } },
            },
            {
              type: 'Field',
              $value: 'source_date',
              overrides: { value: { label: 'date_entered' } },
            },
            {
              type: 'Field',
              $value: 'last_risk_update',
              overrides: { value: { label: 'last_risk_update' } },
            },
            {
              type: 'Field',
              $value: 'status',
              overrides: { value: { label: 'status' } },
            },
            {
              type: 'Field',
              $value: 'exposure',
              overrides: { value: { label: 'exposure' } },
            },
            {
              type: 'Field',
              $value: 'intensity',
              overrides: { value: { label: 'intensity' } },
            },
            {
              type: 'Field',
              $value: 'probability',
              overrides: { value: { label: 'probability' } },
            },
            {
              type: 'Field',
              $value: 'risk_level',
              overrides: { value: { label: 'risk_level' } },
            },
          ],
        },
        {
          type: 'Url',
          $value: 'source_link',
          $if: 'source_link',
        },
        { type: 'Title', value: 'rationale', props: { level: 3 } },
        { type: 'Text', $value: 'rationale' },
        { type: 'Title', value: 'trigger', props: { level: 3 } },
        { type: 'Text', $value: 'trigger' },
        { type: 'Title', value: 'vulnerability', props: { level: 3 } },
        { type: 'Text', $value: 'vulnerability' },
      ],
    },
    // Seasonal events calendar
    {
      type: 'Block',
      $if: 'acaps_source_dataset',
      ifCondition: { op: '==', value: 'Seasonal events calendar' },
      children: [
        { type: 'CardHeader', $value: 'indicator', props: { format: 'list' } },
        { type: 'Text', $value: 'months', props: { format: 'list' } },
        {
          type: 'PropertiesTable',
          children: [
            {
              type: 'Field',
              $value: 'event_type',
              overrides: { value: { label: 'event_type' } },
            },
            {
              type: 'Field',
              $value: 'source_name',
              overrides: { value: { label: 'source_name' } },
            },
            {
              type: 'Field',
              $value: 'source_date',
              overrides: { value: { label: 'source_date' } },
            },
            {
              type: 'Field',
              $value: 'label',
              overrides: { value: { label: 'label' } },
            },
          ],
        },
        { type: 'Text', $value: 'comment' },
        {
          type: 'Url',
          $value: 'source_link',
          $if: 'source_link',
        },
      ],
    },
    // Information landscape dataset
    {
      type: 'Block',
      $if: 'acaps_source_dataset',
      ifCondition: { op: '==', value: 'Information landscape dataset' },
      children: [
        { type: 'CardHeader', $value: 'indicator', props: { format: 'list' } },
        { type: 'Text', $value: 'subindicator', props: { format: 'list' } },
        {
          type: 'PropertiesTable',
          children: [],
        },
      ],
    },
    {
      type: 'PropertiesTable',
      children: [
        {
          type: 'Field',
          $value: 'published',
          overrides: { value: { label: 'published' } },
        },
        {
          type: 'Field',
          $value: '_internal_filter_date',
          overrides: { value: { label: '_internal_filter_date' } },
        },
      ],
    },
  ],
};
