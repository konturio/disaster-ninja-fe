import { test as setup } from '@playwright/test';
import { expect } from '@playwright/test';
import { getProjects } from './page-objects/helperBase.ts';
import { PageManager } from './page-objects/pageManager.ts';

setup('Authentication', async ({ page, context }) => {
  const authFile = 'e2e/.auth/user.json';
  const authProjects = getProjects();
  for (const project of authProjects) {
    const newPage = await context.newPage();
    const pm = new PageManager(newPage);

    await pm.atBrowser.openProject(project);
    // TO DO: remove this action after Atlas is launched
    try {
      await pm.atBrowser.closeAtlasBanner(project);
    } catch {}
    await pm.fromNavigationMenu.goToLoginPage();
    await pm.atLoginPage.typeLoginPasswordAndLogin(
      process.env.EMAIL!,
      process.env.PASSWORD!,
      0,
    );
    const loginResponse = await newPage.waitForResponse(project.authUrl);
    expect(loginResponse.status()).toEqual(200);
  }
  await context.storageState({ path: authFile });
});
