import {
  BillingCycleID,
  type CurrentSubscription,
  PaymentPlanStyle,
} from '~features/subscriptions/types';
import type { SubscriptionsConfig } from '~views/Pricing/types';

export const MOCK_PRICING_CONFIG: SubscriptionsConfig = {
  paymentMethodsDetails: [
    {
      id: 'payPal',
      client_id: '<client_id>',
    },
  ],
  billingCyclesDetails: [
    {
      id: BillingCycleID.Monthly,
      name: 'Monthly',
      note: null,
    },
    {
      id: BillingCycleID.Annually,
      name: 'Annually',
      note: 'Save 5%',
    },
  ],
  plans: [
    {
      id: 'kontur_atlas_edu',
      name: 'Educational',
      description:
        'For students, hobbyists, and anyone testing the entry-level option before upgrading',
      style: PaymentPlanStyle.basic,
      highlights: [
        'Multi-criteria decision analyses',
        'AI analytics',
        'Favorite area of interest',
        'Download analyses',
      ],
      billingCycles: [
        {
          id: 'month',
          pricePerMonth: 100,
          initialPricePerMonth: null,
          pricePerYear: null,
          paymentMethods: [
            {
              type: 'PayPal',
              planId: 'EDU_MONTHLY_PAYPAL_001',
            },
          ],
        },
        {
          id: 'year',
          initialPricePerMonth: 100,
          pricePerMonth: 95,
          pricePerYear: 1140,
          paymentMethods: [
            {
              type: 'PayPal',
              planId: 'EDU_ANNUAL_PAYPAL_001',
            },
          ],
        },
      ],
    },
    {
      id: 'kontur_atlas_pro',
      name: 'Professional',
      description:
        'For GIS data analysts and managers who work with GIS on a daily basis',
      style: PaymentPlanStyle.premium,
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
          pricePerMonth: 1000,
          initialPricePerMonth: null,
          pricePerYear: null,
          paymentMethods: [
            {
              type: 'PayPal',
              planId: 'PRO_MONTHLY_PAYPAL_001',
            },
          ],
        },
        {
          id: 'year',
          initialPricePerMonth: 1000,
          pricePerMonth: 950,
          pricePerYear: 11400,
          paymentMethods: [
            {
              type: 'PayPal',
              planId: 'PRO_ANNUAL_PAYPAL_001',
            },
          ],
        },
      ],
    },
  ],
};

export const CURRENT_SUBSCRIPTION_INFO: CurrentSubscription = {
  id: 'kontur_atlas_edu',
  billingPlanId: 'test',
  billingSubscriptionId: 'testtest',
};
