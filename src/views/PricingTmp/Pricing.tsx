import { useState } from 'react';
import { PayPalButtonsGroup } from '~features/subscriptions/components/PayPalButtonsGroup/PayPalButtonsGroup';
import s from './Pricing.module.css';

type PaymentPlan = {
  planId: string;
  price: number;
  name: string;
};

type Subscription = {
  id: string;
};

const plans: PaymentPlan[] = [
  { planId: 'P-5LN407822G1390834MZYAPQA', price: 10, name: 'Mini' },
  { planId: 'P-39L95270DU7673147MZVVPZI', price: 95, name: 'Educational' },
];

export function Pricing() {
  const [activeSubscriptionId, setActiveSubscriptionId] = useState<string | null>(null);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  return (
    <div className={s.container}>
      {plans.map((plan, index) => (
        <div
          key={plan.planId}
          className={s.planContainer}
          style={{ backgroundColor: index === 1 ? '#99ccFF' : '#eee' }}
        >
          <h2>{plan.name}</h2>
          <h3>
            <u>{plan.price} USD</u>
          </h3>
          {activePlanId === plan.planId ? (
            <div className={s.currentPlan}>[Current plan]</div>
          ) : (
            <PayPalButtonsGroup
              planId={plan.planId}
              activePlanId={activePlanId}
              activeSubscriptionId={activeSubscriptionId}
              onSubscriptionApproved={(planId, subscriptionId) => {
                if (subscriptionId) {
                  setActiveSubscriptionId(subscriptionId);
                  setActivePlanId(planId);
                }
                alert(
                  `Subscription approved (plan: ${planId}, subscription: ${subscriptionId})`,
                );
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
