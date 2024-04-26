import { Page } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';
import { Project } from './page-objects/helperBase.ts';
import { PageManager } from './page-objects/pageManager.ts';

let projects = getProjects();

// Temporally switched off untill 15482 issue is fixed
projects = projects.filter((arg) => arg.name !== 'disaster-ninja');

// Setting 3 retries for CI as it is very flacky with screenshots
process.env.CI
  ? test.describe.configure({ retries: 3 })
  : test.describe.configure({ retries: 1 });

// Moving test to a separate function to reuse it
const testLocation = async function (
  page: Page,
  pageManager: PageManager,
  project: Project,
) {
  await pageManager.atBrowser.openProject(project);
  await pageManager.fromNavigationMenu.goToMap();
  await page.getByText('Locate me').click({ timeout: 15000 });
  await pageManager.atMap.waitForUrlToMatchPattern(/40.714.*-74.0324/);

  // Wait for zoom to happen after url is changed
  process.env.CI ? await page.waitForTimeout(10000) : await page.waitForTimeout(6000);

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
