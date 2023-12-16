import fs from 'node:fs/promises';
import path from 'node:path';

const extensions = ['js', 'ts', 'jsx', 'tsx', 'cjs', 'mjs'];

const fileList = await fs.readdir('../src/', {
  recursive: true,
  withFileTypes: true,
});

const jsFiles = fileList.filter((f) => {
  if (f.isFile()) {
    const extension = f.name.split('.').at(-1);
    return extensions.includes(extension);
  }
});

// console.dir(jsFiles, { maxArrayLength: null });

const esImportFromRegexp = /\sfrom\s['"](.+?)['"]/g;
const dynamicImportRegexp = /import\(['"](.*)['"]\)/gm;
const blockCommentsRegexp = /\/\*[\s\S]*\*\//gm;
const lineCommentsRegexp = /\/\/.*$/gm;
const usedDependencies = await Promise.all(
  jsFiles.map(async ({ path: p, name }) => {
    let content = await fs.readFile(path.join(p, name), {
      encoding: 'utf-8',
      flag: 'r',
    });
    content = content
      .replaceAll(blockCommentsRegexp, '')
      .replaceAll(lineCommentsRegexp, '');

    const imports = content.matchAll(esImportFromRegexp);
    const dynamicImports = content.matchAll(dynamicImportRegexp);

    return [
      Array.from(dynamicImports).map((r) => r[1]),
      Array.from(imports).map((r) => r[1]),
    ];
  }),
);

const usedModules = new Set(
  Array.from(usedDependencies.flat(10)).filter((dep) => {
    if (dep.startsWith('.')) return false;
    if (dep.startsWith('~')) return false;
    return true;
  }),
);

const { dependencies } = JSON.parse(
  await fs.readFile('./package.json', {
    encoding: 'utf-8',
    flag: 'r',
  }),
);

const unused = Object.keys(dependencies).filter((dep) => {
  if (dep.startsWith('@types/')) return false;
  return !usedModules.has(dep);
});

console.log('unused: ', unused);
