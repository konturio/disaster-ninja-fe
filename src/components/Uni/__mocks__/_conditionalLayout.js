export const conditionalLayout = {
  type: 'Card',
  children: [
    {
      type: 'Badge',
      $value: 'country',
    },
    {
      type: 'Row',
      children: [
        { type: 'Title', $value: 'eventName' },
        {
          type: 'Severity',
          $if: 'itemType',
          ifCondition: { op: '==', value: 'risk' },
          $value: 'severity',
        },
      ],
    },
    {
      type: 'PropertiesTable',
      children: [
        {
          type: 'Field',
          $if: 'affectedPopulation',
          ifCondition: { op: '>', value: 5000 },
          $value: 'affectedPopulation',
        },
        {
          type: 'Field',
          $value: 'impact',
        },
        {
          type: 'Field',
          $value: 'sourceName',
        },
        {
          type: 'Field',
          $value: 'label',
        },
        {
          type: 'Text',
          $if: 'itemType',
          ifCondition: { op: '==', value: 'seasonal_event' },
          $value: 'description',
        },
      ],
    },
  ],
};

export const conditionalDataSamples = [
  {
    itemType: 'risk',
    eventName: 'Wildfire',
    severity: 'MODERATE',
    affectedPopulation: 10000,
    country: 'Australia',
    description: "This description shouldn't be displayed",
  },
  {
    itemType: 'risk',
    eventName: 'Flood',
    affectedPopulation: 120000,
    severity: 'SEVERE',
    country: 'Hungary',
    description: "This description shouldn't be displayed",
  },
  {
    itemType: 'risk',
    eventName: 'Storm',
    affectedPopulation: 5000,
    severity: 'MODERATE',
    country: 'New Zealand',
  },
  {
    itemType: 'seasonal_event',
    eventName: 'Birds migration',
    country: 'Sweden',
    description: 'Birds fly south from Sweden',
  },
];
