import { memo, useMemo } from 'react';
import { Button, Heading, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useAtom } from '@reatom/react-v2';
import { Price } from '~features/subscriptions/components/Price/Price';
import PaymentPlanCardFooter from '~features/subscriptions/components/PaymentPlanCardFooter/PaymentPlanCardFooter';
import {
  PAYMENT_METHOD_ID_PAYPAL,
  SALES_REPRESENTATIVE_LINK,
} from '~features/subscriptions/constants';
import { i18n } from '~core/localization';
import { intercomVisibleAtom, openIntercom } from '~features/intercom';
import { PayPalButtonsGroup } from '../PayPalButtonsGroup/PayPalButtonsGroup';
import s from './PaymentPlanCard.module.css';
import type { ReactNode, ReactElement } from 'react';
import type { BillingCycle, PaymentPlanConfig } from '~features/subscriptions/types';
import type { CurrentSubscription } from '~core/api/subscription';

export type PaymentPlanCardProps = {
  planConfig: PaymentPlanConfig;
  planContent: ReactNode[];
  currentBillingCycleId: string;
  currentSubscription: CurrentSubscription | null;
  isUserAuthorized: boolean;
  onUnauthorizedUserClick: () => void;
  onNewSubscriptionApproved: () => void;
};

const PaymentPlanCard = memo(function PaymentPlanCard({
  planConfig,
  currentBillingCycleId,
  currentSubscription,
  isUserAuthorized,
  onUnauthorizedUserClick,
  onNewSubscriptionApproved,
  planContent,
}: PaymentPlanCardProps) {
  const [isChatButtonVisible] = useAtom(intercomVisibleAtom);

  const planType = (planContent[0] as ReactElement).props.children[0];
  const content = planContent.slice(1, planContent.length - 2);
  const highlightsBlock = planContent.at(-1);
  const isCustomPlan = planType.toLowerCase() === 'custom';

  /** Get custom plan name out of plan description */
  let planName;
  let description;
  if (isCustomPlan) {
    planName = (content[0] as ReactElement).props.children[0];
    description = content[1];
  } else {
    description = content[0];
  }

  const billingOption = useMemo(
    () => planConfig.billingCycles?.find((option) => option.id === currentBillingCycleId),
    [planConfig.billingCycles, currentBillingCycleId],
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

  const priceBlock = !isCustomPlan && (
    <>
      {/* Just hide old price on 'month' to prevent content jumping */}
      {billingOption && (
        <div
          className={clsx(s.initialPrice, {
            [s.hidden]: billingOption.id === 'month',
          })}
        >
          {`$${billingOption?.initialPricePerMonth?.toLocaleString('en-US')} USD / mo`}
        </div>
      )}
      {billingOption && (
        <Price className={s.price} amount={billingOption.pricePerMonth} />
      )}
    </>
  );

  const descriptionBlock = (
    <>
      {planName && <div className={s.customPlanName}>{planName}</div>}
      {description && (
        <Text className={s.planDescription} type="short-m">
          {description}
        </Text>
      )}
    </>
  );

  const customButtons = (
    <>
      {isChatButtonVisible && (
        <Button className={clsx(s.paymentPlanButton)} onClick={openIntercom}>
          {i18n.t('subscription.sales_pla_button')}
        </Button>
      )}
      <a
        className={s.bookDemoLink}
        href={SALES_REPRESENTATIVE_LINK}
        target="_blank"
        rel="noreferrer"
      >
        {i18n.t('subscription.book_demo_button')}
      </a>
    </>
  );

  const buttonsBlock = (
    <div className={clsx(s.buttonWrapper, { [s.customButtonsWrapper]: isCustomPlan })}>
      {/* Non-authorized */}
      {!isUserAuthorized && !isCustomPlan && (
        <Button className={clsx(s.paymentPlanButton)} onClick={onUnauthorizedUserClick}>
          {i18n.t('subscription.unauthorized_button')}
        </Button>
      )}
      {/* Authorized */}
      {isUserAuthorized && paypalPlanId && renderSubscribeButtons(paypalPlanId)}
      {/* Custom Plan buttons */}
      {isCustomPlan && customButtons}
    </div>
  );

  const footerBlock = !isCustomPlan && (
    <div className={s.footerWrapper}>
      <PaymentPlanCardFooter
        planConfig={planConfig}
        isUserAuthorized={isUserAuthorized}
        currentSubscription={currentSubscription}
        billingOption={billingOption as BillingCycle | undefined}
      />
    </div>
  );

  return (
    <div className={clsx(s.planCard, planConfig.style)}>
      <div className={s.planType}>
        <Heading type="heading-04" margins={false}>
          {planType}
        </Heading>
      </div>
      {priceBlock}
      {descriptionBlock}
      {buttonsBlock}
      {highlightsBlock}
      {footerBlock}
    </div>
  );
});

export default PaymentPlanCard;
