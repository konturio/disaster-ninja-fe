import { useAtom } from '@reatom/react';
import { useEffect } from 'react';
import { currentApplicationAtom } from '~core/shared_state';
import { initMetricsOnce } from '~core/metrics';
import { languageWatcherAtom } from '~core/auth/atoms/languageWatcher';
import { urlStoreAtom } from '~core/url_store/atoms/urlStore';
import { currentRouteAtom } from './router/atoms/currentRoute';

// Temporary solution till we refactor init and move it to proper place
// current goal is to isolate all that init tasks in one place
export function PostInit() {
  const [appId] = useAtom(currentApplicationAtom);
  const [route] = useAtom(currentRouteAtom);
  const [languageWatcher] = useAtom(languageWatcherAtom);
  const [url] = useAtom(urlStoreAtom);

  useEffect(() => {
    if (appId && route) {
      // at this point must be ready: appconfig, i18n, appId, current route
      initMetricsOnce(appId ?? '', route.slug);
    }
  }, [appId, route]);

  return null;
}
