import { appConfig } from '~core/app_config';
import { currentUserAtom } from '~core/shared_state';
import { yandexMetrics } from '~core/metrics';
import { setFeatures } from './features';
import type { AuthSuccessResponse } from '~core/auth/client/AuthClient';

export async function onLogin(response?: AuthSuccessResponse) {
  if (response) {
    if (appConfig.user) {
      externalLoginTasks(appConfig.user);
      const mergedUserdata = {
        ...appConfig.user,
        id: response.jwtData.sub,
        token: response.token,
      };
      currentUserAtom.setUser.dispatch(mergedUserdata);
    }
  }
  setFeatures(appConfig.effectiveFeatures);
}

function externalLoginTasks(user) {
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
