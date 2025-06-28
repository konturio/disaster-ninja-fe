import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';
import type { Project } from './page-objects/helperBase.ts';
import type { PageManager } from './page-objects/pageManager.ts';

// Pro user is not supported for oam as oam has login at map.openaerialmap.org to third-party system.
const projects = getProjects().filter((project) => project.name !== 'oam');
test.beforeEach(() => {
  stepCounter.counter = 0;
});

// Moving test to a separate function to reuse it
const testLocation = async function (pageManager: PageManager, project: Project) {
  await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
  await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');
  await pageManager.atToolBar.getButtonByText('Locate me').click({ timeout: 15000 });
  await pageManager.atMap.waitForUrlToMatchPattern(/40\.7140\/-74\.0324/);

  // Wait for zoom to happen after url is changed
  await pageManager.atMap.waitForZoom();
  await pageManager.atMap.assertLocationInMapObject({
    expectedLatitude: 40.714,
    expectedLongitude: -74.0324,
  });
};

for (const project of projects) {
  // Setting geolocation permission and geolocation of user's browser
  test.use({
    permissions: ['geolocation'],
    geolocation: { longitude: -74.0324, latitude: 40.714 },
  });

  test(`As PRO User, I can click Locate me button at ${project.title} and get zoomed to my location`, async ({
    pageManager,
  }) => {
    await testLocation(pageManager, project);
  });
}
