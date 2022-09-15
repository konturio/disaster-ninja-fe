import { execSync as exec } from 'child_process';

export default {
  currentBrunch: () => exec('git rev-parse --abbrev-ref HEAD').toString().trim(),
  status: () => exec('git status').toString(),
  createAndCheckoutToBranch: (branch) => exec(`git checkout -b ${branch}`).toString(),
  add: () => exec(`git add .`),
  commit: (message) => exec(`git commit -m "${message}"`),
  push: () => exec(`git push`),
};
