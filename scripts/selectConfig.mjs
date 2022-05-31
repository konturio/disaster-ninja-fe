import { copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import process from 'process';

const relativePath = path => resolve(dirname(fileURLToPath(import.meta.url)), path);

function configInjector(pathToDest) {
  return (pathToConfig) => {
    copyFileSync(pathToConfig, pathToDest);
    console.log(`Config "${pathToConfig}" will be used`)
    return `Config "${pathToConfig}" will be used`;
  }
}

/**
 * This script select right config depending on env.
 * In production mode in will use default config, in development it prefer to use local config
 */
export default function selectRuntimeConfig(mode, env, isSelfInvoked = false) {
  // Setup path
  const configsFolder = isSelfInvoked ? relativePath('../configs') : relativePath('./configs');
  const knownConfigs = {
    local: resolve(configsFolder, 'config.local.js'),
    default: resolve(configsFolder, 'config.default.js')
  };
  const publicFolder = isSelfInvoked ? relativePath('../public/config') : relativePath('./public/config');
  const pathToDest = env.DEST_PATH ?? resolve(publicFolder, 'appconfig.js');

  // Check env
  const isProduction = mode === 'production';
  const useConfig = configInjector(pathToDest)

  // Prod
  if (isProduction) {
    return useConfig(knownConfigs.default);
  }

  // Dev
  const isHaveLocalOverride = existsSync(knownConfigs.local);
  return useConfig(
    isHaveLocalOverride
      ? knownConfigs.local
      : knownConfigs.default
  );
}


if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // If this script running from cli
  process.stdout.write(
    selectRuntimeConfig(
      process.env.NODE_ENV ?? 'development',
      process.env,
      true
    ) + '\n');
}