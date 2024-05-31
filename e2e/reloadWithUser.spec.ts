import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

for (const project of projects) {
  test.describe(`As User with no rights, I can reload the page of ${project.title} and see the info kept`, () => {
    test.beforeEach(async ({ pageManager }) => {
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    });
    test(`Url of map is still the same`, async ({ pageManager }) => {
      await pageManager.fromNavigationMenu.goToMap();
      await pageManager.atMap.compareUrlsAfterReload(project);
    });
    test('My profile has the same data', async ({ pageManager }) => {
      await pageManager.fromNavigationMenu.goToProfilePage();
      const settingsValues =
        await pageManager.atProfilePage.getAllProfileValuesAndStatuses();
      await pageManager.atProfilePage.compareUrlsAfterReload(project);
      const settingValuesAfterReload =
        await pageManager.atProfilePage.getAllProfileValuesAndStatuses();
      expect(settingValuesAfterReload).toStrictEqual(settingsValues);
    });
  });
}
