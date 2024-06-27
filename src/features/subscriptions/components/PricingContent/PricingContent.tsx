import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { Heading, Toggler } from '@konturio/ui-kit';
import usePromise from 'react-promise-suspense';
import { configRepo } from '~core/config';
import { FeatureFlag } from '~core/shared_state';
import { i18n } from '~core/localization';
import { getCurrentUserSubscription } from '~core/api/subscription';
import PaymentPlanCard from '~features/subscriptions/components/PaymentPlanCard/PaymentPlanCard';
import s from './PricingContent.module.css';
import type { SubscriptionsConfig } from '~features/subscriptions/types';

const togglerInitialValue = 'year';

export function PricingContent() {
  const currentSubscription = usePromise(() => {
    if (!configRepo.get().user) {
      return Promise.resolve(null);
    }
    return getCurrentUserSubscription();
  }, []);

  const config = configRepo.get().features[
    FeatureFlag.SUBSCRIPTION
  ] as SubscriptionsConfig;

  const [currentBillingCycleID, setCurrentBillingCycleID] = useState<'month' | 'year'>(
    togglerInitialValue,
  );

  const [monthlyPlanConfig, annuallyPlanConfig] = config.billingCyclesDetails;

  const onTogglerChange = useCallback(() => {
    setCurrentBillingCycleID((prev) => (prev === 'month' ? 'year' : 'month'));
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
            <PaymentPlanCard
              plan={plan}
              key={plan.id}
              currentBillingCycleId={currentBillingCycleID}
              currentSubscription={currentSubscription}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
