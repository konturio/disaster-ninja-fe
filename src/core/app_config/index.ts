export default {
  apiGateway: window.konturAppConfig.API_GATEWAY,
  refreshIntervalSec: window.konturAppConfig.REFRESH_INTERVAL_SEC,
  mapAccessToken: window.konturAppConfig.MAP_ACCESS_TOKEN,
  mapBaseStyle: window.konturAppConfig.MAP_BASE_STYLE,
  loginApiPath: window.konturAppConfig.LOGIN_API_PATH,
  baseUrl: import.meta.env.BASE_URL,
  isDevBuild: import.meta.env.DEV,
  isProdBuild: import.meta.env.PROD,
  appVersion: import.meta.env.PACKAGE_VERSION,
};

console.info(
  `%c Disaster Ninja ${import.meta.env.PACKAGE_VERSION} deployment:
- Git Branch: ${import.meta.env.GIT_BRANCH}
- Git Commit: #${import.meta.env.GIT_COMMIT_HASH}
- Git Commit Time: ${import.meta.env.GIT_COMMIT_TIME}
- Git Commit Author: ${import.meta.env.GIT_COMMIT_AUTHOR}
- Git Commit Commiter: ${import.meta.env.GIT_COMMIT_COMMITER}
- Build Time: ${import.meta.env.BUILD_TIME}
- Git Commit Message: ${import.meta.env.GIT_COMMIT_MESSAGE}
`,
  'color: #bada55',
);
