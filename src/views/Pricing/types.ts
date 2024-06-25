import type { BillingCycleDetails, PaymentPlan } from '~features/subscriptions/types';

export interface PaymentMethodDetails {
  id: string;
  client_id: string;
}

export interface SubscriptionsConfig {
  paymentMethodsDetails: PaymentMethodDetails[];
  billingCyclesDetails: BillingCycleDetails[];
  plans: PaymentPlan[];
}
