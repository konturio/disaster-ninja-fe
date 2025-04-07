import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';

const projects = getProjects();
test.beforeEach(() => {
  stepCounter.counter = 0;
});

for (const project of projects) {
  test.describe(`As User with no rights, I can reload the page of ${project.title} and see the info kept`, () => {
    test.beforeEach(async ({ pageManager }) => {
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    });
    if (project.name !== 'atlas') {
      test(`Url of map is still the same`, async ({ pageManager }) => {
        await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');
        if (project.name !== 'disaster-ninja')
          await pageManager.atBrowser.waitForUrlToMatchPattern(/map=/);
        await pageManager.atMap.compareUrlsAfterReload(project);
      });
    } else {
      test(`Map is not accessible`, async ({ pageManager }) => {
        await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
        await pageManager.atNavigationMenu.checkThereIsNoMap();
        pageManager.atBrowser.checkCampaignIsAutotest();
        await pageManager.atLoginPage.compareUrlsAfterReload(project);
        await pageManager.atNavigationMenu.checkThereIsNoMap();
        pageManager.atBrowser.checkCampaignIsAutotest();
      });
    }
    test('My profile has the same data', async ({ pageManager }) => {
      test.fixme(
        project.name === 'atlas',
        'Fix https://kontur.fibery.io/Tasks/Task/routing-Reloading-the-profile-page-opens-pricing-tab-for-user-with-no-subscription-19964 to unblock atlas test',
      );

      await pageManager.atNavigationMenu.clickButtonToOpenPage('Profile');
      const settingsValues = await pageManager.atProfilePage.getAndAssertProfileData(
        project,
        {
          shouldOsmEditorBeSeenOnAtlas: true,
          isUsrPro: false,
        },
      );
      pageManager.atBrowser.checkCampaignIsAutotest();
      await pageManager.atProfilePage.compareUrlsAfterReload(project);
      pageManager.atBrowser.checkCampaignIsAutotest();
      const settingsValuesAfterReload =
        await pageManager.atProfilePage.getAndAssertProfileData(project, {
          shouldOsmEditorBeSeenOnAtlas: true,
          isUsrPro: false,
        });
      expect(
        settingsValuesAfterReload,
        `Expect new profile data to match old one after reload`,
      ).toStrictEqual(settingsValues);
    });
  });
}
