import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';
import type { Page } from '@playwright/test';
import type { Project } from './page-objects/helperBase.ts';
import type { PageManager } from './page-objects/pageManager.ts';

let projects = getProjects();

// Temporally switched off untill 15482 issue is fixed
projects = projects.filter((arg) => arg.name !== 'disaster-ninja');

// Setting 3 retries for CI as it is very flacky with screenshots
const retriesNumber = process.env.CI ? 3 : 1;
test.describe.configure({ retries: retriesNumber });

// Moving test to a separate function to reuse it
const testLocation = async function (
  page: Page,
  pageManager: PageManager,
  project: Project,
) {
  await pageManager.atBrowser.openProject(project);
  await pageManager.fromNavigationMenu.goToMap();
  // TO DO: remove this action after Atlas is launched
  await pageManager.atBrowser.closeAtlasBanner(project);
  await page.getByText('Locate me').click({ timeout: 15000 });
  await pageManager.atMap.waitForUrlToMatchPattern(/40.714.*-74.0324/);

  // Wait for zoom to happen after url is changed
  const locateMeTimeout = process.env.CI ? 10000 : 6000;
  await page.waitForTimeout(locateMeTimeout);

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
      page,
      pageManager,
    }) => {
      await testLocation(page, pageManager, project);
    });
  } else {
    test(`As Guest, I can click Locate me button at ${project.title} and get zoomed to my location (prod)`, async ({
      page,
      pageManager,
    }) => {
      await testLocation(page, pageManager, project);
    });
  }
}
