// @ts-check
import chalk from 'chalk';
import { geConfig } from './config.mjs';
import { linkPackages } from './linkPackages.mjs';
import { logger } from './logger.mjs';
import { runBuildScript } from './runBuildScript.mjs';
import { termination } from './termination.mjs';

const log = logger();
async function linkUiKit() {
  const config = await geConfig();
  const stop = await runBuildScript(config.pathToUIKitRepo);
  const unlink = await linkPackages(config.pathToUIKitRepo);
  log.important('\nUI-kit linked in watch mode, press CTRL+C to stop and unlink');
  await termination();
  stop();
  await unlink();
}

try {
  await linkUiKit();
} catch (e) {
  console.log(chalk.redBright(e.message));
}
