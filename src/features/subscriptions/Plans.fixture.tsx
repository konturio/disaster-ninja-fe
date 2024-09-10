import { compiler } from 'markdown-to-jsx';
import { Finish24 } from '@konturio/default-icons';
import { Heading, Button, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useMemo } from 'react';
import { i18n } from '~core/localization';
import { CustomLink, CustomImg } from '~core/pages/hypermedia';
import { structureMarkdownContent } from '~core/pages/compiler';
import { PAYMENT_METHOD_ID_PAYPAL } from './constants';
import PaymentPlanCardFooter from './components/PaymentPlanCardFooter/PaymentPlanCardFooter';
import { Price } from './components/Price/Price';
import { PLANS_STYLE_CONFIG } from './components/PaymentPlanCard/contants';
import s from './components/PaymentPlanCard/PaymentPlanCard.module.css';
import ss from './components/PricingContent/PricingContent.module.css';
// __mocks__
import { config as _subscriptionsConfig } from './__mocks__/_subscriptionsConfig';
import _plans from './__mocks__/_plans.md?raw';

export default {
  Plans,
};

const plan = _subscriptionsConfig.plans[0];

function Plans({ styling = '', markdown = _plans, docId = 'plans' }) {
  const compiled = compiler(markdown, {
    overrides: {
      a: CustomLink,
      img: CustomImg,
    },
    wrapper: null,
  }) as unknown as JSX.Element[];

  console.warn(compiled);

  const structured = structureMarkdownContent(compiled);

  console.warn(structured);

  // @ts-expect-error ...
  plan.name = structured[0]?.props?.children[0]?.props?.children[0];

  const styleConfig = PLANS_STYLE_CONFIG[plan.style];
  const isUserAuthorized = false;
  const currentBillingCycleId = 'month';
  const currentSubscription = null;

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

  const controls = (
    <div className={s.buttonWrapper}>
      {/* Non-authorized */}
      {!isUserAuthorized && (
        <Button
          className={clsx(s.paymentPlanButton, styleConfig.className)}
          // onClick={onUnauthorizedUserClick}
        >
          {i18n.t('subscription.unauthorized_button')}
        </Button>
      )}
      {/* Authorized */}
      {isUserAuthorized && paypalPlanId && (
        <div>[PAYPAL BUTTONS INJECTED HERE]{paypalPlanId}</div>
      )}
    </div>
  );

  return (
    <>
      <style>{styling}</style>
      <div className={ss.pricingWrap}>
        <div className={ss.pricingPlans}>
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
                className={clsx(s.initialPrice, {
                  [s.hidden]: billingOption.id === 'month',
                })}
              >
                {`$${billingOption?.initialPricePerMonth?.toLocaleString('en-US')} ${i18n.t('currency.usd')}`}
              </div>
            )}
            {billingOption && (
              <Price className={s.price} amount={billingOption.pricePerMonth} />
            )}
            <Text className={s.planDescription} type="short-m">
              {plan.description}
            </Text>
            {/* controls */}
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
        </div>
      </div>
    </>
  );
}
