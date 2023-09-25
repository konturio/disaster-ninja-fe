import { apiClient, reportsClient } from '~core/apiClientInstance';
import { getStageConfig } from '~core/config/loaders/stageConfigLoader';
import { getAppConfig, getLayerSourceUrl } from '~core/config/loaders/appConfigLoader';
import { readInitialUrl } from '~core/url_store/readInitialUrl';
import { i18n } from '~core/localization';
import configsRepository from '~core/config';
import type { AppConfig } from '~core/config/types';

export async function setupApplicationEnv() {
  printMeta();

  // Build time variables
  const baseURL: string = import.meta.env?.VITE_BASE_PATH ?? '/';

  // Run time variables
  const url = readInitialUrl();

  // TODO - initialUrl from config repository
  localStorage.setItem('initialUrl', location.href); // keep initial url before overwriting by router

  const stageConfig = await getStageConfig();

  apiClient.setup({
    baseURL,
    keycloakClientId: stageConfig.keycloakClientId,
    keycloakRealm: stageConfig.keycloakRealm,
    keycloakUrl: stageConfig.keycloakUrl,
  });

  reportsClient.setup({
    baseURL,
    disableAuth: true,
  });

  apiClient.checkLocalAuthToken();

  /* -- Now you can use client -- */

  // App variables
  const appConfig = await getAppConfig(url.app);

  // Resolve initial layers list
  const layers = notEmpty(url.layers)
    ? url.layers! // already checked ^^^ !
    : appConfig.defaultLayers.map((l) => l.id);

  /* Find initial base map url */
  const baseMapUrl = (await getBaseMapUrl(layers, appConfig)) ?? stageConfig.mapBaseStyle;

  setAppLanguage(appConfig.user.language);

  configsRepository.set({
    baseURL,
    initialUrl: url,
    ...stageConfig,
    ...appConfig,
    mapBaseStyle: baseMapUrl,
    features:
      Object.keys(appConfig.features).length > 0
        ? appConfig.features
        : stageConfig.featuresByDefault,
  });
  return configsRepository.get();
}

const notEmpty = (arr?: Array<unknown>) => arr && arr.length > 0;

async function getBaseMapUrl(layers: string[], appConfig: AppConfig) {
  /* Find base map by source type */
  const findBaseMap = <T extends { source?: { type: string } }>(layers: Array<T>) =>
    layers.find((l) => l.source?.type === 'maplibre-style-url');

  let baseMapUrl: string | undefined;

  const defaultBaseMap = findBaseMap(appConfig.defaultLayers);
  // If app have default base map
  if (defaultBaseMap) {
    // And this base map enabled
    if (layers.includes(defaultBaseMap.id)) {
      // Take data from app config
      baseMapUrl = defaultBaseMap.source?.urls?.at(0);
    } else {
      const notDefaultBaseMapId = ['kontur_lines', 'kontur_zmrok'].find((id) =>
        layers.includes(id),
      );
      // if app have NOT default base map enabled
      if (notDefaultBaseMapId) {
        // fetch data from layers api
        baseMapUrl = await getLayerSourceUrl(
          notDefaultBaseMapId,
          appConfig.id,
          appConfig.user.language,
        );
      }
    }
  }

  return baseMapUrl;
}

function printMeta() {
  if (import.meta.env?.PROD) {
    console.info(
      `%c Disaster Ninja ${import.meta.env.PACKAGE_VERSION} deployment:
    - Build Time: ${import.meta.env.BUILD_TIME}
    - Git Branch: ${import.meta.env.GIT_BRANCH}
    - Git Commit: #${import.meta.env.GIT_COMMIT_HASH}
    - Git Commit Time: ${import.meta.env.GIT_COMMIT_TIME}
    `,
      'color: #bada55',
    );
  }
}

function setAppLanguage(language: string) {
  // TODO: set <html lang= dir=
  i18n.instance
    .changeLanguage(language)
    .catch((e) => console.warn(`Attempt to change language to ${language} failed`, e));
}
