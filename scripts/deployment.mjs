const [version, stageName, build, token] = process.argv.slice(2);
if (!version) {
  throw Error('You need to pass version');
}

if (!version) {
  throw Error('You need to pass stage');
}

const repoOwner = 'konturio';
const repoName = 'disaster-ninja-cd';
const mainBranch = 'main';
const branchName = `dn-fe-${version}`;
const mergeRequestTitle = `Deploy Disaster-Ninja version ${version} to ${stageName} stage`;
const commitMessage = `update ${stageName} stage configs`;
const transforms = {
  ['helm/disaster-ninja-fe/Chart.yaml']: (content) => {
    const regExp = /(version:)\s?(\d+.\d+.\d+)/gm;
    const result = regExp.exec(content);
    if (result === null) {
      throw Error('Not found `version` in file');
    }
    const version = result[2];
    const newVersion = version
      .split('.')
      .map((v, i, a) => {
        v = Number(v);
        if (isNaN(v)) {
          throw Error(`Failed to parse current version: ${version}`);
        }
        // Increase last number
        if (i === a.length - 1) return v + 1;
        return v;
      })
      .join('.');

    const newContent = content.replace(version, newVersion);
    return newContent;
  },
  [`helm/disaster-ninja-fe/values/values-${stageName}.yaml`]: (content) => {
    const regExp = /(tag:)\s?([\w\d-.]*)/gm;
    const result = regExp.exec(content);
    if (result === null) {
      throw Error('Not found `tag` in file');
    }
    const currentTag = result[2];
    const newContent = content.replace(currentTag, build);
    return newContent;
  },
};

const headers = {
  Authorization: `token ${token}`,
  'Content-Type': 'application/json',
};

async function createBranchFromMain() {
  // Get the latest commit from the main branch
  const mainBranchData = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/${mainBranch}`,
    {
      headers: headers,
    },
  ).then((response) => response.json());

  const latestCommitSha = mainBranchData.object.sha;

  // Create a new branch from the latest commit
  return fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: latestCommitSha,
    }),
  });
}

async function changeConfigAndCommit() {
  let prevCommitSHA;
  const newFiles = await Promise.all(
    Object.keys(transforms).map(async (file) => {
      console.log(`  /${file}:`);
      // Retrieve the config file
      const configFileData = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file}?ref=${branchName}`,
        {
          headers: headers,
        },
      ).then((response) => response.json());

      prevCommitSHA = configFileData.sha; // TODO: What a correct way to get this?

      // Decode the file content from base64
      let content = Buffer.from(configFileData.content, 'base64').toString();

      // Update file content
      content = transforms[file](content);

      // Encode the updated content back to base64
      const updatedContent = Buffer.from(content, 'utf-8').toString('base64');
      return {
        path: file,
        mode: '100644',
        type: 'blob',
        content: updatedContent,
      };
    }),
  );

  const treeData = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees`,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        base_tree: prevCommitSHA, // Base tree of the current branch
        tree: newFiles,
      }),
    },
  ).then((response) => response.json());

  // Create a commit with both file changes
  return fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/commits`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      message: commitMessage,
      tree: treeData.sha,
      parents: [prevCommitSHA],
    }),
  })
    .then((response) => response.json())
    .then((commitData) => {
      // Update the reference of the branch to point to the new commit
      return fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/${branchName}`,
        {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify({
            sha: commitData.sha,
          }),
        },
      );
    });

  // // Create a commit with the updated file
  // return fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file}`, {
  //   method: 'PUT',
  //   headers: headers,
  //   body: JSON.stringify({
  //     message: commitMessage,
  //     content: updatedContent,
  //     branch: newBranch,
  //     sha: configFileData.sha,
  //   }),
  // });
}

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
  console.log('Update configs:');
  await changeConfigAndCommit();
  await createPullRequest();
}

runScript();
