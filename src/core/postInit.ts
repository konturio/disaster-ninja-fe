import { useAtom } from '@reatom/react';
import { useEffect } from 'react';
import { appConfig } from '~core/app_config';
import { initMetricsOnce } from '~core/metrics';
import { currentRouteAtom } from '~core/router/atoms/currentRoute';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
import type { AppFeatureType } from '~core/auth/types';

// Temporary solution till we refactor init and move it to proper place
// current goal is to isolate all that init tasks in one place
export function PostInit() {
  const [route] = useAtom(currentRouteAtom);
  const [featureFlags] = useAtom(featureFlagsAtom);

  useEffect(() => {
    if (route) {
      // at this point must be ready: appconfig, i18n, appId, current route
      // TODO: use better approach for getEffectiveFeature from #13368
      const getEffectiveFeature = (f: AppFeatureType) => featureFlags[f];
      initMetricsOnce(appConfig.id, route?.slug, getEffectiveFeature);
    }
  }, [route, featureFlags]);

  return null;
}
