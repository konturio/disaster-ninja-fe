import { PayPalButtons } from '@paypal/react-paypal-js';

const ppTestLog = (...msg) => {
  // console.info('PayPalLog:', ...msg);
};

type PayPalButtonsGroupProps = {
  planId: string;
  activePlanId?: string | null;
  activeSubscriptionId?: string | null;
  onSubscriptionApproved: (planId: string, subscriptionID?: string | null) => void;
};

export function PayPalButtonsGroup({
  planId,
  activePlanId,
  activeSubscriptionId,
  onSubscriptionApproved,
}: PayPalButtonsGroupProps) {
  return (
    <PayPalButtons
      disabled={activePlanId === planId}
      style={{
        label: 'subscribe',
        color: 'blue',
        height: 38,
        shape: 'rect',
      }}
      forceReRender={[activeSubscriptionId, activePlanId, planId]}
      onInit={(data, actions) => {
        ppTestLog('Library initialized and rendered', { data, actions });
      }}
      onError={(err) => ppTestLog('error', err.toString())}
      onCancel={() => ppTestLog('The payment process was canceled')}
      onApprove={(data, actions) => {
        ppTestLog('onApprove', data, actions);
        if (!actions.subscription) {
          ppTestLog('APPROVE', 'SUBSCRIPTION_INSTANCE_ERROR');
          return Promise.reject('SUBSCRIPTION_INSTANCE_ERROR');
        }
        return actions.subscription.get().then(function (details) {
          ppTestLog('APPROVE', details);
          onSubscriptionApproved(planId, data.subscriptionID);
        });
      }}
      createSubscription={(data, actions) => {
        ppTestLog('create subscription: { data, activeSubscriptionId, activePlanId }');
        if (activeSubscriptionId && activePlanId) {
          ppTestLog('revise:', { data });
          return actions.subscription.revise(activeSubscriptionId, {
            plan_id: planId,
          });
        }
        return actions.subscription
          .create({
            plan_id: planId,
          })
          .then((orderId) => {
            ppTestLog('subscriptionOrder', { orderId });
            return orderId;
          });
      }}
    >
      <h3 style={{ color: '#dc3545', textTransform: 'capitalize' }}>
        {'The component is ineligible to render'}
      </h3>
    </PayPalButtons>
  );
}
