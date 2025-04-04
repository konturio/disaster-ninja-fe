import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';
import type { Project } from './page-objects/helperBase.ts';

let projects = getProjects();
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
    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');
    await (
      await pageManager.atToolBar.getButtonByText('Locate me')
    ).click({ timeout: 15000 });
    await pageManager.atMap.waitForUrlToMatchPattern(/-30\.2290\/146\.8650/);
  });
}
