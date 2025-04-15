// Complex layout demonstrating advanced data binding features

export const complexDataSamples = [
  {
    countries: [
      {
        id: 0,
        name: 'Madagascar',
      },
      {
        id: 1,
        name: 'Comoros',
      },
    ],
    countryProfiles: [
      {
        countryId: 0,
        indicators: [
          {
            indicator: 'gdp',
            value: 1906,
          },
          {
            indicator: 'inform_risk',
            value: 5.1,
          },
        ],
      },
      {
        countryId: 1,
        indicators: [
          {
            indicator: 'gdp',
            value: 1500,
          },
          {
            indicator: 'inform_risk',
            value: 4.8,
          },
        ],
      },
    ],
    analytics: {
      geometry: [
        {
          indicator: 'area_km2',
          value: 458583,
        },
        {
          indicator: 'populated_area',
          value: 36896,
        },
      ],
      countries: [
        {
          countryId: 0,
          indicators: [
            {
              indicator: 'area_km2',
              value: 300000,
            },
            {
              indicator: 'populated_area',
              value: 4000000,
            },
          ],
        },
        {
          countryId: 1,
          indicators: [
            {
              indicator: 'area_km2',
              value: 158583,
            },
            {
              indicator: 'populated_area',
              value: 1716509,
            },
          ],
        },
      ],
      geometryCountryIntersections: [
        {
          countryId: 0,
          indicators: [
            {
              indicator: 'area_km2',
              value: 280000,
            },
            {
              indicator: 'populated_area',
              value: 3500000,
            },
          ],
        },
        {
          countryId: 1,
          indicators: [
            {
              indicator: 'area_km2',
              value: 150000,
            },
            {
              indicator: 'populated_area',
              value: 1600000,
            },
          ],
        },
      ],
    },
  },
];

// Layout designed to display complexEventData structure
export const complexDataLayout = {
  type: 'Card',
  props: {
    title: 'Country Analysis',
    className: 'country-analysis-card',
  },
  children: [
    {
      type: 'CardHeader',
      image:
        'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2IDFMMzEgOHYxNkwxNiAzMUwxIDI0VjhMMTYgMVoiIGZpbGw9IiNlZWUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgc2Fucy1zZXJpZiIgZmlsbD0iY3VycmVudENvbG9yIj5BQjwvdGV4dD48L3N2Zz4=',
      icon: 'Area16',
      value: 'Countries',
      subtitle: 'Report',
    },
    {
      type: 'Row',
      children: [
        {
          type: 'IconButton',
          value: 'Play',
          icon: 'Play24',
          action: 'play',
        },
        {
          type: 'IconButton',
          value: 'No icon button',
          action: 'test',
        },
      ],
    },
    {
      type: 'DataRepeater',
      $value: 'countries',
      template: {
        type: 'Badge',
        $value: 'name',
        variant: 'primary',
      },
    },
    {
      type: 'Title',
      value: 'Country Profiles',
    },
    {
      type: 'DataRepeater',
      $value: 'countryProfiles',
      template: {
        type: 'Card',
        props: {
          title: 'Country Profile',
          size: 'small',
        },
        children: [
          {
            type: 'Field',
            showLabel: true,
            value: 'Country ID:',
            $props: {
              value: 'countryId',
            },
          },
          {
            type: 'DataRepeater',
            $value: 'indicators',
            template: {
              type: 'Row',
              children: [
                {
                  type: 'Field',
                  $value: 'indicator',
                  showLabel: true,
                },
                {
                  type: 'Field',
                  $value: 'value',
                  showLabel: false,
                  overrides: {
                    value: {
                      format: 'number',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      type: 'Title',
      value: 'Analytics',
    },
    {
      type: 'Card',
      $context: 'analytics',
      props: {
        title: 'Geometry Indicators',
        size: 'small',
      },
      children: [
        {
          type: 'DataRepeater',
          $value: 'geometry',
          template: {
            type: 'Row',
            children: [
              {
                type: 'Field',
                $value: 'indicator',
                showLabel: true,
              },
              {
                type: 'Field',
                $value: 'value',
                showLabel: false,
                overrides: {
                  value: {
                    format: 'number',
                  },
                },
              },
            ],
          },
        },
      ],
    },
    {
      type: 'Title',
      value: 'Country Analytics',
      $context: 'analytics',
    },
    {
      type: 'DataRepeater',
      $value: 'countries',
      $context: 'analytics',
      template: {
        type: 'Card',
        props: {
          title: 'Country Analysis',
          size: 'small',
        },
        children: [
          {
            type: 'Field',
            showLabel: true,
            value: 'Country ID:',
            $props: {
              value: 'countryId',
            },
          },
          {
            type: 'DataRepeater',
            $value: 'indicators',
            template: {
              type: 'Row',
              children: [
                {
                  type: 'Field',
                  $value: 'indicator',
                  showLabel: true,
                },
                {
                  type: 'Field',
                  $value: 'value',
                  overrides: {
                    value: {
                      format: 'number',
                      icon: 'Area16',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      type: 'Title',
      value: 'Geometry-Country Intersections',
      $context: 'analytics',
    },
    {
      type: 'DataRepeater',
      $value: 'geometryCountryIntersections',
      $context: 'analytics',
      template: {
        type: 'Card',
        props: {
          title: 'Intersection',
          size: 'small',
        },
        children: [
          {
            type: 'Field',
            showLabel: true,
            value: 'Country ID:',
            $props: {
              value: 'countryId',
            },
          },
          {
            type: 'DataRepeater',
            $value: 'indicators',
            template: {
              type: 'Row',
              children: [
                {
                  type: 'Field',
                  $value: 'indicator',
                  showLabel: true,
                },
                {
                  type: 'Field',
                  $value: 'value',
                  overrides: {
                    value: {
                      format: 'square_km',
                      icon: 'Area16',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
