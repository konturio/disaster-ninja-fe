import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { Heading, Toggler } from '@konturio/ui-kit';
import usePromise from 'react-promise-suspense';
import { configRepo } from '~core/config';
import { FeatureFlag } from '~core/shared_state';
import { i18n } from '~core/localization';
import {
  getCurrentUserSubscription,
  setCurrentUserSubscription,
} from '~core/api/subscription';
import PaymentPlanCard from '~features/subscriptions/components/PaymentPlanCard/PaymentPlanCard';
import { goTo } from '~core/router/goTo';
import s from './PricingContent.module.css';
import { USE_MOCK_SUBSCRIPTION_CONFIG } from './mockSubscriptionConfig';
import type { SubscriptionsConfig } from '~features/subscriptions/types';
import type { CurrentSubscription } from '~core/api/subscription';

const togglerInitialValue = 'year';

export function PricingContent() {
  const user = configRepo.get().user;
  const currentSubscription = usePromise(() => {
    if (!user) {
      return Promise.resolve(null);
    }
    return getCurrentUserSubscription();
  }, []);
  const [mockCurrentSubscription, setMockCurrentSubscription] =
    useState<CurrentSubscription | null>(null);

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

  const onUnauthorizedUserClick = useCallback(() => goTo('/profile'), []);

  const onNewSubscriptionApproved = useCallback(
    (
      paymentMethodId: string,
      planId: string,
      billingPlanId: string,
      billingSubscriptionId: string,
    ) => {
      if (USE_MOCK_SUBSCRIPTION_CONFIG) {
        setMockCurrentSubscription({ billingPlanId, billingSubscriptionId, id: planId });
      } else {
        setCurrentUserSubscription(billingPlanId, billingSubscriptionId)
          .then((result) => {
            // console.log('setting new subscription success!');
          })
          .catch(() => {
            // console.log('error setting new subscription:', {
            //   paymentMethodId,
            //   billingPlanId,
            //   billingSubscriptionId,
            // });
          });
      }
    },
    [],
  );

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
              currentSubscription={
                USE_MOCK_SUBSCRIPTION_CONFIG
                  ? mockCurrentSubscription
                  : currentSubscription
              }
              isUserAuthorized={!!user}
              onUnauthorizedUserClick={onUnauthorizedUserClick}
              onNewSubscriptionApproved={onNewSubscriptionApproved}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
