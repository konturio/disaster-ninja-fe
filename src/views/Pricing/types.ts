import type { BillingCycleDetail, PaymentPlan } from '~features/subscriptions/types';

export interface PaymentMethodDetails {
  id: string;
  client_id: string;
}

export interface SubscriptionsConfig {
  paymentMethodsDetails: PaymentMethodDetails[];
  billingCyclesDetails: BillingCycleDetail[];
  plans: PaymentPlan[];
}
