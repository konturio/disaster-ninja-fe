import prompts from 'prompts';
import semver from 'semver';
import chalk from 'chalk';

async function askConfirmation(question) {
  const answers = await prompts([
    {
      type: 'confirm',
      name: 'haveUnmergedRelease',
      message: question,
    },
  ]);
  return answers.haveUnmergedRelease
}

async function askVersion(question, variants, options) {
  const { version, versionConfirmed } = await prompts([
    {
      type: 'select',
      name: 'version',
      message: question,
      initial: variants.find(v => v.value === options.default) ?? 0,
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
  if (versionConfirmed) {
    throw new Error('Canceled by user');
  }

  return version;
}

export default {
  askConfirmation,
  askVersion
}