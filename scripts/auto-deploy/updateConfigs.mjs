export async function updateConfigs(settings) {
  await readCurrentConfigs()
    .then((configs) => transformConfigs(configs))
    .then(() => commitChanges())
    .then(() => pushChanges());

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

  console.log('newFiles', newFiles);

  //   octokit.rest.git.createCommit({
  //     owner,
  // repo,
  // message,
  // tree,
  // author.name,
  // author.email
  //   })
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

  console.log('treeData', treeData);
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

function readCurrentConfigs() {}

function transformConfigs() {}
function commitChanges() {}

function pushChanges() {}
