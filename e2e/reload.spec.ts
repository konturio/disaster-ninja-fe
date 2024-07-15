import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

for (const project of projects) {
  test.describe(`As Guest, I can reload the page of ${project.title} and see the info kept`, () => {
    if (project.name != 'atlas') {
      test(`Url of map is still the same`, async ({ pageManager }) => {
        await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
        await pageManager.fromNavigationMenu.goToMap();
        await pageManager.atMap.compareUrlsAfterReload(project);
      });
    } else {
      test(`Map is not accessible, reloading does not help`, async ({ pageManager }) => {
        await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
        await pageManager.fromNavigationMenu.checkThereIsNoMap();
        await pageManager.atLoginPage.compareUrlsAfterReload(project);
        await pageManager.fromNavigationMenu.checkThereIsNoMap();
      });
    }
  });
}
