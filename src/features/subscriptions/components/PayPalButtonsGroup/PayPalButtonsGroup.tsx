import { PayPalButtons } from '@paypal/react-paypal-js';
import { setCurrentUserSubscription } from '~core/api/subscription';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';

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
      disabled={!!activeBillingPlanId}
      style={{
        label: 'subscribe',
        color: 'blue',
        height: 38,
        shape: 'rect',
      }}
      forceReRender={[activeSubscriptionId, activeBillingPlanId, billingPlanId]}
      onInit={(data, actions) => {}}
      onError={(err) => console.error('error from PayPal SDK:', err.toString())}
      onApprove={(data, actions) => {
        if (!actions.subscription) {
          return Promise.reject(
            'unexpected error from PayPal SDK: onApprove was called, but actions.subscription is undefined',
          );
        }
        return actions.subscription.get().then((details) => {
          if (onSubscriptionApproved) {
            onSubscriptionApproved(billingPlanId, data.subscriptionID);
          }
        });
      }}
      createSubscription={(data, actions) => {
        const userEmail = configRepo.get().user?.email;
        return actions.subscription
          .create({
            plan_id: billingPlanId,
            custom_id: userEmail,
          })
          .then(async (subscriptionId) => {
            const result = await setCurrentUserSubscription(
              billingPlanId,
              subscriptionId,
            );
            if (result?.billingSubscriptionId !== subscriptionId) {
              throw new Error(i18n.t('subscription.errors.payment_initialization'));
            }

            return subscriptionId;
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
