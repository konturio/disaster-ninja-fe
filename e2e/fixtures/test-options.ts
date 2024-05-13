import { test as basis, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import type { Project } from '../page-objects/helperBase.ts';

export type TestOptions = {
  pageManager: PageManager;
  project: Project;
  loginWithNoRightsUser: string;
};

export const test = basis.extend<TestOptions>({
  project: [
    {
      env: 'prod',
      name: '',
      url: '',
      title: '',
      hasCookieBanner: false,
      hasAtlasBanner: false,
      authUrl: '',
    },
    { option: true },
  ],
  pageManager: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
  loginWithNoRightsUser: async ({ page, pageManager, project }, use) => {
    await pageManager.atBrowser.openProject(project);
    // TO DO: remove this action after Atlas is launched
    await pageManager.atBrowser.closeAtlasBanner(project);
    await pageManager.fromNavigationMenu.goToLoginPage();
    await pageManager.atLoginPage.typeLoginPasswordAndLogin(
      process.env.EMAIL!,
      process.env.PASSWORD!,
      0,
    );
    const loginResponse = await page.waitForResponse(project.authUrl);
    expect(loginResponse.status()).toEqual(200);
    await use('');
  },
});
