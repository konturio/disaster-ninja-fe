import type { SubscriptionsConfig } from '../types';

export const config = {
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
      ],
    },
    {
      id: 'kontur_atlas_custom',
      name: 'Custom',
      style: 'custom',
    },
  ],
};
