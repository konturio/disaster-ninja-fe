import React from 'react';
import { Button, Heading, Text } from '@konturio/ui-kit';
import { Finish24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import clsx from 'clsx';
import { Price } from '~features/subscriptions/components/Price/Price';
import { userStateAtom } from '~core/auth';
import { UserStateStatus } from '~core/auth/types';
import s from './PaymentPlanCard.module.css';

export enum PaymentPlanType {
  Educational = 'Educational',
  Professional = 'Professional',
}

export type PaymentPlan = {
  type: PaymentPlanType;
  description: string;
  oldPrice: number;
  price: number;
  planFeatures: string[];
  priceSummary: string;
};

export type PaymentPlanProps = {
  plan: PaymentPlan;
};

function PaymentPlan({ plan }: PaymentPlanProps) {
  const [userState] = useAtom(userStateAtom);

  return (
    <div
      className={clsx(
        s.planCard,
        plan.type === PaymentPlanType.Professional ? s.professional : '',
      )}
    >
      <div className={s.planType}>
        <Heading type="heading-04" margins={false}>
          {plan.type}
        </Heading>
      </div>
      <div className={s.oldPrice}>
        <span>${plan.oldPrice}</span>
      </div>
      <Price className={s.currentPrice} amount={plan.price}></Price>
      <Text className={s.planDescription} type="short-m">
        {plan.description}
      </Text>
      <div>
        {userState === UserStateStatus.AUTHORIZED ? (
          <Button className={s.subscribeButton}>Subscribe</Button>
        ) : (
          <Button className={s.subscribeButton}>Sign in to subscribe</Button>
        )}
      </div>
      <ul className={s.planFeatures}>
        {plan.planFeatures.map((feature, index) => (
          <li key={index}>
            <div className={s.feature}>
              <Finish24 className={s.featureIcon}></Finish24>
              <span>{feature}</span>
            </div>
          </li>
        ))}
      </ul>
      <Text type="caption" className={s.priceSummary}>
        {plan.priceSummary}
      </Text>
    </div>
  );
}

export default PaymentPlan;
