import { apiClient, reportsClient } from '~core/apiClientInstance';
import { getStageConfig } from '~core/config/loaders/stageConfigLoader';
import { getAppConfig, getLayerSourceUrl } from '~core/config/loaders/appConfigLoader';
import { readInitialUrl } from '~core/url_store/readInitialUrl';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { getDefaultLayers } from '~core/api/layers';
import type { UserDto } from '~core/app/user';
import type { LayerDetailsDto } from '~core/logical_layers/types/source';

export async function setupApplicationEnv() {
  printMeta();

  // Build time variables
  const baseUrl: string = import.meta.env?.VITE_BASE_PATH ?? '/';

  // Shared config - comes from url
  const sharedConfig = readInitialUrl();

  // TODO - initialUrl from config repository
  localStorage.setItem('initialUrl', location.href); // keep initial url before overwriting by router

  // Stage config - depends from appconfig.json in CI repo
  // (/configs/config.local.json for localhost)
  const stageConfig = await getStageConfig();

  // Prepare clients for fetch additional configs from apis
  apiClient.setup({
    baseUrl: stageConfig.apiGateway,
    keycloakClientId: stageConfig.keycloakClientId,
    keycloakRealm: stageConfig.keycloakRealm,
    keycloakUrl: stageConfig.keycloakUrl,
  });

  reportsClient.setup({
    baseUrl: stageConfig.reportsApiGateway,
    disableAuth: true,
  });

  apiClient.checkLocalAuthToken();

  /* -- Now you can use client -- */

  // App related configs
  const appConfig = await getAppConfig(sharedConfig.app);

  // Setting up favicons dynamically fron app config.
  // It covers the case when an app is loaded using DN domain.
  const link32 = document.querySelector("link[id='favicon-ico']") as HTMLLinkElement;
  if (link32 && appConfig.faviconPack['favicon.ico']) {
    link32.href = appConfig.faviconPack['favicon.ico'];
  }
  const linkSvg = document.querySelector("link[id='favicon-svg']") as HTMLLinkElement;
  if (linkSvg && appConfig.faviconPack['favicon.svg']) {
    linkSvg.href = appConfig.faviconPack['favicon.svg'];
  }
  const linkAppleTouch = document.querySelector(
    "link[id='favicon-apple-touch']",
  ) as HTMLLinkElement;
  if (linkAppleTouch && appConfig.faviconPack['apple-touch-icon.png']) {
    linkAppleTouch.href = appConfig.faviconPack['apple-touch-icon.png'];
  }

  // WTF moment: Sometimes user comes with app settings...
  // Just because backend probably know user from token in request
  // User added to this response.
  // TODO - fix that, do not mixing things
  // If not - we use public
  // publicUser takes settings from stage configuration
  // TODO - get user settings by token

  const initialUser =
    appConfig.user ??
    createPublicUser({
      language: i18n.getSupportedLanguage(
        navigator.languages,
        stageConfig.defaultLanguage,
      ),
      osmEditor: stageConfig.osmEditors[0].id,
      defaultFeed: stageConfig.defaultFeed,
    });
  setAppLanguage(initialUser.language);
  const defaultLayers = await getDefaultLayers(appConfig.id, initialUser.language);

  // Resolve initially enabled layers list
  const activeLayers = notEmpty(sharedConfig.layers)
    ? sharedConfig.layers
    : defaultLayers.map((l) => l.id);

  /* Find initial base map url (download if needed) */
  const baseMapUrl =
    (await getBaseMapUrl(
      activeLayers,
      appConfig.id,
      initialUser.language,
      defaultLayers,
    )) ?? stageConfig.mapBaseStyle;

  configRepo.set({
    baseUrl,
    initialUrl: sharedConfig,
    activeLayers,
    stageConfig,
    appConfig,
    baseMapUrl,
    initialUser,
    defaultLayers,
  });

  return configRepo.get();
}

const notEmpty = <T>(arr?: Array<T>): arr is Array<T> =>
  Array.isArray(arr) && arr.length > 0;

async function getBaseMapUrl(
  layers: string[],
  appId: string,
  language: string,
  defaultLayers: LayerDetailsDto[],
) {
  /* Find base map by source type */
  const findBaseMap = <T extends { source?: { type: string } }>(layers: Array<T>) =>
    layers.find((l) => l.source?.type === 'maplibre-style-url');

  let baseMapUrl: string | undefined;

  const defaultBaseMap = findBaseMap(defaultLayers);
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
        baseMapUrl = await getLayerSourceUrl(notDefaultBaseMapId, appId, language);
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

function createPublicUser({
  language,
  osmEditor,
  defaultFeed,
}: {
  language: string;
  osmEditor: string;
  defaultFeed: string;
}): UserDto {
  return {
    username: '',
    email: '',
    fullName: '',
    language,
    useMetricUnits: true,
    subscribedToKonturUpdates: false,
    bio: '',
    osmEditor,
    defaultFeed,
    theme: 'kontur',
  };
}
