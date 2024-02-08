// @ts-check
import { Octokit } from '@octokit/rest';
import { args } from './args.mjs';
import { createBranchFromMain } from './createBranchFromMain.mjs';
import { updateConfigs } from './updateConfigs.mjs';

const { version, stageName, build, token } = args();

// Configuration
const settings = {
  version,
  stageName,
  build,
  token,
  repoOwner: 'konturio',
  repoName: 'disaster-ninja-cd',
  mainBranch: 'main',
  branchName: `dn-fe-${version}`,
  mergeRequestTitle: `Deploy Disaster-Ninja version ${version} to ${stageName} stage`,
  commitMessage: `update ${stageName} stage configs`,
};

export const gh = new Octokit({
  auth: token,
});

(async function main() {
  await createBranchFromMain(settings);
  await updateConfigs(settings);
  // await createPullRequest();
})();

async function createPullRequest() {
  // Open a pull request from the new branch to the main branch
  return fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      title: mergeRequestTitle,
      head: branchName,
      base: mainBranch,
      body: 'Pull request created by script.',
    }),
  });
}

async function runScript() {
  await createBranchFromMain();
  await updateConfigs();
  // await createPullRequest();
}

runScript();
