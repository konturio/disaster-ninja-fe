import { Close24 } from '@konturio/default-icons';
import cn from 'clsx';
import { Suspense, useEffect, useState } from 'react';
import { lazily } from 'react-lazily';
import { GREETINGS_DISABLED_COOKIE } from '~features/bivariate_manager/constants';
import style from './BivariateGreetingsContainer.module.css';

interface BivariateGreetingsContainerProps {
  className?: string;
}

function getCookie(name: string) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const { BivariateGreetings } = lazily(() => import('./BivariateGreetings'));

export const BivariateGreetingsContainer = ({
  className,
}: BivariateGreetingsContainerProps) => {
  const [isComponentShown, setComponentShown] = useState<boolean>(false);

  useEffect(() => {
    const disabledCookie = getCookie(GREETINGS_DISABLED_COOKIE);
    if (!disabledCookie && !isComponentShown) {
      setComponentShown(true);
    }
  });

  const onCloseBtnClick = () => {
    setComponentShown(false);
    document.cookie = `${GREETINGS_DISABLED_COOKIE}=true; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  };

  return isComponentShown ? (
    <div className={cn(className, style.container)}>
      <Suspense fallback={null}>
        <BivariateGreetings />
      </Suspense>
      <div onClick={onCloseBtnClick} className={style.closeButton}>
        <Close24 />
      </div>
    </div>
  ) : null;
};
