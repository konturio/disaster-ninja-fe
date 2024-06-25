import type { BillingCycleDetails, PaymentPlan } from '~features/subscriptions/types';

export interface PaymentMethodDetails {
  id: string;
  clientId: string;
}

export interface SubscriptionsConfig {
  billingMethodsDetails: PaymentMethodDetails[];
  billingCyclesDetails: BillingCycleDetails[];
  plans: PaymentPlan[];
}
