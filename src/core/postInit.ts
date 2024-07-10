import { configRepo } from '~core/config';
import { initMetricsOnce } from '~core/metrics';
import type { AppFeatureType } from '~core/auth/types';

// Temporary solution till we refactor init and move it to proper place
// current goal is to isolate all that init tasks in one place
export function PostInit(routeId: string) {
  const getEffectiveFeature = (f: AppFeatureType) => !!configRepo.get().features[f];
  initMetricsOnce(configRepo.get().id, routeId, getEffectiveFeature);
  return null;
}
