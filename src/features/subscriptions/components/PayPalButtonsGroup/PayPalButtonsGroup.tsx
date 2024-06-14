import { PayPalButtons } from '@paypal/react-paypal-js';
import { NotificationService } from '~core/notifications';
import type { PayPalButtonsComponentProps } from '@paypal/react-paypal-js';

const ppTestLog = (...msg) => console.info('PayPal log', ...msg);

type PayPalButtonsGroupProps = {
  planId: string;
};

export function PayPalButtonsGroup({ planId }: PayPalButtonsGroupProps) {
  return (
    <PayPalButtons
      style={{
        label: 'paypal',
        color: 'blue',
      }}
      // forceReRender={[type]}
      onInit={(data, actions) =>
        ppTestLog('Library initialized and rendered', { data, actions })
      }
      onClick={(data, actions) => {
        NotificationService.getInstance().success({ title: 'Click!' });
        ppTestLog('Click event on the PayPal button', {
          data,
          actions,
        });
      }}
      onError={(err) => ppTestLog('error', err.toString())}
      onCancel={() => ppTestLog('The payment process was canceled')}
      onApprove={(data, actions) =>
        new Promise((resolve, reject) => {
          ppTestLog('onApprove', { data, actions });
          alert('Subscription was approved: ' + data.toString());
          actions.order;
          resolve();
        })
      }
      createSubscription={(data, actions) => {
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
