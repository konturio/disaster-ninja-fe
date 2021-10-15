declare global {
  interface Window {
    konturAppConfig: {
      API_GATEWAY: string;
      GRAPHQL_API: string;
      BOUNDARIES_API: string;
      TILES_API: string;
      REFRESH_INTERVAL_SEC: number;
      MAP_ACCESS_TOKEN: string;
      MAP_BASE_STYLE: string;
      LOGIN_API_PATH: string;
    };
  }
}

export default {
  apiGateway: window.konturAppConfig.API_GATEWAY,
  graphqlApi: window.konturAppConfig.GRAPHQL_API,
  boundariesApi: window.konturAppConfig.GRAPHQL_API,
  tilesApi: window.konturAppConfig.TILES_API,
  refreshIntervalSec: window.konturAppConfig.REFRESH_INTERVAL_SEC,
  mapAccessToken: window.konturAppConfig.MAP_ACCESS_TOKEN,
  mapBaseStyle: window.konturAppConfig.MAP_BASE_STYLE,
  loginApiPath: window.konturAppConfig.LOGIN_API_PATH,
  baseUrl: import.meta.env.BASE_URL,
  isDevBuild: import.meta.env.DEV,
  isProdBuild: import.meta.env.PROD,
  appVersion: import.meta.env.PACKAGE_VERSION as string,
};

console.info(
  `%c Disaster Ninja ${import.meta.env.PACKAGE_VERSION} deployment:
- Build Time: ${import.meta.env.BUILD_TIME}
- Git Branch: ${import.meta.env.GIT_BRANCH}
- Git Commit: #${import.meta.env.GIT_COMMIT_HASH}
- Git Commit Time: ${import.meta.env.GIT_COMMIT_TIME}
- Git Commit Author: ${import.meta.env.GIT_COMMIT_AUTHOR}
- Git Commit Commiter: ${import.meta.env.GIT_COMMIT_COMMITER}
- Git Commit Message: ${import.meta.env.GIT_COMMIT_MESSAGE}
`,
  'color: #bada55',
);
