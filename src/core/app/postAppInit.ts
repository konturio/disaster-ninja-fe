import { urlStoreAtom } from '~core/url_store';
import { persistEnabledLayers, loadEnabledLayers } from '~core/panels_state';
import { onLogin } from './authHooks';
import { runAtom } from './index';
import type { Config } from '~core/config/types';

export async function postAppInit(config: Config) {
  onLogin();
  const storedLayers = loadEnabledLayers();
  urlStoreAtom.init.dispatch({
    ...config.initialUrlData,
    layers: storedLayers ?? config.activeLayers,
  });
  persistEnabledLayers();
  runAtom(urlStoreAtom);
}
