import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

for (const project of projects) {
  test.describe(`As User with no rights, I can reload the page of ${project.title} and see the info kept`, () => {
    test.beforeEach(async ({ pageManager }) => {
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    });
    if (project.name != 'atlas') {
      test(`Url of map is still the same`, async ({ pageManager }) => {
        await pageManager.fromNavigationMenu.goToMap();
        if (project.name != 'disaster-ninja')
          await pageManager.atBrowser.waitForUrlToMatchPattern(/map=/);
        await pageManager.atMap.compareUrlsAfterReload(project);
      });
    } else {
      test(`Map is not accessible, reloading does not help`, async ({
        page,
        pageManager,
      }) => {
        await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
        await pageManager.fromNavigationMenu.checkThereIsNoMap();
        // TO DO: activate this check once 19103 issue is done
        // expect(page.url()).toContain('autotests');
        await pageManager.atLoginPage.compareUrlsAfterReload(project);
        await pageManager.fromNavigationMenu.checkThereIsNoMap();
        // TO DO: activate this check once 19103 issue is done
        // expect(page.url()).toContain('autotests');
      });
    }
    test('My profile has the same data', async ({ page, pageManager }) => {
      await pageManager.fromNavigationMenu.goToProfilePage();
      const settingsValues = await pageManager.atProfilePage.getProfileData(project, {
        shouldOsmEditorBeSeenOnAtlas: true,
      });
      expect(page.url()).toContain('autotests');
      await pageManager.atProfilePage.compareUrlsAfterReload(project);
      expect(page.url()).toContain('autotests');
      const settingsValuesAfterReload = await pageManager.atProfilePage.getProfileData(
        project,
        { shouldOsmEditorBeSeenOnAtlas: true },
      );
      expect(settingsValuesAfterReload).toStrictEqual(settingsValues);
    });
  });
}
