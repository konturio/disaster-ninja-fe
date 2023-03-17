import { updateAppConfig, updateAppConfigOverrides } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import { urlEncoder, urlStoreAtom } from '~core/url_store';
import { authClientInstance } from '~core/authClientInstance';
import { i18n } from '~core/localization';
import {
  findBasemapInLayersList,
  getBasemapFromDetails,
  MAPBOX_EMPTY_STYLE,
} from '~core/logical_layers/basemap';
import { onLogin } from './authHooks';
import { defaultUserProfileData } from './user';
import { runAtom } from './index';
import type { LayerDetailsDto } from '~core/logical_layers/types/source';
import type { UrlData } from '~core/url_store';
import type { AppDto } from '~core/app/types';

export async function appInit() {
  // keep initial url before overwriting by router
  localStorage.setItem('initialUrl', location.href);

  const initialState = urlEncoder.decode<UrlData>(document.location.search.slice(1));

  authClientInstance.checkLocalAuthToken();

  const appConfigResponse = await apiClient.get<AppDto>(
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

  const language = appConfigResponse.user.language;
  setAppLanguage(language);

  const defaultLayers = await getDefaultLayers(initialState.app, language);

  let effectiveBasemapUrl: any = MAPBOX_EMPTY_STYLE;

  const { basemapLayerId, basemapLayerUrl } = getBasemapFromDetails(defaultLayers);

  if (initialState.layers === undefined) {
    effectiveBasemapUrl = basemapLayerUrl;
    initialState.layers = defaultLayers?.map((l) => l.id) ?? [];
  } else {
    // HACK: Remove KLA__ prefix from layers ids coming from url
    initialState.layers = initialState.layers.map((l) => l.replace(/^KLA__/, ''));

    // Enable app default basemap layer if it's not listed in url
    const basemapInUrl = findBasemapInLayersList(initialState.layers);
    if (!basemapInUrl) {
      initialState.layers.push(basemapLayerId);
    }

    // we have basemap in url and need to fetch layer details to get map style url
    if (basemapInUrl && basemapInUrl !== basemapLayerId) {
      const basemapInUrlDetails = await getLayersDetails(
        [basemapInUrl],
        initialState.app,
        language,
      );
      effectiveBasemapUrl = basemapInUrlDetails[0]?.source?.urls?.at(0);
    }
  }

  updateAppConfig(appConfigResponse);

  updateAppConfigOverrides({
    defaultLayers,
    mapBaseStyle: effectiveBasemapUrl,
  });

  postAppInit(initialState);
}

async function postAppInit(initialState: UrlData) {
  authClientInstance.loginHook = onLogin.bind(authClientInstance);
  authClientInstance.checkAuth();

  urlStoreAtom.init.dispatch(initialState);
  runAtom(urlStoreAtom);
}

async function getDefaultLayers(appId: string, language: string) {
  const layers = await apiClient.get<LayerDetailsDto[]>(
    `/apps/${appId}/layers`,
    undefined,
    true,
    { headers: { 'user-language': language } },
  );
  // TODO: use layers source configs to cache layer data
  return layers ?? [];
}

async function getLayersDetails(ids: string[], appId: string, language: string) {
  const layers = await apiClient.post<LayerDetailsDto[]>(
    `/layers/details`,
    {
      layersToRetrieveWithoutGeometryFilter: ids,
      appId: appId,
    },
    true,
    { headers: { 'user-language': language } },
  );
  // TODO: use layers source configs to cache layer data
  return layers ?? [];
}

function setAppLanguage(language: string) {
  // TODO: set <html lang= dir=
  i18n.instance
    .changeLanguage(language)
    .catch((e) => console.warn(`Attempt to change language to ${language} failed`, e));
}
