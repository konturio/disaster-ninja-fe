import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

for (const project of projects) {
  test.describe(`As Guest, I can reload the page of ${project.title} and see the info kept`, () => {
    if (project.name != 'atlas') {
      test(`Url of map is still the same`, async ({ page, pageManager }) => {
        await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
        await pageManager.fromNavigationMenu.goToMap();
        if (project.name != 'disaster-ninja')
          await pageManager.atBrowser.waitForUrlToMatchPattern(/map=/);
        expect(page.url()).toContain('autotests');
        await pageManager.atMap.compareUrlsAfterReload(project);
        expect(page.url()).toContain('autotests');
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
        // TO DO: activate this check once 19103 issue is done
        // expect(page.url()).toContain('autotests');
        await pageManager.fromNavigationMenu.checkThereIsNoMap();
      });
    }
  });
}
