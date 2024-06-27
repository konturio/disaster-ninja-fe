import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { Heading, Toggler } from '@konturio/ui-kit';
import { configRepo } from '~core/config';
import { FeatureFlag } from '~core/shared_state';
import { i18n } from '~core/localization';
import { getCurrentUserSubscription } from '~core/api/subscription';
import { isSubscriptionLoadedAtom } from '~views/Pricing/atoms/currentSubscription';
import PaymentPlan from '~features/subscriptions/components/PaymentPlan/PaymentPlan';
import s from './PricingContent.module.css';
import type { SubscriptionsConfig } from '~views/Pricing/types';
import type { CurrentSubscription } from '~core/api/subscription';

const togglerInitialValue = 'year';

export function PricingContent() {
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
              currentSubscription={subscriptionData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
