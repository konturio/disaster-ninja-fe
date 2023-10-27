import { localStorage } from '~utils/storage';
import { updateAppConfig, updateAppConfigOverrides } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import { urlEncoder } from '~core/url_store/encoder';
import { i18n } from '~core/localization';
import {
  findBasemapInLayersList,
  getBasemapFromDetails,
} from '~core/logical_layers/basemap';
import { persistLog } from 'logger';
import { defaultUserProfileData } from './user';
import type { LayerDetailsDto } from '~core/logical_layers/types/source';
import type { UrlData } from '~core/url_store';
import type { AppDto } from '~core/app/types';

export async function appInit() {
  // keep initial url before overwriting by router
  localStorage.setItem('initialUrl', location.href);

  const initialState = urlEncoder.decode<UrlData>(document.location.search.slice(1));

  apiClient.checkLocalAuthToken();

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

  updateAppConfig(appConfigResponse);

  const language = appConfigResponse.user.language;
  setAppLanguage(language);

  const defaultLayers = await getDefaultLayers(initialState.app, language);

  // default basemap
  const { basemapLayerId, basemapLayerUrl } = getBasemapFromDetails(defaultLayers);

  let effectiveBasemapUrl: any = basemapLayerUrl;

  if (initialState.layers === undefined) {
    initialState.layers = defaultLayers?.map((l) => l.id) ?? [];
  } else {
    // HACK: Remove KLA__ prefix from layers ids coming from url
    initialState.layers = initialState.layers.map((l) => l.replace(/^KLA__/, ''));

    const basemapInUrl = findBasemapInLayersList(initialState.layers);

    if (!basemapInUrl) {
      // if basemap is not listed in url - add default basemap layer
      initialState.layers.push(basemapLayerId);
    } else {
      if (basemapInUrl !== basemapLayerId) {
        // non-default basemap in url
        // need layer details to get map style url
        const basemapInUrlDetails = await getLayersDetails(
          [basemapInUrl],
          initialState.app,
          language,
        );
        effectiveBasemapUrl = basemapInUrlDetails[0]?.source?.urls?.at(0);
      }
    }
  }

  updateAppConfigOverrides({
    defaultLayers,
    mapBaseStyle: effectiveBasemapUrl,
  });

  return initialState;
}

async function getDefaultLayers(appId: string, language: string) {
  const layers = await apiClient.get<LayerDetailsDto[]>(
    `/apps/${appId}/layers`,
    undefined,
    true,
    { headers: { 'user-language': language } },
  );

  try {
    const ids = layers?.map((l) => l.id);
  } catch (e) {
    const error = e as Error;
    const message = `
${error.name}
${error.message}
----
${`/apps/${appId}/layers`}
layers: ${JSON.stringify(layers, null, 2)}
`;
    persistLog(message, error.stack);
    return [];
  }

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
