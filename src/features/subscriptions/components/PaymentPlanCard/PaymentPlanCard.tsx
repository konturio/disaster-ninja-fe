import { memo, useMemo } from 'react';
import { Button, Heading, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useAtom } from '@reatom/react-v2';
import { Price } from '~features/subscriptions/components/Price/Price';
import PaymentPlanCardFooter from '~features/subscriptions/components/PaymentPlanCardFooter/PaymentPlanCardFooter';
import {
  CUSTOM_PLAN_ID,
  PAYMENT_METHOD_ID_PAYPAL,
} from '~features/subscriptions/constants';
import { i18n } from '~core/localization';
import { intercomVisibleAtom, openIntercomChat } from '~features/intercom';
import { PayPalButtonsGroup } from '../PayPalButtonsGroup/PayPalButtonsGroup';
import s from './PaymentPlanCard.module.css';
import type { ReactNode, ReactElement } from 'react';
import type { BillingCycle, PaymentPlanConfig } from '~features/subscriptions/types';
import type { CurrentSubscription } from '~core/api/subscription';

export type PaymentPlanCardProps = {
  planConfig: PaymentPlanConfig;
  planContent: ReactNode[];
  currentBillingCycleId: string;
  salesLink?: string;
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
  salesLink,
  planContent,
}: PaymentPlanCardProps) {
  const [isChatButtonVisible] = useAtom(intercomVisibleAtom);

  const planType = (planContent[0] as ReactElement).props.children[0];
  const content = planContent.slice(1, -2);
  const highlightsBlock = planContent.at(-1);
  const isCustomPlan = planConfig.id === CUSTOM_PLAN_ID;

  /** Get custom plan special properties */
  let planName;
  let description;
  let demoLink;
  if (isCustomPlan) {
    planName = (content[0] as ReactElement).props.children[0];
    description = content[1];
    demoLink = planConfig.actions?.find((action) => action.name === 'contact_sales')
      ?.params.link;
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
      <div className={s.subscribeButtonsWrapper}>
        <a
          className={s.linkAsButton}
          href={salesLink}
          target="_blank"
          rel="noreferrer"
          aria-label={i18n.t('subscription.request_trial_button')}
        >
          {i18n.t('subscription.request_trial_button')}
        </a>
        {!currentSubscription && (
          <PayPalButtonsGroup
            billingPlanId={paypalPlanId}
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
        )}
      </div>
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

  const unauthorizedButtons = (
    <>
      <Button className={clsx(s.paymentPlanButton)} onClick={onUnauthorizedUserClick}>
        {i18n.t('subscription.unauthorized_button')}
      </Button>
      {salesLink && (
        <a
          className={s.linkAsButton}
          href={salesLink}
          target="_blank"
          rel="noreferrer"
          aria-label={i18n.t('subscription.request_trial_button')}
        >
          {i18n.t('subscription.request_trial_button')}
        </a>
      )}
    </>
  );

  const customButtons = (
    <>
      {isChatButtonVisible && (
        <Button className={clsx(s.paymentPlanButton)} onClick={openIntercomChat}>
          {i18n.t('subscription.sales_button')}
        </Button>
      )}
      {demoLink && (
        <a
          className={s.linkAsButton}
          href={demoLink}
          target="_blank"
          rel="noreferrer"
          aria-label={i18n.t('subscription.book_demo_button')}
        >
          {i18n.t('subscription.book_demo_button')}
        </a>
      )}
    </>
  );

  const buttonsBlock = (
    <div className={s.buttonWrapper}>
      {/* Non-authorized */}
      {!isUserAuthorized && !isCustomPlan && unauthorizedButtons}
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
    <div
      className={clsx(s.planCard, {
        [s.custom]: planConfig.style === 'custom',
        [s.premium]: planConfig.style === 'premium',
      })}
    >
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
