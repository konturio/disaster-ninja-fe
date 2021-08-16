const { relativePath } = require('../utils');

module.exports = {
  modules: ['node_modules'],
  extensions: ['.ts', '.tsx', '.js', '.json'],
  symlinks: true,
  alias: {
    '@components': relativePath('src/components'),
    '@views': relativePath('src/views'),
    '@config': relativePath('src/config'),
    '@utils': relativePath('src/utils'),
    '@services': relativePath('src/services'),
    '@appModule': relativePath('src/redux-modules/appModule'),
  },
};
