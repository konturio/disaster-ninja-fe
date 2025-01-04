import path from 'node:path';
import i18nJsonPlugin from 'eslint-plugin-i18n-json';
// used in "lint:i18n:keys:identity"
export default {
  files: ['src/core/localization/translations/**/*.json'],
  plugins: {
    'i18n-json': i18nJsonPlugin,
  },
  processor: {
    meta: { name: '.json' },
    ...i18nJsonPlugin.processors['.json'],
  },
  rules: {
    'i18n-json/identical-keys': [
      'warn',
      {
        filePath: path.resolve('./src/core/localization/translations/en/common.json'),
        ignoredKeys: [],
        reportIgnoredKeys: true,
        checkKeyStructure: true,
      },
    ],
    'i18n-json/valid-json': 'error',
  },
};
