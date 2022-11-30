import { currentApplicationAtom, currentUserAtom } from '~core/shared_state';
import { appMetrics } from '~core/metrics';
// FIXME: refactor like metricsInit(appId,user) without using atoms after app init implementation
export function metricsInit() {
  const user = currentUserAtom.getState();
  const appId = currentApplicationAtom.getState();
  // metrics starts here because now we have true user id and app id
  appMetrics.init(appId ?? '', user?.email ?? null);
}
