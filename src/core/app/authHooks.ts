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
  const { email, fullName, phone } = user;
  // in case we do have intercom - lets store right credentials for when it will be ready
  configRepo.updateIntercomSettings({
    name: fullName,
    email: email,
    ...(phone && { phone }),
  });

  yandexMetrics.mark('setUserID', user.email);
}
