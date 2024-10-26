import type { Plugin } from 'vite';
import { execSync as exec } from 'child_process';

const dataSources = {
  GIT_BRANCH: () => exec('git rev-parse --abbrev-ref HEAD').toString().trim(),
  GIT_COMMIT_HASH: () => exec('git show -s --format=%h').toString().trim(),
  GIT_COMMIT_FULLHASH: () => exec('git show -s --format=%H').toString().trim(),
  GIT_COMMIT_TIME: () => exec('git show -s --format=%cI').toString().trim(),
  // GIT_COMMIT_AUTHOR: () => exec('git show -s --format=%an').toString().trim(),
  // GIT_COMMIT_COMMITER: () => exec('git show -s --format=%cn').toString().trim(),
  // GIT_COMMIT_MESSAGE: () => exec('git show -s --format=%b').toString().trim(),
  PACKAGE_VERSION: () => process.env.npm_package_version,
  BUILD_TIME: () => new Date().toISOString(),
};

let envInjectionFailed = false;

const createPlugin = (): Plugin => {
  return {
    name: 'vite-plugin-build-info',
    config: (_, env) => {
      if (env) {
        const variables = Object.entries(dataSources).reduce((acc, [key, getter]) => {
          try {
            acc[`import.meta.env.${key}`] = JSON.stringify(getter());
          } catch (e) {
            console.error(e);
          }
          return acc;
        }, {});
        return { define: variables };
      } else {
        envInjectionFailed = true;
      }
    },
    configResolved(config) {
      if (envInjectionFailed) {
        config.logger.warn(
          `[vite-plugin-build-info] Variables was not injected due ` +
            `to incompatible vite version (requires vite@^2.0.0-beta.69).`,
        );
      }
    },
  };
};

export default createPlugin;
