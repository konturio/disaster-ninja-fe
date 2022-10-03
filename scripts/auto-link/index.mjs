// @ts-check
import chalk from 'chalk';

async function linkUiKit() {
  const { konturioRepo } = await getLinksConfig();
  const { uiKitPackage, stopBuild } = await runBuildScript({ repoPath: konturioRepo });
  const link = await createLinkToPackage({ packagePath: uiKitPackage });
  const unlink = await useLink(link);
  await termination();
  await stopBuild();
  await unlink();
}

try {
  await linkUiKit();
} catch (e) {
  console.log(chalk.redBright(e.message));
}
