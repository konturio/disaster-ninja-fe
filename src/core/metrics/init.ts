import { currentApplicationAtom, currentUserAtom } from '~core/shared_state';
import { appMetrics } from '~core/metrics';

export function metricsInit() {
  const user = currentUserAtom.getState();
  const appId = currentApplicationAtom.getState();
  // metrics starts here because now we have true user id and app id
  appMetrics.init(appId ?? '', user?.username ?? null);
}
