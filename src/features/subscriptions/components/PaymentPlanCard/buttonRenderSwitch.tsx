import React from 'react';
import { Button } from '@konturio/ui-kit';
import { type CurrentSubscriptionInfo } from '~features/subscriptions/types';
import { UserStateStatus } from '~core/auth/types';
import s from '~features/subscriptions/components/PaymentPlanCard/PaymentPlanCard.module.css';
import { i18n } from '~core/localization';
import type { Plan } from '~features/subscriptions/types';
import type { UserStateType } from '~core/auth/types';

export const buttonRenderSwitch = (
  plan: Plan,
  userState: UserStateType,
  currentSubscriptionInfo: CurrentSubscriptionInfo,
) => {
  if (userState === UserStateStatus.UNAUTHORIZED) {
    return (
      <Button className={s.subscribeButton}>
        {i18n.t('subscription.unauthorized_button')}
      </Button>
    );
  }
  if (plan.id === currentSubscriptionInfo?.id) {
    return (
      <Button className={s.subscribeButton} disabled>
        {i18n.t('subscription.current_plan_button')}
      </Button>
    );
  } else {
    return <Button className={s.subscribeButton}>Subscribe</Button>;
  }
};
