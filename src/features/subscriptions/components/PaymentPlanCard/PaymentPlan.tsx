import React, { useMemo } from 'react';
import { Heading, Text } from '@konturio/ui-kit';
import { Finish24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import clsx from 'clsx';
import { Price } from '~features/subscriptions/components/Price/Price';
import { userStateAtom } from '~core/auth';
import { i18n } from '~core/localization';
import { buttonRenderSwitch } from '~features/subscriptions/components/PaymentPlanCard/buttonRenderSwitch';
import s from './PaymentPlanCard.module.css';
import { PLAN_STYLING_CONFIG } from './contants';
import type { CurrentSubscriptionInfo, Plan } from '~features/subscriptions/types';

export type PaymentPlanProps = {
  plan: Plan;
  currentBillingCycleId: string;
  currentSubscriptionInfo: CurrentSubscriptionInfo;
};

function PaymentPlan({
  plan,
  currentBillingCycleId,
  currentSubscriptionInfo,
}: PaymentPlanProps) {
  const [userState] = useAtom(userStateAtom);

  const billingOption = useMemo(
    () => plan.billingCycles.find((option) => option.id === currentBillingCycleId),
    [plan.billingCycles, currentBillingCycleId],
  );

  return (
    <div className={clsx(s.planCard, PLAN_STYLING_CONFIG[plan.style].className)}>
      <div className={s.planName}>
        {PLAN_STYLING_CONFIG[plan.style].icon}
        <Heading type="heading-04" margins={false}>
          {plan.name}
        </Heading>
      </div>
      {billingOption?.initialPricePerMonth && (
        <div className={s.initialPrice}>
          <span>${billingOption.initialPricePerMonth}</span>
        </div>
      )}
      <Price className={s.price} amount={billingOption?.pricePerMonth}></Price>
      <Text className={s.planDescription} type="short-m">
        {plan.description}
      </Text>
      <div>{buttonRenderSwitch(plan, userState, currentSubscriptionInfo)}</div>
      <ul className={s.planHighlights}>
        {plan.highlights.map((highlight, index) => (
          <li key={index}>
            <div className={s.highlight}>
              <Finish24 className={s.highlightIcon}></Finish24>
              <span>{highlight}</span>
            </div>
          </li>
        ))}
      </ul>
      {billingOption?.pricePerYear && (
        <Text type="caption" className={s.priceSummary}>
          {i18n.t('subscription.price_summary', {
            pricePerYear: billingOption.pricePerYear,
          })}
        </Text>
      )}
    </div>
  );
}

export default PaymentPlan;
