const chalk = require('chalk');
const { relativePath, getEnv, addProxies } = require('../utils');

const env = getEnv();

if (process.env.NODE_ENV === 'development') {
  env.proxy &&
    console.log(
      [
        '',
        chalk.bold.greenBright(' ｢PROXY ENABLED｣  '),
        ...env.proxy.map(
          (rule) =>
            ` ${chalk.bold.green('⤨')}  ${chalk.blue(rule.from)} ${chalk.green(
              '→',
            )} ${chalk.blue(rule.to)}`,
        ),
        '',
      ].join('\n'),
    );
}

module.exports = {
  port: env.PORT,
  open: true,
  openPage: '',
  inline: true,
  historyApiFallback: true,
  contentBase: relativePath('dist'),
  overlay: true,
  proxy: env.proxy ? addProxies(env.proxy) : undefined,
  contentBase: relativePath('public'),
};
