import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { configRepo } from '~core/config';
import type { ReactNode } from 'react';
import type { ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

const paypalOptions: ReactPayPalScriptOptions = {
  clientId:
    'AVUvkVaipdxFpSB-TuFUn9NL46C1yHsfcBJVYFX14KPLr2iJmZ70RgjZVL3Pg2m6DGSYx9I7up7Bybx8',
  currency: 'USD',
  intent: 'subscription',
  vault: true,
};

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const subscriptionsEnabled = configRepo.get().features.subscription;
  return subscriptionsEnabled ? (
    <PayPalScriptProvider options={paypalOptions}>{children}</PayPalScriptProvider>
  ) : (
    <>{children}</>
  );
}
