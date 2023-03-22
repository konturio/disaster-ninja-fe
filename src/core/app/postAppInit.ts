import { authClientInstance } from '~core/authClientInstance';
import { urlStoreAtom } from '~core/url_store';
import { onLogin } from './authHooks';
import { runAtom } from './index';
import type { UrlData } from '~core/url_store';

export async function postAppInit(initialState: UrlData) {
  authClientInstance.loginHook = onLogin.bind(authClientInstance);
  authClientInstance.checkAuth();

  urlStoreAtom.init.dispatch(initialState);
  runAtom(urlStoreAtom);
}
