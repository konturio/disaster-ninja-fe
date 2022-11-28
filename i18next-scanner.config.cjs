/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const typescript = require('typescript');
const tsconfig = require('./tsconfig.json');

module.exports = {
  input: [
    'src/**/*.{ts,tsx}',
    // Use ! to filter out files or directories
    '!**/node_modules/**',
  ],
  output: './',
  options: {
    debug: true,
    attr: false,
    createOldCatalogs: false,
    removeUnusedKeys: true,
    func: {
      list: ['i18n.t', 't'],
    },
    trans: {
      acorn: {
        ecmaVersion: 2022,
      },
    },
    lngs: ['en'],
    ns: ['common'],
    defaultLng: 'en',
    defaultNs: 'common',
    defaultValue: '',
    resource: {
      loadPath: 'src/core/localization/translations/{{lng}}/{{ns}}.json',
      savePath: 'src/core/localization/translations/{{lng}}/{{ns}}.json',
    },
    pluralSeparator: ':',
    contextSeparator: ':',
    nsSeparator: ':',
    keySeparator: '.',
  },

  transform: typescriptTransform(),
};

// it's just a copy of https://github.com/nucleartux/i18next-scanner-typescript/blob/master/src/index.js
// i18next-scanner can't work with .ts out of box, so we need to transform ts files
// we copy this because we want to use our local ts version, not outdated one from i18next-scanner-typescript
function typescriptTransform(options = { extensions: ['.ts', '.tsx'] }) {
  return function transform(file, enc, done) {
    const { base, ext } = path.parse(file.path);

    if (options.extensions.includes(ext) && !base.includes('.d.ts')) {
      const content = fs.readFileSync(file.path, enc);

      const { outputText } = typescript.transpileModule(content, {
        compilerOptions: {
          target: tsconfig.compilerOptions.target,
          module: tsconfig.compilerOptions.module,
        },
        fileName: path.basename(file.path),
      });

      this.parser.parseTransFromString(outputText);
      this.parser.parseFuncFromString(outputText);
    }

    done();
  };
}
