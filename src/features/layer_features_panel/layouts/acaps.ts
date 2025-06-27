export const acapsLayout = {
  type: 'Card',
  $props: { active: 'active' },
  $context: 'properties',
  children: [
    { type: 'Badge', $value: 'acaps_source_dataset' },
    { type: 'Text', $value: 'country', overrides: { value: { format: 'join' } } },
    { type: 'Text', $value: 'adm1_eng_name', overrides: { value: { format: 'join' } } },
    { type: 'Text', $value: 'comment' },
    {
      type: 'Field',
      $value: 'source_date',
      overrides: { value: { format: 'date_time', label: 'Source Date' } },
    },
    { type: 'Url', $value: 'source_link', label: 'Source' },
  ],
};
