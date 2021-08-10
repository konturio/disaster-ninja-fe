const fs = require('fs');

function updateK2() {
  const packages = JSON.parse(fs.readFileSync('package.json'));
  const needUpdate = Object.keys(packages.dependencies).filter(dep => dep.includes('@k2-packages'));
  const needUpdateDev = Object.keys(packages.devDependencies).filter(dep => dep.includes('@k2-packages'));
  return [...needUpdate, ...needUpdateDev].join(' ');
}

/* Python style? :D */
if (require.main === module) {
  process.stdout.write(updateK2());
} else {
  module.exports = updateK2;
}