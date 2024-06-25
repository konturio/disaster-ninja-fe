export interface BillingCycleDetails {
  id: 'month' | 'year';
  name: string;
  note: string | null;
}

interface PaymentMethod {
  type: string;
  planId: string;
}

export interface BillingCycle {
  id: string;
  pricePerMonth: number;
  initialPricePerMonth: number | null;
  pricePerYear: number | null;
  paymentMethods: PaymentMethod[];
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  style: 'basic' | 'premium';
  highlights: string[];
  billingCycles: BillingCycle[];
}

export type CurrentSubscription = {
  id: string;
  billingPlanId: string;
  billingSubscriptionId: string;
};
