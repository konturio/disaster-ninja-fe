import React, { memo, useMemo } from 'react';
import { Heading, Text } from '@konturio/ui-kit';
import { Finish24 } from '@konturio/default-icons';
import clsx from 'clsx';
import { Price } from '~features/subscriptions/components/Price/Price';
import PaymentPlanButton from '~features/subscriptions/components/PaymentPlanButton/PaymentPlanButton';
import PaymentPlanCardFooter from '~features/subscriptions/components/PaymentPlanCardFooter/PaymentPlanCardFooter';
import { PAYMENT_METHOD_ID_PAYPAL } from '~features/subscriptions/constants';
import { PayPalButtonsGroup } from '../PayPalButtonsGroup/PayPalButtonsGroup';
import s from './PaymentPlanCard.module.css';
import { PLANS_STYLE_CONFIG } from './contants';
import type { PaymentPlan } from '~features/subscriptions/types';
import type { CurrentSubscription } from '~core/api/subscription';

export type PaymentPlanCardProps = {
  plan: PaymentPlan;
  currentBillingCycleId: string;
  currentSubscription: CurrentSubscription | null;
  isUserAuthorized: boolean;
  onUnauthorizedUserClick: () => void;
  onNewSubscriptionApproved: (
    paymentMethodId: string,
    planId: string,
    billingPlanId: string,
    billingSubscriptionId: string,
  ) => void;
};

const PaymentPlanCard = memo(function PaymentPlanCard({
  plan,
  currentBillingCycleId,
  currentSubscription,
  isUserAuthorized,
  onUnauthorizedUserClick,
  onNewSubscriptionApproved,
}: PaymentPlanCardProps) {
  const styleConfig = PLANS_STYLE_CONFIG[plan.style];

  const billingOption = useMemo(
    () => plan.billingCycles.find((option) => option.id === currentBillingCycleId),
    [plan.billingCycles, currentBillingCycleId],
  );

  const paypalPlanId = useMemo(
    () =>
      billingOption?.billingMethods.find(
        (method) => method.id === PAYMENT_METHOD_ID_PAYPAL,
      )?.billingPlanId,
    [billingOption],
  );

  return (
    <div className={clsx(s.planCard, styleConfig.className)}>
      <div className={s.planName}>
        {styleConfig.icon()}
        <Heading type="heading-04" margins={false}>
          {plan.name}
        </Heading>
      </div>
      {/* Just hide old price on 'month' to prevent content jumping */}
      {billingOption && (
        <div
          className={clsx(s.initialPrice, { [s.hidden]: billingOption.id === 'month' })}
        >
          ${billingOption?.initialPricePerMonth}
        </div>
      )}
      {billingOption && (
        <Price className={s.price} amount={billingOption.pricePerMonth} />
      )}
      <Text className={s.planDescription} type="short-m">
        {plan.description}
      </Text>
      <div className={s.buttonWrapper}>
        {isUserAuthorized &&
        paypalPlanId &&
        currentSubscription?.billingPlanId !== paypalPlanId ? (
          <PayPalButtonsGroup
            billingPlanId={paypalPlanId}
            activeBillingPlanId={currentSubscription?.billingPlanId}
            activeSubscriptionId={currentSubscription?.billingSubscriptionId}
            onSubscriptionApproved={(planId, subscriptionId) => {
              if (subscriptionId) {
                onNewSubscriptionApproved(
                  PAYMENT_METHOD_ID_PAYPAL,
                  plan.id,
                  paypalPlanId,
                  subscriptionId,
                );
              }
            }}
          />
        ) : (
          <PaymentPlanButton
            plan={plan}
            isUserAuthorized={isUserAuthorized}
            onUnauthorizedUserClick={onUnauthorizedUserClick}
            currentSubscription={currentSubscription}
            style={styleConfig.className}
          />
        )}
      </div>
      <ul className={s.highlights}>
        {plan.highlights.map((highlight, index) => (
          <li key={index} className={s.highlight}>
            <Finish24 className={s.highlightIcon} />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <div className={s.footerWrapper}>
        <PaymentPlanCardFooter
          plan={plan}
          isUserAuthorized={isUserAuthorized}
          currentSubscription={currentSubscription}
          billingOption={billingOption}
        />
      </div>
    </div>
  );
});

export default PaymentPlanCard;
