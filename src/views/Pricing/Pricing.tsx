import React, { useCallback, useEffect, useState } from 'react';
import { Heading, Toggler } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useAtom } from '@reatom/react-v2';
import { CURRENT_SUBSCRIPTION_INFO, MOCK_PRICING_CONFIG } from '~views/Pricing/mock';
import PaymentPlan from '~features/subscriptions/components/PaymentPlan/PaymentPlan';
import { i18n } from '~core/localization';
import { BillingCycleID } from '~features/subscriptions/types';
import { FeatureFlag, featureFlagsAtom } from '~core/shared_state';
import { getCurrentUserSubscription } from '~core/api/subscription';
import { configRepo } from '~core/config';
import s from './Pricing.module.css';
import type { SubscriptionsConfig } from '~views/Pricing/types';
import type { CurrentSubscription } from '~features/subscriptions/types';

const togglerInitialValue = BillingCycleID.Annually;

export function PricingPage() {
  const config = configRepo.get().features[
    FeatureFlag.SUBSCRIPTION
  ] as SubscriptionsConfig;
  const [subscriptionData, setSubscriptionData] = useState<CurrentSubscription>(null);

  const [currentBillingCycleID, setCurrentBillingCycleID] =
    useState<BillingCycleID>(togglerInitialValue);

  const [monthlyPlanConfig, annuallyPlanConfig] = config.billingCyclesDetails;

  const onTogglerChange = useCallback(() => {
    setCurrentBillingCycleID((prev) =>
      prev === BillingCycleID.Monthly ? BillingCycleID.Annually : BillingCycleID.Monthly,
    );
  }, []);

  useEffect(() => {
    async function fetchSubscriptionData() {
      const data = await getCurrentUserSubscription();
      setSubscriptionData(CURRENT_SUBSCRIPTION_INFO);
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
            id={`${monthlyPlanConfig}-${annuallyPlanConfig.id}`}
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
