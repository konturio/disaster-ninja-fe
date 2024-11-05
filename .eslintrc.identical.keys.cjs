module.exports = {
  plugins: ['i18n-json'],
  rules: {
    'i18n-json/identical-keys': [
      'warn',
      {
        filePath: './src/core/localization/translations/en/common.json',
        ignoredKeys: [],
        reportIgnoredKeys: true,
        checkKeyStructure: true,
      },
    ],
    'i18n-json/valid-json': 'error',
  },
};
