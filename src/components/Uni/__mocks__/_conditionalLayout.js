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
          // show Severity if isRisk flag is truthy
          $if: 'isRisk',
          $value: 'severity',
        },
      ],
    },
    {
      type: 'PropertyGrid',
      children: [
        {
          type: 'Field',
          $if: 'affectedPopulation',
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
          $if: 'description',
          $value: 'description',
        },
      ],
    },
  ],
};

export const conditionalDataSamples = [
  {
    isRisk: true,
    eventName: 'Wildfire',
    severity: 'MODERATE',
    affectedPopulation: 10000,
    country: 'Australia',
    description: 'Moderate wildfire description',
  },
  {
    isRisk: false,
    eventName: 'Flood',
    affectedPopulation: 0,
    severity: 'SEVERE',
    country: 'Hungary',
    description: 'Severe flood description',
  },
  {
    isRisk: 0,
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
