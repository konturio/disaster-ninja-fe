import { gh } from './index.mjs';

export async function createBranchFromMain(settings) {
  const { repoOwner, repoName, mainBranch, branchName } = settings;
  // Get the latest commit from the main branch
  const mainBranchRef = await gh.rest.git.getRef({
    owner: repoOwner,
    repo: repoName,
    ref: `heads/${mainBranch}`,
  });

  // Create a new branch from the latest commit
  return gh.rest.git.createRef({
    owner: repoOwner,
    repo: repoName,
    ref: `refs/heads/${branchName}`,
    sha: mainBranchRef.data.object.sha, // Latest commit in branch
  });
}
