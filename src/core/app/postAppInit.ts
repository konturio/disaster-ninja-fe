import { urlStoreAtom } from '~core/url_store';
import { onLogin } from './authHooks';
import { runAtom } from './index';
import type { Config } from '~core/config/types';

export async function postAppInit(config: Config) {
  onLogin();
  urlStoreAtom.init.dispatch({
    ...config.initialUrlData,
    layers: config.activeLayers,
  });
  runAtom(urlStoreAtom);
}
