import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';
import type { Project } from './page-objects/helperBase.ts';
import type { PageManager } from './page-objects/pageManager.ts';

let projects = getProjects();
test.beforeEach(() => {
  stepCounter.counter = 0;
});

// Atlas has no 'Locate me' feature for guest
projects = projects.filter((arg: Project) => arg.name !== 'atlas');

// Moving test to a separate function to reuse it
const testLocation = async function (pageManager: PageManager, project: Project) {
  await pageManager.atBrowser.openProject(project);
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

  test(`As Guest, I can click Locate me button at ${project.title} and get zoomed to my location`, async ({
    pageManager,
  }) => {
    test.skip(
      project.name === 'disaster-ninja',
      'Fix https://kontur.fibery.io/Tasks/Task/Locate-me-is-not-working-if-it-has-been-pressed-before-the-event-is-zoomed-in-15482 issue to unblock this test for disaster-ninja',
    );
    await testLocation(pageManager, project);
  });
}
