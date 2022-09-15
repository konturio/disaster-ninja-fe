import chalk from 'chalk';
import git from './git-utils.mjs';
import prompts from './prompts.mjs';
import npm from './npm-utils.mjs';

/* This script help us with creating frontend releases */
async function createRelease() {
  // Check branch
  if (git.currentBrunch() !== 'main')
    throw new Error('You should create release from main branch');
  // Check status
  if (!git.status().includes('nothing to commit, working tree clean'))
    throw new Error('You should pull/push changes before');
  // Check PR
  if (!(await prompts.askConfirmation('The repository has an unmerged release?'))) {
    throw new Error('You should merge or close previous release');
  }
  // Ask new version
  const packageJSON = npm.readPackageJSON();

  const version = await prompts.askVersion(
    'New version is:',
    [
      { title: 'major', value: 'major', description: 'Add breaking changes' },
      { title: 'minor', value: 'minor', description: 'Add new features' },
      { title: 'patch', value: 'patch', description: 'Add bugfix' },
    ],
    { currentVersion: packageJSON.version, default: 'minor' },
  );

  // Create release branch
  console.log('Creating release branch, please wait\n');
  const branchName = `${release}-version`;
  git.createAndCheckoutToBranch(branchName);

  // Update package.json
  npm.savePackageJSON({
    ...packageJSON,
    version,
  });

  // Update package.lock.json
  npm.fixLockFile();

  // Git push
  git.add('.');
  git.commit(`Version ${version}`);
  git.push();

  // Final message
  console.log(
    chalk.greenBright(`Success! You can now open a pull request by the link above`),
  );
}

try {
  await createRelease();
} catch (e) {
  console.log(chalk.redBright(e.message));
}
