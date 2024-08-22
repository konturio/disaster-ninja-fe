export type BillingCycleId = 'month' | 'year';

export interface BillingCycleDetails {
  id: BillingCycleId;
  name: string;
  note: string | null;
}

interface BillingMethod {
  id: string;
  billingPlanId: string;
}

export interface BillingCycle {
  id: BillingCycleId;
  pricePerMonth: number;
  initialPricePerMonth: number | null;
  pricePerYear: number | null;
  billingMethods: BillingMethod[];
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  style: 'basic' | 'premium' | 'custom';
  highlights: string[];
  billingCycles: BillingCycle[];
}

export interface BillingMethodDetails {
  id: string;
  clientId: string;
}

export interface SubscriptionsConfig {
  billingMethodsDetails: BillingMethodDetails[];
  billingCyclesDetails: BillingCycleDetails[];
  plans: PaymentPlan[];
}
