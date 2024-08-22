import type { PaymentPlan } from '~features/subscriptions/types';

export const PAYMENT_METHOD_ID_PAYPAL = 'paypal';
export const SALES_REPRESENTATIVE_LINK = 'https://calendly.com/kbakhanko/atlas-demo';

export const CUSTOM_PLAN: PaymentPlan = {
  id: 'custom-plan',
  name: 'Enterprise',
  description:
    'Contact sales, book a demo or write to us at <a href="mailto:info@kontur.io">info@kontur.io</a> for custom pricing and features.',
  style: 'custom',
  highlights: [
    'Multiple seats',
    'Custom workflows',
    'Custom features',
    'Custom design',
    'Training and onboarding',
    'Support',
  ],
  billingCycles: [],
};
