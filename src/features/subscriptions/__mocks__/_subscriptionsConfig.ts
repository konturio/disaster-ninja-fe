import type { SubscriptionsConfig } from '../types';

export const config: SubscriptionsConfig = {
  billingMethodsDetails: [
    {
      id: 'paypal',
      clientId:
        'AWJQJnM0O2nDEUgmMe9827bk73hjJdo3f4tPK9vwKvBVwFnDk1UGzk_Y2yeh5huiStwwdJVRmdOYWmhv',
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
      name: 'Educational',
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
          pricePerMonth: 100.0,
          pricePerYear: null,
          billingMethods: [
            {
              id: 'paypal',
              billingPlanId: 'P-8GA97186HP797325NM2B7D7Y',
            },
          ],
        },
        {
          id: 'year',
          initialPricePerMonth: 100.0,
          pricePerMonth: 95.0,
          pricePerYear: 1140.0,
          billingMethods: [
            {
              id: 'paypal',
              billingPlanId: 'P-02L9453417504204DM2B7FDQ',
            },
          ],
        },
      ],
    },
    {
      id: 'kontur_atlas_pro',
      name: 'Professional',
      style: 'premium',
      description:
        'For GIS data analysts and managers who work with GIS on a daily basis',
      highlights: [
        'Multi-criteria decision analyses',
        'AI analytics',
        'Favorite area of interest',
        'Download analyses',
        'Customer support',
        'Upload custom indicators for analytics',
      ],
      billingCycles: [
        {
          id: 'month',
          initialPricePerMonth: null,
          pricePerMonth: 1000.0,
          pricePerYear: null,
          billingMethods: [
            {
              id: 'paypal',
              billingPlanId: 'P-47286102F9496000PM2B7FXA',
            },
          ],
        },
        {
          id: 'year',
          initialPricePerMonth: 1000.0,
          pricePerMonth: 950.0,
          pricePerYear: 11400.0,
          billingMethods: [
            {
              id: 'paypal',
              billingPlanId: 'P-9TD56337G94931803M2B7GTI',
            },
          ],
        },
        {
          id: 'year',
          initialPricePerMonth: 'Enterprise',
          pricePerMonth: null,
          pricePerYear: null,
          billingMethods: [
            {
              id: 'paypal',
              billingPlanId: 'P-2D320730VP634834UMZVR2QY',
            },
          ],
        },
      ],
    },
  ],
};
