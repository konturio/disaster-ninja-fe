import type { BillingCycleDetails, PaymentPlan } from '~features/subscriptions/types';

export interface BillingMethodDetails {
  id: string;
  clientId: string;
}

export interface SubscriptionsConfig {
  billingMethodsDetails: BillingMethodDetails[];
  billingCyclesDetails: BillingCycleDetails[];
  plans: PaymentPlan[];
}
