import { Text } from '@konturio/ui-kit';
import React, { memo } from 'react';
import { i18n } from '~core/localization';
import type { BillingCycle, PaymentPlan } from '~features/subscriptions/types';
import type { CurrentSubscription } from '~core/api/subscription';

export type PaymentPlanCardFooterProps = {
  plan: PaymentPlan;
  isUserAuthorized: boolean;
  currentSubscription: CurrentSubscription | null;
  billingOption?: BillingCycle;
};

const PaymentPlanCardFooter = memo(function PaymentPlanCardFooter({
  plan,
  isUserAuthorized,
  currentSubscription,
  billingOption,
}: PaymentPlanCardFooterProps) {
  // Postpone cancel button rendering till next pr
  // if (
  //   isUserAuthorized &&
  //   plan.id === currentSubscription?.id
  // ) {
  //   return (
  //     <Button
  //       className={s.cancelButton}
  //       onClick={() => {}}
  //       variant="invert"
  //       id="cancel_subscription"
  //     >
  //       <Text type="caption">{i18n.t('cancel')}</Text>
  //     </Button>
  //   );
  // }
  if (billingOption?.pricePerYear) {
    return (
      <Text type="caption">
        {i18n.t('subscription.price_summary', {
          pricePerYear: billingOption.pricePerYear.toLocaleString('en-US'),
        })}
      </Text>
    );
  }

  return null;
});

export default PaymentPlanCardFooter;
