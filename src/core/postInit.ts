import { useAtom } from '@reatom/react';
import { useEffect } from 'react';
import once from 'lodash/once';
import { currentApplicationAtom } from '~core/shared_state';
import { appMetrics } from '~core/metrics';
import { languageWatcherAtom } from '~core/auth/atoms/languageWatcher';
import { urlStoreAtom } from '~core/url_store/atoms/urlStore';
import { currentRouteAtom } from '~core/router/atoms/currentRoute';
import { userResourceAtom } from '~core/auth';
import type { AppFeatureType } from '~core/auth/types';

const initMetricsOnce = once(appMetrics.init.bind(appMetrics));

// Temporary solution till we refactor init and move it to proper place
// current goal is to isolate all that init tasks in one place
export function PostInit() {
  const [appId] = useAtom(currentApplicationAtom);
  const [route] = useAtom(currentRouteAtom);
  const [languageWatcher] = useAtom(languageWatcherAtom);
  const [url] = useAtom(urlStoreAtom);
  const [{ data, loading }] = useAtom(userResourceAtom);
  const userModel = data && !loading ? data : null;

  useEffect(() => {
    if (appId && route && userModel) {
      // at this point must be ready: appconfig, i18n, appId, current route

      // TODO: use better approach for getEffectiveFeature from #13368
      const getEffectiveFeature = (f: AppFeatureType) => userModel.hasFeature(f);

      initMetricsOnce(appId ?? '', route?.slug, getEffectiveFeature);
    }
  }, [appId, route, userModel]);

  return null;
}
