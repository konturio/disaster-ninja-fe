import React, { memo, useMemo } from 'react';
import { Button, Heading, Text } from '@konturio/ui-kit';
import { Finish24 } from '@konturio/default-icons';
import clsx from 'clsx';
import { Price } from '~features/subscriptions/components/Price/Price';
import PaymentPlanCardFooter from '~features/subscriptions/components/PaymentPlanCardFooter/PaymentPlanCardFooter';
import {
  PAYMENT_METHOD_ID_PAYPAL,
  SALES_REPRESENTATIVE_LINK,
} from '~features/subscriptions/constants';
import { i18n } from '~core/localization';
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
  onNewSubscriptionApproved: () => void;
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
  const isCustomPlan = plan.style === 'custom';

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

  const renderSubscribeButtons = (paypalPlanId: string) => {
    return currentSubscription?.billingPlanId !== paypalPlanId ? (
      <PayPalButtonsGroup
        billingPlanId={paypalPlanId}
        activeBillingPlanId={currentSubscription?.billingPlanId}
        activeSubscriptionId={currentSubscription?.billingSubscriptionId}
        onSubscriptionApproved={(planId, subscriptionId) => {
          if (subscriptionId) {
            onNewSubscriptionApproved();
          } else {
            console.error(
              'Unexpected result: subscriptionId came null/undefined from Paypal SDK',
            );
          }
        }}
      />
    ) : (
      <Button disabled>{i18n.t('subscription.current_plan_button')}</Button>
    );
  };

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
          {`$${billingOption?.initialPricePerMonth?.toLocaleString('en-US')} ${i18n.t('currency.usd')} / mo*`}
        </div>
      )}
      {billingOption && (
        <Price className={s.price} amount={billingOption.pricePerMonth} />
      )}
      {isCustomPlan && <div className={s.customPlanName}>{plan.name}</div>}
      <Text className={s.planDescription} type="short-m">
        <span dangerouslySetInnerHTML={{ __html: plan.description }}></span>
      </Text>
      <div className={clsx(s.buttonWrapper, { [s.customButtonsWrapper]: isCustomPlan })}>
        {/* Non-authorized */}
        {!isUserAuthorized && !isCustomPlan && (
          <Button
            className={clsx(s.paymentPlanButton, styleConfig.className)}
            onClick={onUnauthorizedUserClick}
          >
            {i18n.t('subscription.unauthorized_button')}
          </Button>
        )}
        {/* Authorized */}
        {isUserAuthorized && paypalPlanId && renderSubscribeButtons(paypalPlanId)}
        {/* Custom Plan buttons */}
        {isCustomPlan && (
          <>
            <Button
              className={clsx(s.paymentPlanButton, styleConfig.className)}
              onClick={() => {}}
            >
              {i18n.t('subscription.sales_pla_button')}
            </Button>
            <a
              className={s.bookDemoLink}
              href={SALES_REPRESENTATIVE_LINK}
              target="_blank"
              rel="noreferrer"
            >
              {i18n.t('subscription.book_demo_button')}
            </a>
          </>
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
