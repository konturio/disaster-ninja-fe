import React from 'react';
import { FavAdded16 } from '@konturio/default-icons';
import s from './PaymentPlan.module.css';

export const PLAN_STYLING_CONFIG = {
  basic: {
    className: '',
    icon: null,
  },
  premium: {
    className: s.premium,
    icon: <FavAdded16 className={s.planIcon} />,
  },
};
