import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

for (const project of projects) {
  test.describe(`As PRO user, I can reload the page of ${project.title} and see the info kept`, () => {
    test.beforeEach(async ({ pageManager }) => {
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    });
    test(`Url of map is still the same`, async ({ pageManager, browserName }) => {
      test.fixme(
        browserName === 'webkit',
        'Fix issue https://kontur.fibery.io/Tasks/Task/FE-Application-adds-reference-area-focused-geometry-parameters-in-url-too-late-(Safari-browser)-19487 to activate this test',
      );
      await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');
      if (project.name !== 'disaster-ninja')
        await pageManager.atBrowser.waitForUrlToMatchPattern(/map=/);
      pageManager.atBrowser.checkCampaignIsAutotest();
      await pageManager.atMap.compareUrlsAfterReload(project);
      pageManager.atBrowser.checkCampaignIsAutotest();
    });
    test('My profile has the same data', async ({ pageManager }) => {
      await pageManager.atNavigationMenu.clickButtonToOpenPage('Profile');
      const settingsValues = await pageManager.atProfilePage.getProfileData(project, {
        shouldOsmEditorBeSeenOnAtlas: true,
      });
      pageManager.atBrowser.checkCampaignIsAutotest();
      await pageManager.atProfilePage.compareUrlsAfterReload(project);
      pageManager.atBrowser.checkCampaignIsAutotest();
      const settingsValuesAfterReload = await pageManager.atProfilePage.getProfileData(
        project,
        { shouldOsmEditorBeSeenOnAtlas: true },
      );
      expect(settingsValuesAfterReload).toStrictEqual(settingsValues);
    });
  });
}
