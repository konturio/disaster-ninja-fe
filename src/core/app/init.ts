import mapLibre from 'maplibre-gl';
import { appConfig, updateAppConfig } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import { urlEncoder, urlStoreAtom } from '~core/url_store';
import { authClientInstance } from '~core/authClientInstance';
import { currentApplicationAtom } from '~core/shared_state';
import { onLogin, onLogout, onPublicLogin } from './authHooks';
import { runAtom } from './index';
import type { UrlData } from '~core/url_store';
import type { AppInfoResponse } from '~core/app/types';

export async function appInit() {
  // keep initial url before overwriting by router
  localStorage.setItem('initialUrl', location.href);

  // TODO: start map in center
  mapLibre.prewarm();

  const initialState = urlEncoder.decode<UrlData>(document.location.search.slice(1));

  // Stage - 1
  // get application ID from URL or API
  // load custom app config from api
  const appId = initialState.app || (await apiClient.get<string>('/apps/default_id'));
  if (!appId) {
    // cannot continue without appId
    throw new Error('Error getting application ID');
  }
  initialState.app = appId;

  const appInfo = await apiClient.get<AppInfoResponse>(
    `/apps/${appId}`,
    undefined,
    false,
  );

  if (!appInfo) {
    // cannot continue without custom app config
    throw new Error('Error getting application config');
  }

  updateAppConfig(appInfo);

  // FIXME: refactor remove currentApplicationAtom dependency in other atoms
  currentApplicationAtom.set.dispatch(initialState.app);

  postAppInit(initialState);
}

async function postAppInit(initialState: UrlData) {
  if (initialState.layers === undefined) {
    initialState.layers = await getDefaultLayers();
  }

  authClientInstance.publicLoginHooks.push(onPublicLogin);
  authClientInstance.loginHooks.push(onLogin);
  authClientInstance.logoutHooks.push(onLogout);
  authClientInstance.checkAuth();

  urlStoreAtom.init.dispatch(initialState);
  runAtom(urlStoreAtom);
}

async function getDefaultLayers() {
  // FIXME: get default layers from Layers API when it will be supported, ask A.Zapasnik
  if (appConfig.layersByDefault) {
    return appConfig.layersByDefault;
  } else {
    const layers = await apiClient.get<{ id: string }[] | null>(
      `/apps/${appConfig.id}/layers/`,
      undefined,
      false,
    );
    return layers?.map((l) => l.id) ?? [];
  }
}
