import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
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
    AppFeature.SUBSCRIPTION
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
