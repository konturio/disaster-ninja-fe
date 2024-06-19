import { useState } from 'react';
import { PayPalButtonsGroup } from '~features/subscriptions/components/PayPalButtonsGroup/PayPalButtonsGroup';

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
    <>
      {plans.map((plan) => (
        <div key={plan.planId} style={{ margin: '10px' }}>
          <div>{plan.name}</div>
          <div>{plan.price} USD</div>
          {activePlanId === plan.planId ? (
            <>[Current plan]</>
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
    </>
  );
}
