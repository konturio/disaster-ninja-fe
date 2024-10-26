// @ts-check
import prompts from 'prompts';
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
 */
async function askPathToFile(question) {
  const { path } = await prompts([
    {
      type: 'text',
      name: 'path',
      message: question,
    },
  ]);
  return path;
}

/** @param {string} message */
function checkPassed(message) {
  console.log(`${chalk.greenBright('✔')} ${chalk.whiteBright(message)}`);
}

export default {
  askConfirmation,
  checkPassed,
  askPathToFile,
};
