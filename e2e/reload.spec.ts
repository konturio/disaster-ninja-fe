import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

for (const project of projects) {
  test.describe(`As Guest, I can reload the page of ${project.title} and see the info kept`, () => {
    test(`Url of map is still the same`, async ({ pageManager }) => {
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
      await pageManager.fromNavigationMenu.goToMap();
      await pageManager.atMap.compareUrlsAfterReload(project);
    });
  });
}
