import React, { useCallback, useEffect, useState } from 'react';
import { Heading, Toggler } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useAtom } from '@reatom/react-v2';
import { CURRENT_SUBSCRIPTION_INFO, MOCK_PRICING_CONFIG } from '~views/Pricing/mock';
import PaymentPlan from '~features/subscriptions/components/PaymentPlanCard/PaymentPlan';
import { i18n } from '~core/localization';
import { BillingCycleID } from '~features/subscriptions/types';
import { FeatureFlag, featureFlagsAtom } from '~core/shared_state';
import { getCurrentUserSubscription } from '~core/api/subscription';
import s from './Pricing.module.css';
import type { PricingConfig } from '~views/Pricing/types';
import type { CurrentSubscriptionInfo } from '~features/subscriptions/types';

const togglerInitialValue = BillingCycleID.Annually;

export function PricingPage() {
  const [featureFlags] = useAtom(featureFlagsAtom);
  const config: PricingConfig =
    featureFlags[FeatureFlag.SUBSCRIPTION]?.configuration || MOCK_PRICING_CONFIG;

  const [subscriptionData, setSubscriptionData] = useState<CurrentSubscriptionInfo>(null);

  const [currentBillingCycleID, setCurrentBillingCycleID] =
    useState<BillingCycleID>(togglerInitialValue);

  const [offTogglerConfig, onTogglerConfig] = config.billingCyclesDetails;

  const onTogglerChange = useCallback(() => {
    setCurrentBillingCycleID((prev) =>
      prev === BillingCycleID.Monthly ? BillingCycleID.Annually : BillingCycleID.Monthly,
    );
  }, []);

  useEffect(() => {
    async function fetchSubscriptionData() {
      const data = await getCurrentUserSubscription();
      setSubscriptionData(data || CURRENT_SUBSCRIPTION_INFO);
    }

    setTimeout(() => {
      fetchSubscriptionData();
    }, 3000);
  }, []);

  return (
    <div className={s.pricingWrap}>
      <div className={s.pricingPlans}>
        <Heading type="heading-02">{i18n.t('subscription.title')}</Heading>
        <div
          className={clsx(s.togglerSwitch, { [s.twoDirectional]: offTogglerConfig.note })}
        >
          {offTogglerConfig.note && <div className={s.note}>{offTogglerConfig.note}</div>}
          <Toggler
            label={onTogglerConfig.name}
            offValueLabel={offTogglerConfig.name}
            id={`${offTogglerConfig}-${onTogglerConfig.id}`}
            on={currentBillingCycleID === togglerInitialValue}
            classes={{
              label: s.togglerLabel,
              activeLabel: s.active,
            }}
            onChange={onTogglerChange}
          ></Toggler>
          {onTogglerConfig.note && <div className={s.note}>{onTogglerConfig.note}</div>}
        </div>
        <div className={s.plans}>
          {config.plans.map((plan) => (
            <PaymentPlan
              plan={plan}
              key={plan.id}
              currentBillingCycleId={currentBillingCycleID}
              currentSubscriptionInfo={subscriptionData}
            ></PaymentPlan>
          ))}
        </div>
      </div>
    </div>
  );
}
