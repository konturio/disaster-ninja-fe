declare global {
  interface Window {
    konturAppConfig: {
      API_GATEWAY: string;
      GRAPHQL_API: string;
      BOUNDARIES_API: string;
      REPORTS_API: string;
      TILES_API: string;
      REFRESH_INTERVAL_SEC: number;
      MAP_ACCESS_TOKEN: string;
      MAP_BASE_STYLE: string;
      LOGIN_API_PATH: string;
      LAYERS_BY_DEFAULT: string[];
      KEYCLOAK_URL: string,
      KEYCLOAK_REALM: string,
      KEYCLOAK_CLIENT_ID: string,
    };
  }
}

export default {
  apiGateway: window.konturAppConfig.API_GATEWAY,
  graphqlApi: window.konturAppConfig.GRAPHQL_API,
  boundariesApi: window.konturAppConfig.BOUNDARIES_API,
  reportsApi: window.konturAppConfig.REPORTS_API,
  tilesApi: window.konturAppConfig.TILES_API,
  refreshIntervalSec: window.konturAppConfig.REFRESH_INTERVAL_SEC,
  mapAccessToken: window.konturAppConfig.MAP_ACCESS_TOKEN,
  mapBaseStyle: window.konturAppConfig.MAP_BASE_STYLE,
  loginApiPath: window.konturAppConfig.LOGIN_API_PATH,
  layersByDefault: window.konturAppConfig.LAYERS_BY_DEFAULT,
  keycloakUrl: window.konturAppConfig.KEYCLOAK_URL,
  keycloakRealm: window.konturAppConfig.KEYCLOAK_REALM,
  keycloakClientId: window.konturAppConfig.KEYCLOAK_CLIENT_ID,
  baseUrl: import.meta.env.BASE_URL,
  isDevBuild: import.meta.env.DEV,
  isProdBuild: import.meta.env.PROD,
  appVersion: import.meta.env.PACKAGE_VERSION as string,
  autoFocus: {
    desktopPaddings: {
      left: 336, // communities/analytics panel + paddings
      right: 300, // Layers list panel
      top: 16,
      bottom: 16,
    },
    maxZoom: 13,
  },
  iconLayer: {
    iconMapping: {
      selectedIcon: {
        x: 0,
        y: 0,
        width: 128,
        height: 165,
        anchorY: 160,
      },
      defaultIcon: {
        x: 128,
        y: 0,
        width: 128,
        height: 165,
        anchorY: 160,
      },
      pointIcon: {
        x: 0,
        y: 165,
        width: 20,
        height: 20,
        anchorY: 10,
      }
    },
    sizeScale: 6,
    getSize: () => 6,
  }
};

if (import.meta.env.PROD) {
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
