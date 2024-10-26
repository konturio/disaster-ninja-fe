// @ts-check
import prompts from 'prompts';
import semver from 'semver';
import chalk from 'chalk';

/** @param {string} question */
async function askConfirmation(question) {
  const answers = await prompts([
    {
      type: 'confirm',
      name: 'haveUnmergedRelease',
      message: question,
    },
  ]);
  return answers.haveUnmergedRelease;
}
/**
 * @param {string} question
 * @param {Array} variants
 * @param {Object} options
 * @param {string} options.currentVersion
 * @param {string} options.default
 */
async function askVersion(question, variants, options) {
  const { version, versionConfirmed } = await prompts([
    {
      type: 'select',
      name: 'version',
      message: question,
      initial: variants.findIndex((v) => v.value === options.default) ?? 0,
      choices: variants,
      format: (releaseType) => semver.inc(options.currentVersion, releaseType),
    },
    {
      type: 'confirm',
      name: 'versionConfirmed',
      message: (nextVersion) =>
        `Update version from ${chalk.yellowBright(
          options.currentVersion,
        )} to ${chalk.yellowBright(nextVersion)} ?`,
    },
  ]);
  if (!versionConfirmed) {
    throw new Error('Canceled by user');
  }

  return version;
}

/** @param {string} message */
export function checkPassed(message) {
  console.log(`${chalk.greenBright('✔')} ${chalk.whiteBright(message)}`);
}

export default {
  askConfirmation,
  askVersion,
  checkPassed,
};
