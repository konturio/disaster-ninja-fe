import { appConfig } from '~core/app_config';
import { currentUserAtom } from '~core/shared_state';
import { yandexMetrics } from '~core/metrics';
import { setFeatures } from './features';
import type { UserProfileApi } from './user';

export async function onLogin() {
  if (appConfig.user) {
    externalLoginTasks(appConfig.user);
    currentUserAtom.setUser.dispatch({ ...appConfig.user });
  }
  setFeatures(appConfig.effectiveFeatures);
}

function externalLoginTasks(user: UserProfileApi) {
  // now when intercom is a feature it can be saved in window after this check happens
  if (window['Intercom']) {
    window['Intercom']('update', {
      name: user.username,
      email: user.email,
    });
  }
  // in case we do have intercom - lets store right credentials for when it will be ready
  appConfig.intercom.name = user.username;
  appConfig.intercom['email'] = user.email;
  yandexMetrics.mark('setUserID', user.email);
}
