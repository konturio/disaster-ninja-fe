import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { Heading, Toggler } from '@konturio/ui-kit';
import usePromise from 'react-promise-suspense';
import { compiler } from 'markdown-to-jsx';
import { useAtom } from '@reatom/npm-react';
import { atom } from '@reatom/framework';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import PaymentPlanCard from '~features/subscriptions/components/PaymentPlanCard/PaymentPlanCard';
import { goTo } from '~core/router/goTo';
import { showModal } from '~core/modal';
import { getAsset } from '~core/api/assets';
import { MarkdownLink, MarkdownMedia, splitIntoSections } from '~core/pages';
import { currentUserSubscriptionResource } from '~core/shared_state/currentSubscription';
import SubscriptionSuccessModal from '../SubscriptionSuccessModal/SubscriptionSuccessModal';
import s from './PricingContent.module.css';
import type { SubscriptionsConfig } from '~features/subscriptions/types';

const togglerInitialValue = 'year';

function parsePlans(markdown: string) {
  const compiled = compiler(markdown, {
    overrides: {
      a: MarkdownLink,
      img: MarkdownMedia,
    },
    wrapper: null,
  }) as unknown as JSX.Element[];
  return splitIntoSections(compiled);
}

export function PricingContent({ config }: { config: SubscriptionsConfig }) {
  const user = configRepo.get().user;
  const plansConfigs = config.plans;

  const [currentSubscription] = useAtom(
    user ? currentUserSubscriptionResource.dataAtom : atom(() => null),
  );
  const markdown = usePromise<[], string | null>(() => {
    return getAsset('plans.md').catch((err) => {
      console.error('Error while fetching plans.md:', err);
      return null;
    }) as Promise<string | null>;
  }, []);

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

  if (currentSubscription === undefined) return null; // current subscription is loading
  if (!markdown)
    return (
      <div style={{ margin: 'auto' }}>
        <h2>Error occurred while loading plans</h2>
      </div>
    );
  const plansContent = parsePlans(markdown);

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
          {plansContent.map((planContent, i) => (
            <PaymentPlanCard
              planConfig={plansConfigs[i]}
              planContent={planContent} // Order of configs in configuration should match order of plans in asset!
              key={plansConfigs[i].id}
              currentBillingCycleId={currentBillingCycleID}
              currentSubscription={currentSubscription}
              isUserAuthorized={!!user}
              onUnauthorizedUserClick={onUnauthorizedUserClick}
              onNewSubscriptionApproved={onNewSubscriptionApproved}
              salesLink={config.salesLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
