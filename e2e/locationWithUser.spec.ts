import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';
import type { Project } from './page-objects/helperBase.ts';

// User is not supported for oam as oam has login at map.openaerialmap.org to third-party system.
let projects = getProjects().filter((project) => project.name !== 'oam');
test.beforeEach(() => {
  stepCounter.counter = 0;
});

// Atlas has no 'Locate me' feature for user with no rights
projects = projects.filter((arg: Project) => arg.name !== 'atlas');

for (const project of projects) {
  // Setting geolocation permission and geolocation of user's browser
  test.use({
    permissions: ['geolocation'],
    geolocation: { longitude: 146.865, latitude: -30.229 },
  });

  test(`As User, I can click Locate me button at ${project.title} and see coordinates of my location in url`, async ({
    pageManager,
  }) => {
    test.skip(
      project.name === 'disaster-ninja',
      'Fix https://kontur.fibery.io/Tasks/Task/Locate-me-is-not-working-if-it-has-been-pressed-before-the-event-is-zoomed-in-15482 issue to unblock this test for disaster-ninja',
    );
    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');
    await pageManager.atToolBar.getButtonByText('Locate me').click({ timeout: 15000 });
    await pageManager.atMap.waitForUrlToMatchPattern(/-30\.2290\/146\.8650/);
    await pageManager.atMap.assertLocationInMapObject({
      expectedLatitude: -30.229,
      expectedLongitude: 146.865,
    });
  });
}
