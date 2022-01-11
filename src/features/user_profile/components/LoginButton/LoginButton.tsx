import { Button } from '@k2-packages/ui-kit';
import { translationService } from '~core/index';
import s from './LoginButton.module.css';
import { currentUserAtom } from '~core/auth';
import { useAction, useAtom } from '@reatom/react';

export function LoginButton() {
  const [, userActions] = useAtom(currentUserAtom);
  const onBtnClick = useAction(() => userActions.login());

  return (
    <Button onClick={onBtnClick} className={s.loginButton}>{translationService.t('Sign up or Login')}</Button>
  );
}
