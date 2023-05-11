import { Close24 } from '@konturio/default-icons';
import cn from 'clsx';
import { Suspense, useEffect, useState } from 'react';
import { lazily } from 'react-lazily';
import { localStorage } from '~utils/storage';
import { GREETINGS_DISABLED_LS_KEY } from '~features/bivariate_manager/constants';
import style from './BivariateGreetingsContainer.module.css';

interface BivariateGreetingsContainerProps {
  className?: string;
}

const { BivariateGreetings } = lazily(() => import('./BivariateGreetings'));

export const BivariateGreetingsContainer = ({
  className,
}: BivariateGreetingsContainerProps) => {
  const [isComponentShown, setComponentShown] = useState<boolean>(false);

  useEffect(() => {
    const greetingsDisabled = localStorage.getItem(GREETINGS_DISABLED_LS_KEY);
    if (!greetingsDisabled && !isComponentShown) {
      setComponentShown(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCloseBtnClick = () => {
    setComponentShown(false);
    localStorage.setItem(GREETINGS_DISABLED_LS_KEY, 'true');
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
