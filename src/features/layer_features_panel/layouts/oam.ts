export const oamLayout = {
  type: 'Card',
  $props: { active: 'active' },
  $context: 'properties',
  children: [
    { type: 'Image', $value: 'properties.thumbnail' },
    { type: 'Title', $value: 'title' },
    {
      type: 'PropertiesTable',
      children: [
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
        {
          type: 'Field',
          $value: 'properties.resolution_in_meters',
          overrides: { value: { label: 'Resolution', format: 'distance_per_pixel' } },
        },
        {
          type: 'Field',
          $value: 'user.name',
          overrides: { value: { label: 'Uploaded by' } },
        },
        {
          type: 'Field',
          $value: 'provider',
          overrides: { value: { label: 'Provider' } },
        },
        {
          type: 'Field',
          $value: 'platform',
          overrides: { value: { label: 'Platform' } },
        },
        {
          type: 'Field',
          $value: 'properties.sensor',
          overrides: { value: { label: 'Sensor' } },
        },
        {
          type: 'Field',
          $value: 'file_size',
          overrides: { value: { label: 'File size', format: 'file_size' } },
        },
        {
          type: 'Field',
          $value: 'properties.license',
          overrides: { value: { label: 'License' } },
        },
      ],
    },
    { type: 'Url', $value: 'uuid', label: 'Download', props: { icon: 'Download16' } },
  ],
};
