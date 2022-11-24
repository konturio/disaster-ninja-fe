// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  plugins: ['i18n-json'],
  rules: {
    'i18n-json/identical-keys': [
      1,
      {
        filePath: path.resolve('./src/core/localization/translations/en/common.json'),
      },
    ],
  },
};
