import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

let projects = getProjects();

// Temporally switched off untill 15482 issue is fixed
projects = projects.filter((arg) => arg.name !== 'disaster-ninja');

for (const project of projects) {
  test.use({
    permissions: ['geolocation'],
    geolocation: { longitude: -74.0324, latitude: 40.714 },
  });
  test(`As Guest, I can click Locate me button at ${project.title} and get zoomed to my location`, async ({
    page,
    pageManager,
  }) => {
    await pageManager.atBrowser.openProject(project);
    await pageManager.fromNavigationMenu.goToMap();
    await page.getByText('Locate me').click();
    await pageManager.atMap.waitForUrlToMatchPattern(/40.714.*-74.0324/);

    // Wait for zoom to happen after url is changed
    await page.waitForTimeout(4000);
    await pageManager.atMap.compareScreenshotsOfMap(100);
  });
}
