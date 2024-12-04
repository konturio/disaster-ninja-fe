import { Text } from '@konturio/ui-kit';
import { configRepo } from '~core/config';
import { PricingContent } from '~features/subscriptions/components/PricingContent/PricingContent';
import { PaymentsProvider } from '~features/subscriptions/providers/PaymentsProvider';
import { AppFeature } from '~core/app/types';
import s from './Pricing.module.css';
import type { SubscriptionsConfig } from '~features/subscriptions/types';

export function PricingPage() {
  const subscriptionFeature = configRepo.get().features[AppFeature.SUBSCRIPTION];
  const config =
    subscriptionFeature && typeof subscriptionFeature === 'object'
      ? (subscriptionFeature as SubscriptionsConfig)
      : null;

  return config ? (
    <PaymentsProvider>
      <PricingContent config={config} />
    </PaymentsProvider>
  ) : (
    <Text type="short-m" className={s.noConfig}>
      Configuration not found
    </Text>
  );
}
