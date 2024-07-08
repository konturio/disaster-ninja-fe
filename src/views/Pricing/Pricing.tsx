import { PricingContent } from '~features/subscriptions/components/PricingContent/PricingContent';
import { PaymentsProvider } from '~features/subscriptions/providers/PaymentsProvider';

export function PricingPage() {
  return (
    <PaymentsProvider>
      <PricingContent />
    </PaymentsProvider>
  );
}
