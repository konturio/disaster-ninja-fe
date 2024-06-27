import React, { useMemo } from 'react';
import { Button, Heading, Text } from '@konturio/ui-kit';
import { Finish24 } from '@konturio/default-icons';
import clsx from 'clsx';
import { Price } from '~features/subscriptions/components/Price/Price';
import { i18n } from '~core/localization';
import { goTo } from '~core/router/goTo';
import s from './PaymentPlanCard.module.css';
import { PLANS_STYLE_CONFIG } from './contants';
import type { BillingCycle, PaymentPlan } from '~features/subscriptions/types';
import type { CurrentSubscription } from '~core/api/subscription';

export type PaymentPlanCardProps = {
  plan: PaymentPlan;
  currentBillingCycleId: string;
  currentSubscription: CurrentSubscription | null;
  isUserAuthorized: boolean;
};

function PaymentPlanCard({
  plan,
  currentBillingCycleId,
  currentSubscription,
  isUserAuthorized,
}: PaymentPlanCardProps) {
  const styleConfig = PLANS_STYLE_CONFIG[plan.style];

  const billingOption = useMemo(
    () => plan.billingCycles.find((option) => option.id === currentBillingCycleId),
    [plan.billingCycles, currentBillingCycleId],
  );

  return (
    <div className={clsx(s.planCard, styleConfig.className)}>
      <div className={s.planName}>
        {styleConfig.icon()}
        <Heading type="heading-04" margins={false}>
          {plan.name}
        </Heading>
      </div>
      {billingOption?.initialPricePerMonth && (
        <div className={s.initialPrice}>
          <span>${billingOption.initialPricePerMonth}</span>
        </div>
      )}
      {billingOption?.pricePerMonth && (
        <Price className={s.price} amount={billingOption.pricePerMonth} />
      )}
      <Text className={s.planDescription} type="short-m">
        {plan.description}
      </Text>
      <div className={s.buttonWrapper}>
        {renderPaymentPlanButton(plan, isUserAuthorized, currentSubscription)}
      </div>
      <ul className={s.highlights}>
        {plan.highlights.map((highlight, index) => (
          <li key={index}>
            <div className={s.highlight}>
              <Finish24 className={s.highlightIcon} />
              <span>{highlight}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className={s.footerWrapper}>
        {renderFooter(plan, isUserAuthorized, currentSubscription, billingOption)}
      </div>
    </div>
  );
}

function renderPaymentPlanButton(
  plan: PaymentPlan,
  isUserAuthorized: boolean,
  currentSubscription: CurrentSubscription | null,
) {
  if (!isUserAuthorized) {
    return (
      <Button className={s.authorizeButton} onClick={() => goTo('/profile')}>
        {i18n.t('subscription.unauthorized_button')}
      </Button>
    );
  }
  if (plan.id === currentSubscription?.id) {
    return <Button disabled>{i18n.t('subscription.current_plan_button')}</Button>;
  }
  return <Button className={s.authorizeButton}>Subscribe</Button>;
}

function renderFooter(
  plan: PaymentPlan,
  isUserAuthorized: boolean,
  currentSubscription: CurrentSubscription | null,
  billingOption?: BillingCycle,
) {
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
          pricePerYear: billingOption.pricePerYear,
        })}
      </Text>
    );
  }

  return null;
}

export default PaymentPlanCard;
