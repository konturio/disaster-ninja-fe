import React from 'react';
import clsx from 'clsx';
import s from './Price.module.css';

export function Price({ amount, className }) {
  return (
    <div className={clsx(s.priceWrap, className)}>
      <div className={s.dollarSign}>$</div>
      <div className={s.amount}>{amount}</div>
      <div className={s.perMonth}>/mo*</div>
    </div>
  );
}
