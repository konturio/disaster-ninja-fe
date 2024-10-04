import { PayPalButtons } from '@paypal/react-paypal-js';
import { setCurrentUserSubscription } from '~core/api/subscription';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { NotificationService } from '~core/notifications';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';

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
      onError={(err) => {
        dispatchMetricsEvent('pay_error');
        console.error('error from PayPal SDK:', err.toString());
      }}
      onApprove={async (data, actions) => {
        dispatchMetricsEvent('pay_success');
        if (!actions.subscription) {
          throw new Error('Unexpected error: actions.subscription is undefined');
        }
        await actions.subscription.get();
        if (onSubscriptionApproved) {
          onSubscriptionApproved(billingPlanId, data.subscriptionID);
        }
      }}
      createSubscription={async (data, actions) => {
        dispatchMetricsEvent('pay_click');
        try {
          const userEmail = configRepo.get().user?.email;
          const subscriptionId = await actions.subscription.create({
            plan_id: billingPlanId,
            custom_id: userEmail,
          });
          if (!subscriptionId) {
            throw new Error('Could not create subscription id');
          }
          const saveResult = await setCurrentUserSubscription(
            billingPlanId,
            subscriptionId,
          );
          if (saveResult?.billingSubscriptionId !== subscriptionId) {
            throw new Error('Incorrect subscription id received');
          }
          return subscriptionId;
        } catch (err) {
          NotificationService.getInstance().error({
            title: i18n.t('subscription.errors.payment_initialization'),
          });
          throw err;
        }
      }}
    >
      <h3 style={{ color: '#dc3545', textTransform: 'capitalize' }}>
        {'The component is ineligible to render'}
      </h3>
    </PayPalButtons>
  );
}
