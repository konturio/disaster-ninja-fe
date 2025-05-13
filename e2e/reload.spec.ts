import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';

const projects = getProjects();
test.beforeEach(() => {
  stepCounter.counter = 0;
});

for (const project of projects) {
  test.describe(`As Guest, I can reload the page of ${project.title} and see the info kept`, () => {
    if (project.name !== 'atlas') {
      test(`Url of map is still the same`, async ({ pageManager }) => {
        test.fixme(
          project.name === 'oam',
          'Fix https://kontur.fibery.io/Tasks/Task/reopen-routing-oam-url-param-map-2.122--0.000-0.000-is-opened-first-instead-of-map-2.122-0.000-0.000-21381 to unblock oam test',
        );
        test.fixme(
          true,
          'Fix https://kontur.fibery.io/Tasks/Task/Disaster-Ninja-extra-focused-geometry-parameter-after-page-reloading-21604 to unblock this test',
        );
        await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
        await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');
        if (project.name !== 'disaster-ninja')
          await pageManager.atBrowser.waitForUrlToMatchPattern(/map=/);
        pageManager.atBrowser.checkCampaignIsAutotest();
        await pageManager.atMap.compareUrlsAfterReload(project);
        pageManager.atBrowser.checkCampaignIsAutotest();
      });
    } else {
      test(`Map is not accessible`, async ({ pageManager }) => {
        await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
        await pageManager.atNavigationMenu.checkThereIsNoMap();
        pageManager.atBrowser.checkCampaignIsAutotest();
        await pageManager.atLoginPage.compareUrlsAfterReload(project);
        pageManager.atBrowser.checkCampaignIsAutotest();
        await pageManager.atNavigationMenu.checkThereIsNoMap();
      });
    }
  });
}
