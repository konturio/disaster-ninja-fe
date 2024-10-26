import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import process from 'process';

const relativePath = (path) => resolve(dirname(fileURLToPath(import.meta.url)), path);

export function useConfig(pathToConfig, dest) {
  // Create dir for config
  const publicFolder = relativePath('../public/config');
  const pathToDest = dest ?? resolve(publicFolder, 'appconfig.json');
  if (!existsSync(dirname(pathToDest))) {
    mkdirSync(dirname(pathToDest), { recursive: true });
  }

  // Save config file
  copyFileSync(pathToConfig, pathToDest);
  console.log(`Config "${pathToConfig}" will be used`);

  // Return saved config
  return JSON.parse(readFileSync(pathToDest));
}

/**
 * This script select right config depending on env.
 * In production mode in will use default config, in development it prefer to use local config
 */
export function selectConfig(mode) {
  // Setup path
  const configsFolder = relativePath('../configs');
  const knownConfigs = {
    local: resolve(configsFolder, 'config.local.json'),
    default: resolve(configsFolder, 'config.default.json'),
  };

  const isProduction = mode === 'production';
  if (isProduction) {
    return knownConfigs.default;
  }

  // Dev
  const isHaveLocalOverride = existsSync(knownConfigs.local);
  return isHaveLocalOverride ? knownConfigs.local : knownConfigs.default;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // If this script running from cli
  process.stdout.write(
    selectRuntimeConfig(process.env.NODE_ENV ?? 'development', process.env, true) + '\n',
  );
}
