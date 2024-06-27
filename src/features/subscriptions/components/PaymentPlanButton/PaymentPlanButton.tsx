import { Button } from '@konturio/ui-kit';
import React from 'react';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import s from './PaymentPlanButton.module.css';
import type { CurrentSubscription } from '~core/api/subscription';
import type { PaymentPlan } from '~features/subscriptions/types';

export type PaymentPlanButtonProps = {
  plan: PaymentPlan;
  isUserAuthorized: boolean;
  onUnauthorizedUserClick: () => void;
  currentSubscription: CurrentSubscription | null;
  style: string;
};

function PaymentPlanButton({
  plan,
  isUserAuthorized,
  onUnauthorizedUserClick,
  currentSubscription,
  style,
}: PaymentPlanButtonProps) {
  if (!isUserAuthorized) {
    return (
      <Button
        className={clsx(s.paymentPlanButton, style)}
        onClick={onUnauthorizedUserClick}
      >
        {i18n.t('subscription.unauthorized_button')}
      </Button>
    );
  }
  if (plan.id === currentSubscription?.id) {
    return <Button disabled>{i18n.t('subscription.current_plan_button')}</Button>;
  }
  return <Button className={s.authorizeButton}>Subscribe</Button>;
}

export default PaymentPlanButton;
