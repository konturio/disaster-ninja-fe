export enum BillingCycleID {
  Monthly = 'month',
  Annually = 'year',
}

export enum PaymentPlanStyle {
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

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  style: PaymentPlanStyle;
  highlights: string[];
  billingCycles: BillingCycle[];
}

export type CurrentSubscription = {
  id: string;
  billingPlanId: string;
  billingSubscriptionId: string;
} | null;
