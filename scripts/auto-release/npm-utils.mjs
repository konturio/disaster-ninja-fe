// @ts-check
import { execSync as exec } from 'child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default {
  readPackageJSON: () => JSON.parse(readFileSync(resolve('package.json')).toString()),
  /** @param {string} json */
  savePackageJSON: (json) =>
    writeFileSync(resolve('package.json'), JSON.stringify(json, null, 2)),
  fixLockFile: () => exec('pnpm i -lockfile-only'),
};
