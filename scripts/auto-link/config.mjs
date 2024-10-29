import { readFileSync, writeFileSync } from 'fs';
import prompts from './prompts.mjs';
import { logger } from './logger.mjs';

const log = logger('Config reader');
// @ts-check
export async function geConfig(pathToConfig = './scripts/auto-link/.path') {
  try {
    const pathToUIKitRepo = readFileSync(pathToConfig, { encoding: 'utf8' });
    return { pathToUIKitRepo };
  } catch (e) {
    log.debug(e);
    const pathToUIKitRepo = await prompts.askPathToFile(
      'Path to folder with @kontur/ui repo.\n Note that on windows system you should use double back slashes "\\" ',
    );
    writeFileSync(pathToConfig, pathToUIKitRepo);
    return { pathToUIKitRepo };
  }
}
