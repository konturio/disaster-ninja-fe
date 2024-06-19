import React from 'react';
import { FavAdded16 } from '@konturio/default-icons';
import { PlanStyle } from '~features/subscriptions/types';
import s from './PaymentPlanCard.module.css';

export const PLAN_STYLING_CONFIG = {
  [PlanStyle.basic]: {
    className: '',
    icon: null,
  },
  [PlanStyle.premium]: {
    className: s.premium,
    icon: <FavAdded16 className={s.planIcon} />,
  },
};
