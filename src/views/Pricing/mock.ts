import { PaymentPlanType } from '~features/subscriptions/components/PaymentPlanCard/PaymentPlan';

export const MockPlans = [
  {
    type: PaymentPlanType.Educational,
    description:
      'For students, hobbyists, and anyone testing the entry-level option before upgrading',
    oldPrice: 100,
    price: 95,
    planFeatures: [
      'Multi-criteria decision analyses',
      'AI analytics',
      'Favorite area of interest',
      'Download analyses',
    ],
    priceSummary: '* Billed as $1,140 once yearly',
  },
  {
    type: PaymentPlanType.Professional,
    description: 'For GIS data analysts and managers who work with GIS on a daily basis',
    oldPrice: 1000,
    price: 950,
    planFeatures: [
      'Multi-criteria decision analyses',
      'AI analytics',
      'Favorite area of interest',
      'Download analyses',
      'Customer support',
      'Custom requests',
      'Upload custom indicators for analytics',
    ],
    priceSummary: '* Billed as $11,400 once yearly',
  },
];
