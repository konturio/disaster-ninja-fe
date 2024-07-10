import { configRepo } from '~core/config';
import { initMetricsOnce } from '~core/metrics';

// Temporary solution till we refactor init and move it to proper place
// current goal is to isolate all that init tasks in one place
export function postInit(routeId: string) {
  initMetricsOnce(configRepo.get().id, routeId);
  return null;
}
