import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

for (const project of projects) {
  test.describe(`As PRO user, I can reload the page of ${project.title} and see the info kept`, () => {
    test.beforeEach(async ({ pageManager }) => {
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    });
    test(`Url of map is still the same`, async ({ page, pageManager }) => {
      await pageManager.fromNavigationMenu.goToMap();
      if (project.name !== 'disaster-ninja')
        await pageManager.atBrowser.waitForUrlToMatchPattern(/map=/);
      // TO DO: activate this check once 19103 issue is done
      // expect(page.url()).toContain('autotests');
      await pageManager.atMap.compareUrlsAfterReload(project);
      // TO DO: activate this check once 19103 issue is done
      // expect(page.url()).toContain('autotests');
    });
    test('My profile has the same data', async ({ page, pageManager }) => {
      await pageManager.fromNavigationMenu.goToProfilePage();
      const settingsValues = await pageManager.atProfilePage.getProfileData(project, {
        shouldOsmEditorBeSeenOnAtlas: true,
      });
      // TO DO: activate this check once 19103 issue is done
      // expect(page.url()).toContain('autotests');
      await pageManager.atProfilePage.compareUrlsAfterReload(project);
      // TO DO: activate this check once 19103 issue is done
      // expect(page.url()).toContain('autotests');
      const settingsValuesAfterReload = await pageManager.atProfilePage.getProfileData(
        project,
        { shouldOsmEditorBeSeenOnAtlas: true },
      );
      expect(settingsValuesAfterReload).toStrictEqual(settingsValues);
    });
  });
}
