import React, { useMemo } from 'react';
import { Button, Heading, Text } from '@konturio/ui-kit';
import { Finish24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import clsx from 'clsx';
import { Price } from '~features/subscriptions/components/Price/Price';
import { userStateAtom } from '~core/auth';
import { i18n } from '~core/localization';
import { UserStateStatus } from '~core/auth/types';
import { goTo } from '~core/router/goTo';
import { isSubscriptionLoadedAtom } from '~views/Pricing/atoms/currentSubscription';
import s from './PaymentPlan.module.css';
import { PLAN_STYLING_CONFIG } from './contants';
import type {
  BillingCycle,
  CurrentSubscription,
  PaymentPlan,
} from '~features/subscriptions/types';
import type { UserStateType } from '~core/auth/types';

export type PaymentPlanProps = {
  plan: PaymentPlan;
  currentBillingCycleId: string;
  currentSubscriptionInfo: CurrentSubscription | null;
};

function PaymentPlan({
  plan,
  currentBillingCycleId,
  currentSubscriptionInfo,
}: PaymentPlanProps) {
  const [userState] = useAtom(userStateAtom);
  const [isLoaded] = useAtom(isSubscriptionLoadedAtom);

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
      <Price className={s.price} amount={billingOption?.pricePerMonth} />
      <Text className={s.planDescription} type="short-m">
        {plan.description}
      </Text>
      {isLoaded && (
        <div className={s.buttonWrapper}>
          {renderPaymentPlanButton(plan, userState, currentSubscriptionInfo)}
        </div>
      )}
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
      {isLoaded && (
        <div className={s.footerWrapper}>
          {renderFooter(plan, userState, currentSubscriptionInfo, billingOption!)}
        </div>
      )}
    </div>
  );
}

function renderPaymentPlanButton(
  plan: PaymentPlan,
  userState: UserStateType,
  currentSubscriptionInfo: CurrentSubscription | null,
) {
  if (userState === UserStateStatus.UNAUTHORIZED) {
    return (
      <Button className={s.authorizeButton} onClick={() => goTo('/profile')}>
        {i18n.t('subscription.unauthorized_button')}
      </Button>
    );
  }
  if (plan.id === currentSubscriptionInfo?.id) {
    return <Button disabled>{i18n.t('subscription.current_plan_button')}</Button>;
  }
  return <Button className={s.authorizeButton}>Subscribe</Button>;
}

function renderFooter(
  plan: PaymentPlan,
  userState: UserStateType,
  currentSubscriptionInfo: CurrentSubscription | null,
  billingOption: BillingCycle,
) {
  if (
    userState === UserStateStatus.AUTHORIZED &&
    plan.id === currentSubscriptionInfo?.id
  ) {
    return (
      <Button
        className={s.cancelButton}
        onClick={() => {}}
        variant="invert"
        id="cancel_subscription"
      >
        <Text type="caption">{i18n.t('cancel')}</Text>
      </Button>
    );
  }
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

export default PaymentPlan;
