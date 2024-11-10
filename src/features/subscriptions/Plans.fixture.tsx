import { useFixtureSelect } from 'react-cosmos/client';
import { compiler } from 'markdown-to-jsx';
import { Button } from '@konturio/ui-kit';
import clsx from 'clsx';
import { MarkdownLink, MarkdownMedia, splitIntoSections } from '~core/pages';
import PaymentPlanCardFooter from './components/PaymentPlanCardFooter/PaymentPlanCardFooter';
import { Price } from './components/Price/Price';
import s from './components/PaymentPlanCard/PaymentPlanCard.module.css';
import ss from './components/PricingContent/PricingContent.module.css';
// __mocks__
import { config as _subscriptionsConfig } from './__mocks__/_subscriptionsConfig';
import _plans from './__mocks__/_plans.md?raw';
import type { BillingCycle } from './types';

const css = `
.premium > .${s.planName}::before {
  content: '★';
  font-size: larger;
  padding-right: 4px;
}

.${s.planName} {
  font-family: var(--font-family);
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
}

.${ss.pricingWrap} {
  & ul {
    list-style-type: none;
    padding-left: 0;
    & li::before {
      content: "✔";
      display: inline-block;
      margin-right: var(--double-unit);
      color: var(--strong-color);
    }
  }
}
`;

export default {
  Plans: <Plans markdown={_plans} styling={css} isUserAuthorized={false} />,
};

function Plans({ styling = '', markdown = _plans, isUserAuthorized = false }) {
  const [currentBillingCycleId] = useFixtureSelect('buttonType', {
    options: ['month', 'year'],
  });
  const currentSubscription = {
    id: '1',
    billingPlanId: '1',
    billingSubscriptionId: '1',
  };

  const compiled = compiler(markdown, {
    overrides: {
      a: MarkdownLink,
      img: MarkdownMedia,
    },
    wrapper: null,
  }) as unknown as JSX.Element[];

  console.warn(compiled);

  const structured = splitIntoSections(compiled);

  console.warn(structured);

  return (
    <div className={ss.pricingWrap}>
      <style>{styling}</style>
      <div className={ss.pricingPlans}>
        <div className={ss.plans}>
          {_subscriptionsConfig.plans.map((plan, index) => {
            const planContent = structured[index];
            // @ts-expect-error ...
            const planName = planContent.shift()?.props.children[0];

            const highlightsBlock = planContent.pop(); // last element

            const injectBlock = planContent.pop(); // not used, it's placeholder for buttons

            // remaining planContent elements are actually plan description

            const isCustom = !plan.billingCycles; // no pricing

            const styleClass = plan.style;

            const billingOption = plan.billingCycles?.find(
              (option) => option.id === currentBillingCycleId,
            );

            const actionsBlock = (
              <div className={s.buttonWrapper}>
                {!isUserAuthorized && (
                  <Button className={clsx(s.paymentPlanButton, styleClass)}>
                    Sign in to subscribe
                  </Button>
                )}
                {isUserAuthorized && <div>[PAYPAL BUTTONS INJECTED HERE]</div>}
              </div>
            );

            const priceBlock = !isCustom && (
              <>
                {/* Just hide old price on 'month' to prevent content jumping */}
                {billingOption && (
                  <div
                    className={clsx(s.initialPrice, {
                      [s.hidden]: billingOption.id === 'month',
                    })}
                  >
                    {`$${billingOption?.initialPricePerMonth?.toLocaleString('en-US')} USD`}
                  </div>
                )}
                {billingOption && (
                  <Price className={s.price} amount={billingOption.pricePerMonth} />
                )}
              </>
            );

            const footerBlock = !isCustom && (
              <div className={s.footerWrapper}>
                <PaymentPlanCardFooter
                  // @ts-expect-error ...
                  planConfig={plan}
                  isUserAuthorized={isUserAuthorized}
                  currentSubscription={currentSubscription}
                  billingOption={billingOption as BillingCycle | undefined}
                />
              </div>
            );

            return (
              <div className={clsx(s.planCard, styleClass)} key={plan.id}>
                <div className={s.planName}>{planName}</div>
                {priceBlock}
                {planContent}
                {actionsBlock}
                {highlightsBlock}
                {footerBlock}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
