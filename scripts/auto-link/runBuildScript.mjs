import { spawn } from 'node:child_process';
import { logger } from './logger.mjs';

const isClearCommand = (stdout) => stdout.indexOf('c') !== -1;
const isInitFinished = (stdout) => stdout.indexOf('Watching for file changes.') !== -1;

/** @param {string} command */
/** @param {string} dir */
export function runCommandInDir(command, args = [], dir) {
  const nameSpace = `${command} ${args.join(' ')}`;
  const log = logger(nameSpace);
  return new Promise((res, rej) => {
    const commandProcess = spawn(command, args, {
      cwd: dir,
      windowsHide: true,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const stopProcessCb = () => {
      log.info('Stopping build');
      commandProcess.kill();
    };

    let watcherStarted = false;

    log.info('Start build');
    commandProcess.stdout.on('data', (stdout) => {
      if (isClearCommand(stdout)) return;
      if (watcherStarted) {
        log.info(stdout);
      } else {
        log.debug(stdout);
      }
      if (!watcherStarted && isInitFinished(stdout)) {
        log.info('Build finished, looking for changes');
        watcherStarted = true;
        res(stopProcessCb);
      }
    });
    commandProcess.stderr.on('data', (stderr) => log.debug(stderr));
    commandProcess.stderr.on('close', (code) => {
      log.info('Build was stopped');
      rej('Script was stopped');
      log.debug(`Exit code: "${code}"`);
    });
  });
}

export async function runBuildScript(path) {
  return runCommandInDir('npm', ['run', 'build:watch'], path);
}
