import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';
import type { Page } from '@playwright/test';
import type { Project } from './page-objects/helperBase.ts';
import type { PageManager } from './page-objects/pageManager.ts';

let projects = getProjects();

// Temporally switched off disaster-ninja untill 15482 issue is fixed
// Temporally switched off oam untill 18508 issue is fixed
// Atlas has no 'Locate me' feature for guest

projects = projects.filter((arg) => arg.name === 'smart-city');

// Setting 3 retries for CI as it is very flacky with screenshots
const retriesNumber = process.env.CI ? 3 : 1;
test.describe.configure({ retries: retriesNumber });

// Moving test to a separate function to reuse it
const testLocation = async function (pageManager: PageManager, project: Project) {
  await pageManager.atBrowser.openProject(project);
  await pageManager.fromNavigationMenu.goToMap();
  await (
    await pageManager.atToolBar.getButtonByText('Locate me')
  ).click({ timeout: 15000 });
  await pageManager.atMap.waitForUrlToMatchPattern(/40\.7140\/-74\.0324/);

  // Wait for zoom to happen after url is changed
  await pageManager.atMap.waitForZoom();

  // OAM has no colors so it needs more accuracy

  const pixelsDifference = project.name === 'oam' ? 0.01 : 0.03;
  await pageManager.atMap.compareScreenshotsOfMap(pixelsDifference);
};

for (const project of projects) {
  // Setting geolocation permission and geolocation of user's browser
  test.use({
    permissions: ['geolocation'],
    geolocation: { longitude: -74.0324, latitude: 40.714 },
  });

  // Prod has other dimensions of screenshots so test fails if using wrong screenshot. Screenshots are created by test name, browser and OS by playwright

  if (project.env != 'prod') {
    test(`As Guest, I can click Locate me button at ${project.title} and get zoomed to my location`, async ({
      pageManager,
    }) => {
      await testLocation(pageManager, project);
    });
  } else {
    test(`As Guest, I can click Locate me button at ${project.title} and get zoomed to my location (prod)`, async ({
      pageManager,
    }) => {
      await testLocation(pageManager, project);
    });
  }
}
