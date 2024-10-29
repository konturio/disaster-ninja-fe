export function args() {
  const [version, stageName, build, token] = process.argv.slice(2);
  const exampleTemplate = `auto-deploy <version> <dev|test|prod> <build tag> <github token>`;

  try {
    if (!version) {
      throw Error('You need to pass version');
    }

    if (!['test', 'dev', 'prod'].includes(stageName)) {
      throw Error('You need to pass stage: dev, test or prod');
    }

    if (!build) {
      throw Error(
        'You need to pass build tag. Can be taken from https://github.com/konturio/disaster-ninja-fe/pkgs/container/disaster-ninja-fe',
      );
    }

    if (!token) {
      throw Error('You need to pass token');
    }
  } catch (e) {
    throw Error(`${e.message}:\nExample of usage: ${exampleTemplate}`);
  }

  return {
    version,
    stageName,
    build,
    token,
  };
}
