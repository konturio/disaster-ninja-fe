import type { BillingCycleDetail, Plan } from '~features/subscriptions/types';

export interface PaymentMethodDetail {
  id: string;
  client_id: string;
}

export interface PricingConfig {
  paymentMethodsDetails: PaymentMethodDetail[];
  billingCyclesDetails: BillingCycleDetail[];
  plans: Plan[];
}
