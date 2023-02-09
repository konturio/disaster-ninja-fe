// import mapLibre from 'maplibre-gl';
import { updateAppConfig } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import { urlEncoder, urlStoreAtom } from '~core/url_store';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import { loadConfig } from '~core/app_config/loader';
import { onLogin } from './authHooks';
import { defaultUserProfileData } from './user';
import { runAtom } from './index';
import type { UrlData } from '~core/url_store';
import type { AppConfiguration } from '~core/app/types';

export async function appInit() {
  await loadConfig();
  // keep initial url before overwriting by router
  localStorage.setItem('initialUrl', location.href);

  // TODO: start map in center
  // mapLibre.prewarm();

  const initialState = urlEncoder.decode<UrlData>(document.location.search.slice(1));

  authClientInstance.checkLocalAuthToken();

  const appConfigResponse = await apiClient.get<AppConfiguration>(
    '/apps/configuration',
    { appId: initialState.app },
    true,
  );

  if (!appConfigResponse) {
    // cannot continue without custom app config
    throw new Error('Error getting application config');
  }

  // BE returns default appId if it wasn't set in url
  initialState.app = appConfigResponse.id;
  if (!appConfigResponse.user) {
    appConfigResponse.user = defaultUserProfileData;
  }

  setAppLanguage(appConfigResponse.user.language);

  if (initialState.layers === undefined) {
    initialState.layers = await getDefaultLayers(initialState.app);
  } else {
    // HACK: Remove KLA__ prefix from layers ids coming from url
    initialState.layers = initialState.layers.map((l) => l.replace(/^KLA__/, ''));
  }

  updateAppConfig(appConfigResponse);

  postAppInit(initialState);
}

async function postAppInit(initialState: UrlData) {
  authClientInstance.loginHooks.push(onLogin);
  authClientInstance.checkAuth();

  urlStoreAtom.init.dispatch(initialState);
  runAtom(urlStoreAtom);
}

async function getDefaultLayers(appId) {
  const layers = await apiClient.get<{ id: string }[] | null>(
    `/apps/${appId}/layers`,
    undefined,
    true,
  );
  // TODO: use layers source configs to cache layer data
  return layers?.map((l) => l.id) ?? [];
}

function setAppLanguage(language: string) {
  // TODO: set <html lang= dir=
  i18n.instance
    .changeLanguage(language)
    .catch((e) => console.warn(`Attempt to change language to ${language} failed`, e));
}
