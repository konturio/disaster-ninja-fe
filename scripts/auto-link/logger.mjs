import chalk from 'chalk';

export const logger = (nameSpace) => {
  nameSpace = nameSpace ? chalk.yellow(`[${nameSpace}]`) + ': ' : '';
  return {
    error: (message) => console.error(nameSpace + chalk.red(message)),
    info: (message) => console.log(nameSpace + message),
    debug: (message) => process.env.DEBUG && console.log(nameSpace + message),
    important: (message) => console.log(nameSpace + chalk.blue(message)),
  };
};
