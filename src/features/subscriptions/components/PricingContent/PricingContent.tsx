import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { Heading, Toggler } from '@konturio/ui-kit';
import usePromise from 'react-promise-suspense';
import { configRepo } from '~core/config';
import { FeatureFlag } from '~core/shared_state';
import { i18n } from '~core/localization';
import { getCurrentUserSubscription } from '~core/api/subscription';
import PaymentPlanCard from '~features/subscriptions/components/PaymentPlanCard/PaymentPlanCard';
import { goTo } from '~core/router/goTo';
import { showModal } from '~core/modal';
import SubscriptionSuccessModal from '../SubscriptionSuccessModal/SubscriptionSuccessModal';
import s from './PricingContent.module.css';
import type { SubscriptionsConfig } from '~features/subscriptions/types';

const togglerInitialValue = 'year';

export function PricingContent() {
  const user = configRepo.get().user;
  const currentSubscription = usePromise(() => {
    if (!user) {
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

  const onUnauthorizedUserClick = useCallback(() => goTo('/profile'), []);

  const onNewSubscriptionApproved = useCallback(() => {
    showModal(SubscriptionSuccessModal).then(() => location.reload());
  }, []);

  useEffect(() => {
    // after the page is loaded, set toggle to monthly/annually depending on current subscription
    if (currentSubscription?.id) {
      const currentPlan = config.plans.find(
        (plan) => plan.id === currentSubscription?.id,
      );
      currentPlan?.billingCycles?.forEach((cycle) => {
        if (
          cycle.billingMethods.find(
            (billingMethod) =>
              billingMethod.billingPlanId === currentSubscription.billingPlanId,
          )
        ) {
          setCurrentBillingCycleID(cycle.id);
          return;
        }
      });
    }
  }, [config.plans, currentSubscription]);

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
