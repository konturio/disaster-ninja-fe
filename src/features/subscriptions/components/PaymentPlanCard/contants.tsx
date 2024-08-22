import React from 'react';
import { FavAdded16 } from '@konturio/default-icons';
import s from './PaymentPlanCard.module.css';

export const PLANS_STYLE_CONFIG = {
  basic: {
    className: '', // Uses default styles
    icon: () => null,
  },
  premium: {
    className: 'premium',
    icon: () => null,
  },
  custom: {
    className: 'custom',
    icon: () => <FavAdded16 className={s.planIcon} />,
  },
};
