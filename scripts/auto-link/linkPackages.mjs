import path from 'node:path';
import { exec as cbExec } from 'node:child_process';
import { promisify } from 'node:util';
import { readdir, readFile } from 'node:fs/promises';
import { logger } from './logger.mjs';
const exec = promisify(cbExec);

const log = logger('link');
const packagesDir = 'packages';

async function findPackages(packagesRoot) {
  log.debug(`Looking for packages in '${packagesRoot}'`);

  const packagesDirs = (
    await readdir(packagesRoot, {
      withFileTypes: true,
    })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const packages = (
    await Promise.allSettled(
      packagesDirs.map(async (dir) => {
        const fullPath = path.resolve(packagesRoot, dir);
        const pckJson = JSON.parse(
          await readFile(path.resolve(fullPath, 'package.json'), {
            encoding: 'utf8',
          }),
        );
        return { packageJson: pckJson, fullPath, name: pckJson.name };
      }),
    )
  )
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);

  log.info(`Founded packages: \n - ${packages.map(({ name }) => name).join('\n - ')}`);

  return packages;
}

async function createLinks(packages) {
  log.debug('Creating links for packages');
  const linksCreation = await Promise.allSettled(
    packages.map(({ fullPath }) => exec('npm link', { cwd: fullPath })),
  );
  linksCreation.forEach((r, i) => {
    if (r.status == 'fulfilled') {
      log.debug(`Link created for ${packages[i].name}`);
    } else {
      log.error(`Fail to create link for ${packages[i].name}`);
      log.debug(r.reason);
    }
  });
}

const splitNpmWarnings = (stderr, warnsCb, errorsCb) => {
  let warns = '';
  let errors = '';

  stderr
    .split('\n')
    .forEach((s) =>
      s.startsWith('npm WARN') ? (warns += s + '\n') : (errors += s + '\n'),
    );

  if (warns.length > 0) {
    warnsCb(warns);
  }

  errors = errors.trim();
  if (errors.length > 0) {
    errorsCb(errors);
  }
};

async function applyLinks(packages) {
  log.debug('Applying packages links');
  const command = `npm link ${packages.map(({ name }) => `"${name}"`).join(' ')}`;
  const { stdout, stderr } = await exec(command);
  log.debug(stdout);
  splitNpmWarnings(
    stderr,
    (warns) => log.debug(warns),
    (err) => log.error(command + '\n' + err),
  );
}

async function removeLinks(packages) {
  log.info('Unlink packages');
  const command = `npm unlink ${packages
    .map(({ name }) => `"${name}"`)
    .join(' ')} --no-save`;
  const unlinkCmd = await exec(command);
  log.debug(unlinkCmd.stdout);
  splitNpmWarnings(
    unlinkCmd.stderr,
    (warns) => log.debug(warns),
    (err) => log.error(command + '\n' + err),
  );
  log.debug('Links removed');

  log.debug('Reinstall original packages');
  const installCmd = await exec('npm install');
  log.debug(installCmd.stdout);
  splitNpmWarnings(
    installCmd.stderr,
    (warns) => log.debug(warns),
    (err) => log.error(command + '\n' + err),
  );
}

/**
 * @param {string} pathToPackages
 */
export async function linkPackages(pathToPackages) {
  log.info('Register new links');
  const packagesRoot = path.resolve(pathToPackages, packagesDir);
  const packages = await findPackages(packagesRoot);
  await createLinks(packages);
  await applyLinks(packages);
  log.info('Links registered');
  return async () => {
    await removeLinks(packages);
  };
}
