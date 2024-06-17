import React, { useCallback, useState } from 'react';
import { Heading, Toggler } from '@konturio/ui-kit';
import PaymentPlan from '~features/subscriptions/components/PaymentPlanCard/PaymentPlan';
import { MockPlans } from '~views/Pricing/mock';
import s from './Pricing.module.css';
export function PricingPage() {
  const [isClicked, setIsClicked] = useState(false);
  const onTogglerChange = useCallback(() => {
    setIsClicked((prev) => !prev);
  }, []);

  return (
    <div className={s.pricingWrap}>
      <div className={s.pricingPlans}>
        <Heading type="heading-02">Plans & Pricing</Heading>
        <div className={s.toggleSwitch}>
          <div>Annually</div>
          <Toggler
            label="Monthly"
            id="test"
            on={isClicked}
            onChange={onTogglerChange}
          ></Toggler>
          <div className={s.discount}>Save 5%</div>
        </div>
        <div className={s.plans}>
          {MockPlans.map((plan, index) => (
            <PaymentPlan plan={plan} key={index}></PaymentPlan>
          ))}
        </div>
      </div>
    </div>
  );
}
