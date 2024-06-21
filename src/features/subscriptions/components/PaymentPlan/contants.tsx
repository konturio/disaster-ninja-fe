import React from 'react';
import { FavAdded16 } from '@konturio/default-icons';
import { PaymentPlanStyle } from '~features/subscriptions/types';
import s from './PaymentPlan.module.css';

export const PLAN_STYLING_CONFIG = {
  [PaymentPlanStyle.basic]: {
    className: '',
    icon: null,
  },
  [PaymentPlanStyle.premium]: {
    className: s.premium,
    icon: <FavAdded16 className={s.planIcon} />,
  },
};
