import prompts from 'prompts';
import chalk from 'chalk';
import semver from 'semver';
import { execSync as exec } from 'child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const git = {
  isMainBranch: () =>
    exec('git rev-parse --abbrev-ref HEAD').toString().trim() === 'main',
  branchSyncedWithRemote: () =>
    exec('git status').toString().includes('nothing to commit, working tree clean'),
  createAndCheckoutToBranch: (branch) => exec(`git checkout -b ${branch}`).toString(),
  pushAll: (message) => {
    exec(`git add .`);
    exec(`git commit -m "${message}"`);
    exec(`git push`);
  },
};

const projectPackageJSON = {
  read: () => JSON.parse(readFileSync(resolve('package.json'))),
  save: (json) => writeFileSync(resolve('package.json'), JSON.stringify(json, null, 2)),
};
const fixLockFile = () => exec('npm i --package-lock-only');

/* This script help us with creating frontend releases */
async function createRelease() {
  if (!git.isMainBranch()) throw new Error('You should create release from main branch');
  if (!git.branchSyncedWithRemote())
    throw new Error('You should pull/push changes before');

  const { haveUnmergedRelease } = await prompts([
    {
      type: 'confirm',
      name: 'haveUnmergedRelease',
      message: 'The repository has an unmerged release?',
    },
  ]);

  if (haveUnmergedRelease) throw new Error('You should merge or close previous release');

  const packageJSON = projectPackageJSON.read();
  console.log(semver.inc(packageJSON.version, 'minor'));
  const { version, versionConfirmed } = await prompts([
    {
      type: 'select',
      name: 'version',
      message: 'New version is:',
      initial: 1,
      choices: [
        { title: 'major', value: 'major', description: 'Add breaking changes' },
        { title: 'minor', value: 'minor', description: 'Add new features' },
        { title: 'patch', value: 'patch', description: 'Add bugfix' },
      ],
      format: (releaseType) => semver.inc(packageJSON.version, releaseType),
    },
    {
      type: 'confirm',
      name: 'versionConfirmed',
      message: (nextVersion) =>
        `Update version from ${chalk.yellowBright(
          packageJSON.version,
        )} to ${chalk.yellowBright(nextVersion)} ?`,
    },
  ]);

  if (!versionConfirmed) {
    console.log(chalk.yellow('Canceled'));
    return;
  }

  console.log('Creating release branch, please wait\n')
  const branchName = `${release}-version`;
  git.createAndCheckoutToBranch(branchName);
  projectPackageJSON.save({
    ...packageJSON,
    version,
  });
  fixLockFile();
  git.pushAll(`Version ${version}`);
  console.log(chalk.greenBright(`Success! You can now open a pull request by the link above`))
}

try {
  await createRelease();
} catch (e) {
  console.log(chalk.redBright(e.message));
}
