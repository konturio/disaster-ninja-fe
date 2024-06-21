import type { BillingCycleDetail, PaymentPlan } from '~features/subscriptions/types';

export interface PaymentMethodDetail {
  id: string;
  client_id: string;
}

export interface SubscriptionsConfig {
  paymentMethodsDetails: PaymentMethodDetail[];
  billingCyclesDetails: BillingCycleDetail[];
  plans: PaymentPlan[];
}
