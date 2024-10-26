import fs from 'fs';
import { fileURLToPath } from 'url';
import process from 'process';

export function updateKonturPackages() {
  const packages = JSON.parse(fs.readFileSync('package.json'));
  const needUpdate = Object.keys(packages.dependencies).filter((dep) =>
    dep.includes('@konturio'),
  );
  const needUpdateDev = Object.keys(packages.devDependencies || {}).filter((dep) =>
    dep.includes('@konturio'),
  );
  return [...needUpdate, ...needUpdateDev].join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // If this script running from cli
  process.stdout.write(updateKonturPackages());
}
