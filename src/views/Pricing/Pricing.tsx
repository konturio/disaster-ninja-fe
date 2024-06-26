import React, { useCallback, useEffect, useState } from 'react';
import { Heading, Toggler } from '@konturio/ui-kit';
import clsx from 'clsx';
import PaymentPlan from '~features/subscriptions/components/PaymentPlan/PaymentPlan';
import { i18n } from '~core/localization';
import { FeatureFlag } from '~core/shared_state';
import { getCurrentUserSubscription } from '~core/api/subscription';
import { configRepo } from '~core/config';
import { isSubscriptionLoadedAtom } from '~views/Pricing/atoms/currentSubscription';
import s from './Pricing.module.css';
import type { SubscriptionsConfig } from '~views/Pricing/types';
import type { CurrentSubscription } from '~features/subscriptions/types';

const togglerInitialValue = 'year';

export function PricingPage() {
  const config = configRepo.get().features[
    FeatureFlag.SUBSCRIPTION
  ] as SubscriptionsConfig;
  const [subscriptionData, setSubscriptionData] = useState<CurrentSubscription | null>(
    null,
  );

  const [currentBillingCycleID, setCurrentBillingCycleID] = useState<'month' | 'year'>(
    togglerInitialValue,
  );

  const [monthlyPlanConfig, annuallyPlanConfig] = config.billingCyclesDetails;

  const onTogglerChange = useCallback(() => {
    setCurrentBillingCycleID((prev) => (prev === 'month' ? 'year' : 'month'));
  }, []);

  useEffect(() => {
    async function fetchSubscriptionData() {
      try {
        const data = await getCurrentUserSubscription();
        setSubscriptionData(data);
        isSubscriptionLoadedAtom.setTrue.dispatch();
      } catch (error) {
        console.error('Failed to fetch subscription data:', error);
      }
    }

    fetchSubscriptionData();
  }, []);

  return (
    <div className={s.pricingWrap}>
      <div className={s.pricingPlans}>
        <Heading type="heading-02">{i18n.t('subscription.title')}</Heading>
        <div
          className={clsx(s.togglerSwitch, {
            [s.withOffLabel]: monthlyPlanConfig.note,
          })}
        >
          {monthlyPlanConfig.note && (
            <div className={s.note}>{monthlyPlanConfig.note}</div>
          )}
          <Toggler
            label={annuallyPlanConfig.name}
            offValueLabel={monthlyPlanConfig.name}
            id="paymentPeriodToggler"
            on={currentBillingCycleID === togglerInitialValue}
            classes={{
              label: s.togglerLabel,
              activeLabel: s.active,
            }}
            onChange={onTogglerChange}
          />
          {annuallyPlanConfig.note && (
            <div className={s.note}>{annuallyPlanConfig.note}</div>
          )}
        </div>
        <div className={s.plans}>
          {config.plans.map((plan) => (
            <PaymentPlan
              plan={plan}
              key={plan.id}
              currentBillingCycleId={currentBillingCycleID}
              currentSubscriptionInfo={subscriptionData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}