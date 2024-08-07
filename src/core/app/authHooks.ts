import { configRepo } from '~core/config';
import { yandexMetrics } from '~core/metrics';
import type { UserDto } from './user';

export async function onLogin() {
  const config = configRepo.get();
  if (config.user) {
    externalLoginTasks(config.user);
  }
}

function externalLoginTasks(user: UserDto) {
  const { username, email } = user;
  // now when intercom is a feature it can be saved in window after this check happens
  if (window['Intercom']) {
    window['Intercom']('update', {
      name: username,
      email: email,
    });
  }
  // in case we do have intercom - lets store right credentials for when it will be ready
  configRepo.updateIntercomSettings({
    name: username,
    email: email,
  });

  yandexMetrics.mark('setUserID', user.email);
}
