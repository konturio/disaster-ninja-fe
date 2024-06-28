import { authClientInstance } from '~core/authClientInstance';
import { urlStoreAtom } from '~core/url_store';
import { autoClearAtom } from '~core/logical_layers';
import { onLogin } from './authHooks';
import { runAtom } from './index';
import type { Config } from '~core/config/types';

export async function postAppInit(config: Config) {
  authClientInstance.loginHook = onLogin.bind(authClientInstance);
  const isAuthenticated = authClientInstance.checkAuth();
  // It's required to refresh auth tokens to get the fresh roles data from keycloak
  if (isAuthenticated) await authClientInstance.refreshAuth();
  urlStoreAtom.init.dispatch({
    ...config.initialUrl,
    layers: config.activeLayers,
  });
  runAtom(urlStoreAtom);

  // init LogicalLayers
  runAtom(autoClearAtom);
}
