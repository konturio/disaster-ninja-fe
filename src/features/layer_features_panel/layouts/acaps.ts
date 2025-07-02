export const acapsLayout = {
  type: 'Card',
  $props: { active: 'active' },
  $context: 'properties',
  children: [
    // common
    { type: 'Badge', $value: 'acaps_source_dataset' },
    { type: 'Text', $value: 'country', overrides: { value: { format: 'join' } } },
    { type: 'Text', $value: 'adm1_eng_name', overrides: { value: { format: 'join' } } },
    //  risks list
    /*
    p.comment - title
    p.risk_type - text
    ['geographic_level', p.geographic_level],
    ['impact', p.impact],
    ['date_entered', p.source_date ?? ''],
    ['last_risk_update', p.last_risk_update],
    ['status', p.status],
    ['exposure', p.exposure],
    ['intensity', p.intensity],
    ['probability', p.probability],
    ['risk_level', p.risk_level],
    p.source_link - type: 'external_link',
    p.rationale - text
    p.trigger - text
    p.vulnerability - text
    ['published', p.published ?? ''],
    ['_internal_filter_date', p._internal_filter_date],
    */
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
