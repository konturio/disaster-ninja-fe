import { PayPalButtons } from '@paypal/react-paypal-js';
import { setCurrentUserSubscription } from '~core/api/subscription';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';

const ppTestLog = (...msg) => {
  console.info('PayPalLog:', ...msg);
};

type PayPalButtonsGroupProps = {
  billingPlanId: string;
  activeBillingPlanId?: string | null;
  activeSubscriptionId?: string | null;
  onSubscriptionApproved?: (planId: string, subscriptionID?: string | null) => void;
};

export function PayPalButtonsGroup({
  billingPlanId,
  activeBillingPlanId,
  activeSubscriptionId,
  onSubscriptionApproved,
}: PayPalButtonsGroupProps) {
  return (
    <PayPalButtons
      disabled={activeBillingPlanId === billingPlanId}
      style={{
        label: 'subscribe',
        color: 'blue',
        height: 38,
        shape: 'rect',
      }}
      forceReRender={[activeSubscriptionId, activeBillingPlanId, billingPlanId]}
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
          if (onSubscriptionApproved) {
            onSubscriptionApproved(billingPlanId, data.subscriptionID);
          }
        });
      }}
      createSubscription={(data, actions) => {
        ppTestLog('create subscription:', {
          data,
          activeSubscriptionId,
          activePlanId: activeBillingPlanId,
        });
        // TODO: revise is PayPal's built-in method of switching subscription plan
        // if (activeSubscriptionId && activePlanId) {
        //   ppTestLog('revise:', { data });
        //   return actions.subscription.revise(activeSubscriptionId, {
        //     plan_id: planId,
        //   });
        // }
        const userEmail = configRepo.get().user?.email;
        return actions.subscription
          .create({
            plan_id: billingPlanId,
            custom_id: userEmail,
          })
          .then(async (subscriptionId) => {
            ppTestLog('subscriptionOrder', { orderId: subscriptionId });
            const result = await setCurrentUserSubscription(
              billingPlanId,
              subscriptionId,
            );
            if (result?.billingSubscriptionId === subscriptionId) {
              return subscriptionId;
            } else {
              throw new Error(i18n.t('subscription.errors.payment_initialization'));
            }
          })
          .catch((rejectReason) => {
            console.error('Error creating Paypal subscription:', rejectReason);
            throw new Error(rejectReason);
          });
      }}
    >
      <h3 style={{ color: '#dc3545', textTransform: 'capitalize' }}>
        {'The component is ineligible to render'}
      </h3>
    </PayPalButtons>
  );
}
