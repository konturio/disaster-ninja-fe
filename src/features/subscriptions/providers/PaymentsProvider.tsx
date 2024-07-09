import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { configRepo } from '~core/config';
import { FeatureFlag } from '~core/shared_state';
import { PAYMENT_METHOD_ID_PAYPAL } from '../constants';
import type { ReactNode } from 'react';
import type { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import type { SubscriptionsConfig } from '../types';

const createPaypalOptions = (clientId: string): ReactPayPalScriptOptions => ({
  clientId,
  currency: 'USD',
  intent: 'subscription',
  vault: true,
});

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const subscriptionsСonfig = configRepo.get().features[
    FeatureFlag.SUBSCRIPTION
  ] as SubscriptionsConfig;
  const payPalClientId = subscriptionsСonfig?.billingMethodsDetails?.find(
    (method) => method.id === PAYMENT_METHOD_ID_PAYPAL,
  )?.clientId;
  return payPalClientId ? (
    <PayPalScriptProvider options={createPaypalOptions(payPalClientId)}>
      {children}
    </PayPalScriptProvider>
  ) : (
    <>{children}</>
  );
}
