// @ts-check
import { execSync as exec } from 'child_process';

export default {
  currentBrunch: () => exec('git rev-parse --abbrev-ref HEAD').toString().trim(),
  status: () => exec('git status').toString(),
  /** @param {string} branch */
  createAndCheckoutToBranch: (branch) => exec(`git checkout -b ${branch}`).toString(),
  /** @param {string} dir */
  add: (dir) => exec(`git add ${dir}`),
  /** @param {string} message */
  commit: (message) => exec(`git commit -m "${message}"`),
  push: () => exec(`git push`),
};
