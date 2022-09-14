import prompts from 'prompts';
import chalk from 'chalk'
import { execSync as exec } from 'child_process';

const isMainBranch = () =>
  exec('git rev-parse --abbrev-ref HEAD').toString().trim() === 'main';
const branchInUnSyncState = () => exec('git status').toString().trim();


async function createRelease() {
  if (isMainBranch()) throw new Error('You should release branch from main branch');
  if (branchInUnSyncState()) throw new Error('You should pull changes before');
  if (repoHaveUnmergedRelease())
    throw new Error('You should merge or cancel previous release');

  const response = await prompts({
    type: 'text',
    name: 'version',
    message: 'New version is:',
    validate: (value) => (value < 18 ? `Nightclub is 18+ only` : true),
  });
}


// try {
//   await createRelease();
// } catch(e) {
//   chalk.redBright(e.message);
// }

console.log(branchInUnSyncState().includes('nothing to commit, working tree clean'))