export const USE_MOCK_SUBSCRIPTION_CONFIG: boolean = true;

export const MOCK_SUBSCRIPTION_CONFIG = {
  billingMethodsDetails: [
    {
      id: 'paypal',
      clientId:
        'AVUvkVaipdxFpSB-TuFUn9NL46C1yHsfcBJVYFX14KPLr2iJmZ70RgjZVL3Pg2m6DGSYx9I7up7Bybx8',
    },
  ],
  billingCyclesDetails: [
    {
      id: 'month',
      name: 'Monthly',
      note: null,
    },
    {
      id: 'year',
      name: 'Annually',
      note: 'Save 5%',
    },
  ],
  plans: [
    {
      id: 'kontur_atlas_edu',
      name: 'Educational mock',
      style: 'basic',
      description:
        'For students, hobbyists, and anyone testing the entry-level option before upgrading',
      highlights: [
        'Multi-criteria decision analyses',
        'AI analytics',
        'Favorite area of interest',
        'Download analyses',
      ],
      billingCycles: [
        {
          id: 'month',
          initialPricePerMonth: null,
          pricePerMonth: 100,
          pricePerYear: null,
          billingMethods: [
            {
              id: 'paypal',
              billingPlanId: 'P-6SC73821CL187140HMZ7L3WA',
            },
          ],
        },
        {
          id: 'year',
          initialPricePerMonth: 100,
          pricePerMonth: 95,
          pricePerYear: 1140,
          billingMethods: [
            {
              id: 'paypal',
              billingPlanId: 'P-39E08448A1351381DMZ7L3HI',
            },
          ],
        },
      ],
    },
    {
      id: 'kontur_atlas_pro',
      name: 'Professional mock',
      style: 'premium',
      description:
        'For GIS data analysts and managers who work with GIS on a daily basis',
      highlights: [
        'Multi-criteria decision analyses',
        'AI analytics',
        'Favorite area of interest',
        'Download analyses',
        'Customer support',
        'Custom requests',
        'Upload custom indicators for analytics',
      ],
      billingCycles: [
        {
          id: 'month',
          initialPricePerMonth: null,
          pricePerMonth: 1000,
          pricePerYear: null,
          billingMethods: [
            {
              id: 'paypal',
              billingPlanId: 'P-53G943072P005303MMZ7L4YI',
            },
          ],
        },
        {
          id: 'year',
          initialPricePerMonth: 1000,
          pricePerMonth: 950,
          pricePerYear: 11400,
          billingMethods: [
            {
              id: 'paypal',
              billingPlanId: 'P-2LH997773E656611BMZ7L4LI',
            },
          ],
        },
      ],
    },
  ],
};

export const SUBSCRIPTION_CONFIG_OVERRIDE = {
  name: 'subscription',
  description: 'Allows to implement subscription plans and payments on apps',
  type: 'UI_PANEL',
  configuration: MOCK_SUBSCRIPTION_CONFIG,
};
