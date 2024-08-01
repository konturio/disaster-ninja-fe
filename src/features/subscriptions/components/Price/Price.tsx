import React from 'react';
import clsx from 'clsx';
import s from './Price.module.css';

export type PriceProps = {
  amount: number;
  className: string;
};

export function Price({ amount, className }: PriceProps) {
  return (
    <div className={clsx(s.priceWrap, className)}>
      <div className={s.dollarSign}>$</div>
      <div className={s.amount}>{amount.toLocaleString('en-US')}</div>
      <div className={s.perMonth}>USD / mo*</div>
    </div>
  );
}
