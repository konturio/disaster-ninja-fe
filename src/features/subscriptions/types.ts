export enum BillingCycleID {
  Monthly = 'month',
  Annually = 'year',
}

export enum PlanStyle {
  basic = 'basic',
  premium = 'premium',
}

export interface BillingCycleDetail {
  id: BillingCycleID;
  name: string;
  note: string | null;
}

interface PaymentMethod {
  type: string;
  planId: string;
}

interface BillingCycle {
  id: string;
  pricePerMonth: number;
  initialPricePerMonth: number | null;
  pricePerYear: number | null;
  paymentMethods: PaymentMethod[];
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  style: PlanStyle;
  highlights: string[];
  billingCycles: BillingCycle[];
}

export type CurrentSubscriptionInfo = {
  id: string;
  billingPlanId: string;
  billingSubscriptionId: string;
} | null;
