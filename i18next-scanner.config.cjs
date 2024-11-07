module.exports = {
  input: ['src/**/*.{ts,tsx}', '!**/node_modules/**'],
  output: './',
  options: {
    debug: true,
    attr: false,
    createOldCatalogs: false,
    removeUnusedKeys: true,
    func: {
      list: ['i18n.t', 't'],
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
};
