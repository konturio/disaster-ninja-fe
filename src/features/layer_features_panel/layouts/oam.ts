export const oamLayout = {
  type: 'Card',
  $props: { active: 'active' },
  $context: 'properties',
  children: [
    { type: 'Image', $value: 'properties.thumbnail' },
    { type: 'Title', $value: 'title' },
    {
      type: 'Field',
      $value: 'acquisition_start',
      overrides: { value: { format: 'date_month_year', label: 'Acquisition start' } },
    },
    {
      type: 'Field',
      $value: 'acquisition_end',
      overrides: { value: { format: 'date_month_year', label: 'Acquisition end' } },
    },
    {
      type: 'Field',
      $value: 'uploaded_at',
      overrides: { value: { format: 'date_month_year', label: 'Uploaded at' } },
    },
    { type: 'Field', $value: 'provider', overrides: { value: { label: 'Provider' } } },
    { type: 'Url', $value: 'uuid', label: 'Download', props: { icon: 'Download16' } },
  ],
};
